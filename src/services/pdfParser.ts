import * as pdfjsLib from 'pdfjs-dist';
import type { CohortSchedule, ScheduleEntry, Lecture, DayOfWeek } from '../types';
import { TIME_SLOTS } from '../constants';
import { parseScheduleDate, formatFullDate } from '../utils/dateUtils';

// Set up the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface TextItem {
  str: string;
  transform: number[]; // [scaleX, skewY, skewX, scaleY, posX, posY]
  width: number;
  height: number;
}

const DAY_MAP: Record<string, DayOfWeek> = {
  mon: 'Monday',
  monday: 'Monday',
  tue: 'Tuesday',
  tues: 'Tuesday',
  tuesday: 'Tuesday',
  wed: 'Wednesday',
  wednesday: 'Wednesday',
  thu: 'Thursday',
  thur: 'Thursday',
  thurs: 'Thursday',
  thursday: 'Thursday',
  fri: 'Friday',
  friday: 'Friday',
  sat: 'Saturday',
  saturday: 'Saturday',
};

/**
 * Parse a PDF schedule file into a CohortSchedule.
 */
export async function parsePdfSchedule(
  pdfData: ArrayBuffer,
  fileName: string
): Promise<CohortSchedule> {
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const rawEntries: ScheduleEntry[] = [];
  let currentTeachingWeek: string | undefined;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    const items: TextItem[] = textContent.items
      .filter((item: any) => 'str' in item && item.str.trim())
      .map((item: any) => ({
        str: item.str,
        transform: item.transform,
        width: item.width || 0,
        height: item.height || 0,
      }));

    if (items.length === 0) continue;

    const { entries: pageEntries, lastTeachingWeek } = extractTableFromPage(
      items,
      viewport.height,
      viewport.width,
      currentTeachingWeek
    );

    if (lastTeachingWeek) {
      currentTeachingWeek = lastTeachingWeek;
    }

    rawEntries.push(...pageEntries);
  }

  // Deduplicate and sort all entries in strict chronological ascending order
  const entries = sortAndOrganizeEntries(rawEntries);

  // Extract all distinct weeks in chronological order
  const weeksList: string[] = [];
  const seenWeeks = new Set<string>();
  for (const e of entries) {
    if (e.teachingWeek && !seenWeeks.has(e.teachingWeek)) {
      seenWeeks.add(e.teachingWeek);
      weeksList.push(e.teachingWeek);
    }
  }

  const cohort = extractCohortName(fileName);

  return {
    cohort,
    fileName,
    entries,
    weeks: weeksList.length > 0 ? weeksList : undefined,
  };
}

/**
 * Sort entries in strict ascending chronological order by date, then day, then slot.
 */
function sortAndOrganizeEntries(entries: ScheduleEntry[]): ScheduleEntry[] {
  // Group entries by day + dateStr
  const dayGroups = new Map<string, ScheduleEntry[]>();

  for (const entry of entries) {
    const key = `${entry.day}_${entry.dateStr || ''}_${entry.teachingWeek || ''}`;
    if (!dayGroups.has(key)) {
      dayGroups.set(key, []);
    }
    dayGroups.get(key)!.push(entry);
  }

  // Sort groups by parsed date timestamp
  const sortedGroupKeys = Array.from(dayGroups.keys()).sort((keyA, keyB) => {
    const entriesA = dayGroups.get(keyA)!;
    const entriesB = dayGroups.get(keyB)!;
    const dateA = parseScheduleDate(entriesA[0]?.dateStr);
    const dateB = parseScheduleDate(entriesB[0]?.dateStr);

    if (dateA && dateB) {
      return dateA.getTime() - dateB.getTime();
    }
    if (dateA) return -1;
    if (dateB) return 1;
    return 0;
  });

  const sortedEntries: ScheduleEntry[] = [];
  for (const key of sortedGroupKeys) {
    const group = dayGroups.get(key)!;
    // Ensure the 5 slots are ordered 0 to 4
    for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
      const slot = TIME_SLOTS[slotIdx];
      const match = group.find(
        (e) => e.timeSlot.start === slot.start || e.timeSlot.label === slot.label
      );
      if (match) {
        sortedEntries.push(match);
      } else {
        const ref = group[0];
        sortedEntries.push({
          day: ref.day,
          dateStr: ref.dateStr,
          teachingWeek: ref.teachingWeek,
          timeSlot: slot,
          lecture: null,
        });
      }
    }
  }

  return sortedEntries;
}

