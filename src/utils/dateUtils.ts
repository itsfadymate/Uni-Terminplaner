
const MONTHS: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Parse any date string from a schedule row into a standard Date object.
 * Supports:
 * - "Tuesday, October 13, 2026"
 * - "October 13, 2026" or "13 October 2026"
 * - "13.10.2026" or "13/10/2026"
 * - "2026-10-13"
 */
export function parseScheduleDate(dateStr?: string): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const str = dateStr.trim();

  // Pattern 1: Month Name and Day and Year (e.g. "Tuesday, October 13, 2026" or "October 13, 2026")
  const monthDayYear = str.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+(\d{1,2}),?\s+(\d{4})\b/i
  );
  if (monthDayYear) {
    const month = MONTHS[monthDayYear[1].toLowerCase()];
    const day = parseInt(monthDayYear[2], 10);
    const year = parseInt(monthDayYear[3], 10);
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Pattern 2: Day Month Name Year (e.g. "13 October 2026")
  const dayMonthYear = str.match(
    /\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)),?\s+(\d{4})\b/i
  );
  if (dayMonthYear) {
    const day = parseInt(dayMonthYear[1], 10);
    const month = MONTHS[dayMonthYear[2].toLowerCase()];
    const year = parseInt(dayMonthYear[3], 10);
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Pattern 3: dd.mm.yyyy or dd/mm/yyyy
  const ddmmyyyy = str.match(/\b(\d{1,2})[\.\/-](\d{1,2})[\.\/-](\d{4})\b/);
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1], 10);
    const month = parseInt(ddmmyyyy[2], 10) - 1;
    const year = parseInt(ddmmyyyy[3], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  // Pattern 4: Fallback standard Date.parse
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

/**
 * Format date to standard ISO "YYYY-MM-DD"
 */
export function toIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format to readable "Tuesday, October 13, 2026"
 */
export function formatFullDate(d: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Format to short "Oct 13"
 */
export function formatShortDate(d: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
}