/**
 * Extract schedule rows from a PDF page.
 */
function extractTableFromPage(
  items: TextItem[],
  pageHeight: number,
  pageWidth: number,
  initialTeachingWeek?: string
): { entries: ScheduleEntry[]; lastTeachingWeek?: string } {
  const entries: ScheduleEntry[] = [];

  // Convert bottom-up PDF coordinates to top-down coordinates
  const normalizedItems = items.map((i) => ({
    ...i,
    x: i.transform[4],
    y: pageHeight - i.transform[5],
  }));

  // Identify all row items grouped by Day
  const { rows: visualRows, lastTeachingWeek } = groupItemsIntoScheduleRows(
    normalizedItems,
    initialTeachingWeek
  );

  for (const row of visualRows) {
    const { day, dateStr, teachingWeek, items: rowItems } = row;
    if (rowItems.length === 0) continue;

    // Calculate the 5 time slot column boundaries for this row
    const boundaries = calculate5SlotBoundaries(rowItems, pageWidth);
    if (!boundaries || boundaries.length !== 5) continue;

    const rowEntries: ScheduleEntry[] = [];

    // Assign items into the 5 time slots
    for (let slotIdx = 0; slotIdx < 5; slotIdx++) {
      const { startX, endX } = boundaries[slotIdx];

      // Collect items inside this slot interval
      const cellItems = rowItems.filter((i) => {
        // Exclude items in the metadata section
        if (i.x < boundaries[0].startX - 2) return false;
        if (isMetadataItem(i.str)) return false;

        const midX = i.x + (i.width > 0 ? i.width / 2 : 0);
        return midX >= startX - 3 && midX < endX + 3;
      });

      // Sort items top-to-bottom then left-to-right
      cellItems.sort((a, b) => {
        if (Math.abs(a.y - b.y) > 4) return a.y - b.y;
        return a.x - b.x;
      });

      const cellText = cellItems.map((i) => i.str).join(' ').trim();
      const lecture = cellText ? parseLectureCell(cellText) : null;

      rowEntries.push({
        day,
        dateStr,
        teachingWeek,
        timeSlot: TIME_SLOTS[slotIdx],
        lecture,
      });
    }

    // Post-processing pass: pair separated rooms and course names
    pairSeparatedRoomsAndLectures(rowEntries);

    entries.push(...rowEntries);
  }

  return { entries, lastTeachingWeek };
}

/**
 * Ensures room numbers and course descriptions that were separated across
 * adjacent columns are properly merged together into a single complete lecture.
 */
function pairSeparatedRoomsAndLectures(entries: ScheduleEntry[]): void {
  for (let i = 0; i < entries.length; i++) {
    const current = entries[i];

    // Case 1: Current slot has a lecture, but room is missing
    if (current.lecture && !current.lecture.room) {
      // Check if next slot has only a room number
      if (i + 1 < entries.length && entries[i + 1].lecture) {
        const next = entries[i + 1].lecture!;
        if (
          next.room &&
          (!next.name ||
            next.name === 'Scheduled Session' ||
            next.name.startsWith('Lecture (Room') ||
            next.name === 'Unknown Lecture')
        ) {
          current.lecture.room = next.room;
          entries[i + 1].lecture = null; // Clear the ghost slot
        }
      }
    }

    // Case 2: Current slot has only a room number with no course name
    if (
      current.lecture &&
      current.lecture.room &&
      (!current.lecture.name ||
        current.lecture.name === 'Scheduled Session' ||
        current.lecture.name.startsWith('Lecture (Room') ||
        current.lecture.name === 'Unknown Lecture')
    ) {
      // Check if preceding slot had a lecture with no room
      if (i > 0 && entries[i - 1].lecture && !entries[i - 1].lecture?.room) {
        entries[i - 1].lecture!.room = current.lecture.room;
        current.lecture = null; // Clear the ghost slot
      }
    }
  }
}

/**
 * Calculate the horizontal boundaries for the 5 university time slots.
 */
function calculate5SlotBoundaries(
  items: Array<TextItem & { x: number; y: number }>,
  pageWidth: number
): Array<{ startX: number; endX: number }> | null {
  if (items.length === 0) return null;

  const allX = items.map((i) => i.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...items.map((i) => i.x + i.width));
  const tableWidth = maxX - minX;

  // Metadata items are strictly in the leftmost 38%
  const metadataItems = items.filter((i) => {
    // Room numbers like "2.07" are NEVER metadata!
    if (/^\d{1,2}\.\d{2}[a-zA-Z]?$/.test(i.str.trim())) return false;
    return isMetadataItem(i.str) || i.x < minX + tableWidth * 0.38;
  });

  let slotsStartX = minX + tableWidth * 0.36;
  if (metadataItems.length > 0) {
    const maxMetaX = Math.max(...metadataItems.map((i) => i.x + i.width));
    slotsStartX = Math.max(maxMetaX + 2, minX + tableWidth * 0.34);
  }

  const slotsEndX = Math.max(maxX, Math.min(pageWidth * 0.98, minX + tableWidth * 0.98));
  const availableWidth = slotsEndX - slotsStartX;

  if (availableWidth <= 50) return null;

  const slotWidth = availableWidth / 5;
  const boundaries: Array<{ startX: number; endX: number }> = [];

  for (let i = 0; i < 5; i++) {
    boundaries.push({
      startX: slotsStartX + i * slotWidth,
      endX: slotsStartX + (i + 1) * slotWidth,
    });
  }

  return boundaries;
}

interface ScheduleRowData {
  day: DayOfWeek;
  dateStr?: string;
  teachingWeek?: string;
  items: Array<TextItem & { x: number; y: number }>;
}

/**
 * Group text items into rows representing each day of each teaching week.
 * Carries forward the teachingWeek label across merged table blocks.
 */
function groupItemsIntoScheduleRows(
  items: Array<TextItem & { x: number; y: number }>,
  initialTeachingWeek?: string
): { rows: ScheduleRowData[]; lastTeachingWeek?: string } {
  const result: ScheduleRowData[] = [];
  let currentTeachingWeek = initialTeachingWeek;

  // Find day indicator items (e.g. "Mon", "Tue", etc.) in the metadata area
  const dayIndicators: Array<{
    day: DayOfWeek;
    y: number;
    item: TextItem & { x: number; y: number };
  }> = [];

  for (const item of items) {
    const clean = item.str.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (clean in DAY_MAP && item.x < 350) {
      dayIndicators.push({
        day: DAY_MAP[clean],
        y: item.y,
        item,
      });
    }
  }

  dayIndicators.sort((a, b) => a.y - b.y);

  if (dayIndicators.length === 0) {
    return { rows: result, lastTeachingWeek: currentTeachingWeek };
  }

  for (let i = 0; i < dayIndicators.length; i++) {
    const current = dayIndicators[i];
    const nextY =
      i < dayIndicators.length - 1
        ? dayIndicators[i + 1].y
        : current.y + 75;

    const prevY = i > 0 ? dayIndicators[i - 1].y : current.y - 25;
    const minY = (prevY + current.y) / 2;
    const maxY = (current.y + nextY) / 2;

    const rowItems = items.filter((item) => item.y >= minY && item.y < maxY);

    let rowTeachingWeek: string | undefined;
    let dateStr: string | undefined;

    for (const item of rowItems) {
      const text = item.str.trim();

      // Check for Teaching Week (e.g. "Teaching Week 3", "Week 3", "Teaching Week 03")
      const weekMatch = text.match(/\b(Teaching\s+Week\s+\d+|Week\s+\d+)\b/i);
      if (weekMatch) {
        rowTeachingWeek = weekMatch[1];
        currentTeachingWeek = weekMatch[1]; // Carry forward for subsequent merged rows!
      }

      // Check for Date string
      const dateMatch =
        text.match(
          /\b(?:[A-Za-z]+day,?\s+)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+\d{1,2},?\s+\d{4}\b/i
        ) ||
        text.match(
          /\b(?:[A-Za-z]+day,?\s+)?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+\d{1,2}\b/i
        ) ||
        text.match(/\b\d{1,2}[\.\/-]\d{1,2}[\.\/-]\d{2,4}\b/);

      if (dateMatch && !dateStr) {
        dateStr = dateMatch[0];
      }
    }

    // Fallback: If no explicit week text on this row, use carried forward week
    const effectiveWeek = rowTeachingWeek || currentTeachingWeek;

    // If dateStr is found, format it cleanly
    if (dateStr) {
      const parsed = parseScheduleDate(dateStr);
      if (parsed) {
        dateStr = formatFullDate(parsed);
      }
    }

    result.push({
      day: current.day,
      dateStr,
      teachingWeek: effectiveWeek,
      items: rowItems,
    });
  }

  return { rows: result, lastTeachingWeek: currentTeachingWeek };
}

/**
 * Check if text belongs strictly to metadata columns (Teaching Week, Day, Date, Cohort).
 * IMPORTANT: Room numbers (e.g. "2.07", "3.16") MUST NEVER match here!
 */
function isMetadataItem(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  // ROOM NUMBERS: Never treat as metadata!
  if (/^\d{1,2}\.\d{2}[a-zA-Z]?$/.test(trimmed)) return false;
  if (/^(H\d{1,2}|Auditorium|C\d\.\d{2})$/i.test(trimmed)) return false;

  // Teaching Week
  if (/^teaching\s*week/i.test(trimmed) || /^week\s*\d+/i.test(trimmed)) return true;

  // Day abbreviations/names
  const clean = trimmed.toLowerCase().replace(/[^a-z]/g, '');
  if (clean in DAY_MAP) return true;

  // Dates with month names
  if (
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(trimmed) &&
    /\d{1,2}/.test(trimmed)
  ) {
    return true;
  }

  // ONLY 3-part dates with TWO slashes/dots (e.g. 13.10.2026 or 13/10/2026)
  if (/^\d{1,2}[\.\/-]\d{1,2}[\.\/-]\d{2,4}$/.test(trimmed)) return true;

  // Cohort labels e.g. "9MET", "8MET", "MET Msc V 1.6", "CS Year 3", "BI"
  if (/^\d{1,2}[A-Z]{2,4}$/i.test(trimmed)) return true;
  if (/^[A-Z]{2,4}\s*(Msc|Bsc)?(\s*V\s*\d+(\.\d+)?)?$/i.test(trimmed)) return true;

  return false;
}

/**
 * Parse a cell's text content into a clean Lecture object.
 */
export function parseLectureCell(text: string): Lecture | null {
  if (!text || text.trim().length === 0) return null;

  const cleaned = text.replace(/\s+/g, ' ').trim();

  // Skip cells that are solely metadata
  if (isMetadataItem(cleaned)) return null;

  // Extract room number: e.g. "2.07", "3.16", "3.01", "H01", "C2.07", "Room 2.07"
  let room = '';
  const roomRegex = /\b(?:Room\s*[:#]?\s*)?(\d{1,2}\.\d{2}[a-zA-Z]?|H\d{1,2}|C\d{1,2}\.\d{2}|Auditorium)\b/i;
  const roomMatch = cleaned.match(roomRegex);
  if (roomMatch) {
    room = roomMatch[1];
  }

  // Extract instructor: text inside parentheses "(Dr. Amr Helmy + TA: Donia Ali)"
  let instructor: string | undefined;
  const instructorMatch = cleaned.match(/\(([^)]+)\)/);
  if (instructorMatch) {
    instructor = instructorMatch[1].trim();
  }

  // Clean lecture name: remove room number and instructor
  let name = cleaned;
  if (room) {
    name = name.replace(new RegExp(`\\b${room}\\b`, 'gi'), '');
    name = name.replace(/Room\s*[:#]?/gi, '');
  }
  if (instructorMatch) {
    name = name.replace(instructorMatch[0], '');
  }

  // Clean up remaining asterisks, dashes, commas, and excessive whitespace
  name = name
    .replace(/[*_#]/g, '')
    .replace(/^[,\s\-:]+|[,\s\-:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // If there is no name and no room, cell is empty
  if (!name && !room) return null;

  return {
    name,
    room,
    instructor,
    rawText: cleaned,
  };
}

/**
 * Extract a readable cohort name from a PDF filename.
 */
export function extractCohortName(fileName: string): string {
  let name = fileName.replace(/\.pdf$/i, '');
  name = name.replace(/_/g, ' ');
  name = name.replace(/\s*(schedule|timetable|ws\d+|ss\d+)\s*/gi, ' ');
  name = name.replace(/([a-zA-Z])(\d)/g, '$1 $2');
  name = name.replace(/(\d)([a-zA-Z])/g, '$1 $2');
  name = name.replace(/\s+/g, ' ').trim();
  return name || fileName;
}
