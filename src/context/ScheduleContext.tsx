import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CohortSchedule, ScheduleEntry, RoomStatus, DayOfWeek, AppConfig } from '../types';
import { fetchDriveFiles, fetchPdfContent } from '../services/driveService';
import { parsePdfSchedule } from '../services/pdfParser';
import { TIME_SLOTS, DAYS, getTodayDay } from '../constants';
import { SAMPLE_SCHEDULES, KNOWN_GIU_ROOMS } from '../data/sampleSchedules';

interface ScheduleState {
  schedules: CohortSchedule[];
  loading: boolean;
  error: string | null;
  progress: { current: number; total: number } | null;
  config: AppConfig;
  selectedCohort: string | null;
  selectedDay: DayOfWeek | null;
  selectedWeek: string | null;
}

interface ScheduleContextType extends ScheduleState {
  loadSchedules: () => Promise<void>;
  uploadPdfFiles: (files: FileList | File[]) => Promise<void>;
  loadDemoData: () => void;
  clearSchedules: () => void;
  setSelectedCohort: (cohort: string | null) => void;
  setSelectedDay: (day: DayOfWeek | null) => void;
  setSelectedWeek: (week: string | null) => void;
  setConfig: (config: AppConfig) => void;
  getCohortNames: () => string[];
  getAvailableWeeks: (cohort: string) => string[];
  getDailySchedule: (cohort: string, day: DayOfWeek, week?: string | null) => CohortSchedule['entries'];
  getWeeklySchedule: (cohort: string, week?: string | null) => CohortSchedule['entries'];
  getDateForDay: (cohort: string, day: DayOfWeek, week?: string | null) => string | undefined;
  getEmptyRooms: (day: DayOfWeek, slotIndex: number, week?: string | null) => RoomStatus[];
  getAllRooms: () => string[];
}

const ScheduleContext = createContext<ScheduleContextType | null>(null);

const CONFIG_STORAGE_KEY = 'giu_schedule_config';
const SCHEDULE_STORAGE_KEY = 'giu_schedule_data';

function loadStoredConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { proxyUrl: '', folderId: '1n2n3ILYgJ-oBmC-7v9R6250uCpnjI4_5' };
}

function saveConfig(config: AppConfig) {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
}

function loadStoredSchedules(): CohortSchedule[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return SAMPLE_SCHEDULES;
}

function saveSchedules(schedules: CohortSchedule[]) {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
  } catch { /* Storage might be full */ }
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<CohortSchedule[]>(loadStoredSchedules);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [config, setConfigState] = useState<AppConfig>(loadStoredConfig);

  const [selectedCohort, setSelectedCohort] = useState<string | null>(() => {
    const initial = loadStoredSchedules();
    return initial.length > 0 ? initial[0].cohort : null;
  });

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(getTodayDay);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(() => {
    const initial = loadStoredSchedules();
    if (initial.length > 0 && initial[0].weeks && initial[0].weeks.length > 0) {
      return initial[0].weeks[0];
    }
    return null;
  });

  const setConfig = useCallback((newConfig: AppConfig) => {
    setConfigState(newConfig);
    saveConfig(newConfig);
  }, []);

  const loadDemoData = useCallback(() => {
    setSchedules(SAMPLE_SCHEDULES);
    saveSchedules(SAMPLE_SCHEDULES);
    setSelectedCohort(SAMPLE_SCHEDULES[0].cohort);
    setSelectedWeek(SAMPLE_SCHEDULES[0].weeks?.[0] ?? null);
    setError(null);
  }, []);

  const clearSchedules = useCallback(() => {
    setSchedules([]);
    saveSchedules([]);
    setSelectedCohort(null);
    setSelectedWeek(null);
  }, []);

  const getAvailableWeeks = useCallback(
    (cohort: string): string[] => {
      const schedule = schedules.find((s) => s.cohort === cohort);
      if (!schedule) return [];

      const weeks = new Set<string>();

      if (schedule.weeks && schedule.weeks.length > 0) {
        for (const w of schedule.weeks) weeks.add(w);
      }

      for (const e of schedule.entries) {
        if (e.teachingWeek) weeks.add(e.teachingWeek);
      }

      return Array.from(weeks);
    },
    [schedules]
  );

  const uploadPdfFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);
    setProgress({ current: 0, total: files.length });

    try {
      const parsed: CohortSchedule[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await file.arrayBuffer();
        const schedule = await parsePdfSchedule(buffer, file.name);
        parsed.push(schedule);
        setProgress({ current: i + 1, total: files.length });
      }

      setSchedules((prev) => {
        const merged = [...prev];
        for (const item of parsed) {
          const idx = merged.findIndex(
            (m) => m.cohort === item.cohort || m.fileName === item.fileName
          );
          if (idx >= 0) {
            merged[idx] = item;
          } else {
            merged.push(item);
          }
        }
        saveSchedules(merged);
        return merged;
      });

      if (parsed.length > 0) {
        const first = parsed[0];
        setSelectedCohort(first.cohort);
        if (first.weeks && first.weeks.length > 0) {
          setSelectedWeek(first.weeks[0]);
        } else {
          const foundWeek = first.entries.find((e) => e.teachingWeek)?.teachingWeek;
          setSelectedWeek(foundWeek ?? null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse uploaded PDF(s)');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  const loadSchedules = useCallback(async () => {
    if (!config.proxyUrl) {
      setError('Please configure the Google Apps Script proxy URL in Settings.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      const files = await fetchDriveFiles(config.proxyUrl, config.folderId);

      if (files.length === 0) {
        setError('No PDF files found in the Drive folder.');
        setLoading(false);
        return;
      }

      const parsed: CohortSchedule[] = [];
      setProgress({ current: 0, total: files.length });

      for (let i = 0; i < files.length; i++) {
        try {
          const pdfData = await fetchPdfContent(config.proxyUrl, files[i].id);
          const schedule = await parsePdfSchedule(pdfData, files[i].name);
          parsed.push(schedule);
        } catch (err) {
          console.warn(`Failed to parse ${files[i].name}:`, err);
        }
        setProgress({ current: i + 1, total: files.length });
      }

      setSchedules(parsed);
      saveSchedules(parsed);

      if (parsed.length > 0) {
        const first = parsed[0];
        setSelectedCohort(first.cohort);
        if (first.weeks && first.weeks.length > 0) {
          setSelectedWeek(first.weeks[0]);
        } else {
          const foundWeek = first.entries.find((e) => e.teachingWeek)?.teachingWeek;
          setSelectedWeek(foundWeek ?? null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, [config]);

  const getCohortNames = useCallback(() => {
    return schedules.map((s) => s.cohort).sort();
  }, [schedules]);

  const getDateForDay = useCallback(
    (cohort: string, day: DayOfWeek, week?: string | null): string | undefined => {
      const schedule = schedules.find((s) => s.cohort === cohort);
      if (!schedule) return undefined;

      const availableWeeks = getAvailableWeeks(cohort);
      const effectiveWeek =
        week ?? selectedWeek ?? (availableWeeks.length > 0 ? availableWeeks[0] : null);

      const dayEntries = schedule.entries.filter((e) => e.day === day);

      if (effectiveWeek) {
        const matched = dayEntries.find(
          (e) => e.teachingWeek === effectiveWeek && e.dateStr
        );
        if (matched?.dateStr) return matched.dateStr;
      }

      // If only 1 week exists in the schedule, allow fallback
      if (availableWeeks.length <= 1) {
        return dayEntries.find((e) => e.dateStr)?.dateStr;
      }

      return undefined;
    },
    [schedules, selectedWeek, getAvailableWeeks]
  );

  /**
   * Returns EXACTLY the 5 time slots in ascending order for the requested cohort, day, and week.
   */
  const getDailySchedule = useCallback(
    (cohort: string, day: DayOfWeek, week?: string | null) => {
      const schedule = schedules.find((s) => s.cohort === cohort);
      if (!schedule) return [];

      const availableWeeks = getAvailableWeeks(cohort);
      const effectiveWeek =
        week ?? selectedWeek ?? (availableWeeks.length > 0 ? availableWeeks[0] : null);

      let dayEntries = schedule.entries.filter((e) => e.day === day);

      if (effectiveWeek) {
        const filtered = dayEntries.filter((e) => e.teachingWeek === effectiveWeek);
        if (filtered.length > 0) {
          dayEntries = filtered;
        }
      }

      const dateStr = dayEntries.find((e) => e.dateStr)?.dateStr;
      const teachingWeek =
        dayEntries.find((e) => e.teachingWeek)?.teachingWeek ?? effectiveWeek ?? undefined;

      // Always produce EXACTLY the 5 time slots in ascending order
      const result: ScheduleEntry[] = [];
      for (let i = 0; i < TIME_SLOTS.length; i++) {
        const slot = TIME_SLOTS[i];
        const match = dayEntries.find(
          (e) => e.timeSlot.start === slot.start || e.timeSlot.label === slot.label
        );

        result.push({
          day,
          dateStr: match?.dateStr ?? dateStr,
          teachingWeek: match?.teachingWeek ?? teachingWeek,
          timeSlot: slot,
          lecture: match?.lecture ?? null,
        });
      }

      return result;
    },
    [schedules, selectedWeek, getAvailableWeeks]
  );

  /**
   * Returns a 6-day x 5-slot grid for the requested cohort and week.
   */
  const getWeeklySchedule = useCallback(
    (cohort: string, week?: string | null) => {
      const schedule = schedules.find((s) => s.cohort === cohort);
      if (!schedule) return [];

      const availableWeeks = getAvailableWeeks(cohort);
      const effectiveWeek =
        week ?? selectedWeek ?? (availableWeeks.length > 0 ? availableWeeks[0] : null);

      let entries = schedule.entries;
      if (effectiveWeek) {
        const filtered = entries.filter((e) => e.teachingWeek === effectiveWeek);
        if (filtered.length > 0) entries = filtered;
      }

      const result: ScheduleEntry[] = [];
      for (const day of DAYS) {
        const dayEntries = entries.filter((e) => e.day === day);
        const dateStr = dayEntries.find((e) => e.dateStr)?.dateStr;
        const teachingWeek =
          dayEntries.find((e) => e.teachingWeek)?.teachingWeek ?? effectiveWeek ?? undefined;

        for (const slot of TIME_SLOTS) {
          const match = dayEntries.find(
            (e) => e.timeSlot.start === slot.start || e.timeSlot.label === slot.label
          );

          result.push({
            day,
            dateStr: match?.dateStr ?? dateStr,
            teachingWeek: match?.teachingWeek ?? teachingWeek,
            timeSlot: slot,
            lecture: match?.lecture ?? null,
          });
        }
      }

      return result;
    },
    [schedules, selectedWeek, getAvailableWeeks]
  );

  const getAllRooms = useCallback(() => {
    const rooms = new Set<string>(KNOWN_GIU_ROOMS);
    for (const schedule of schedules) {
      for (const entry of schedule.entries) {
        if (entry.lecture?.room) {
          rooms.add(entry.lecture.room);
        }
      }
    }
    return Array.from(rooms).sort();
  }, [schedules]);

  const getEmptyRooms = useCallback(
    (day: DayOfWeek, slotIndex: number, week?: string | null) => {
      const allRooms = getAllRooms();
      const slot = TIME_SLOTS[slotIndex];
      if (!slot) return [];

      const availableWeeks = selectedCohort ? getAvailableWeeks(selectedCohort) : [];
      const effectiveWeek =
        week ?? selectedWeek ?? (availableWeeks.length > 0 ? availableWeeks[0] : null);

      const occupied = new Map<string, { lecture: string; cohort: string }>();

      for (const schedule of schedules) {
        let entries = schedule.entries;
        if (effectiveWeek) {
          const filtered = entries.filter((e) => e.teachingWeek === effectiveWeek);
          if (filtered.length > 0) entries = filtered;
        }

        for (const entry of entries) {
          if (
            entry.day === day &&
            (entry.timeSlot.start === slot.start || entry.timeSlot.label === slot.label) &&
            entry.lecture?.room
          ) {
            occupied.set(entry.lecture.room, {
              lecture: entry.lecture.name,
              cohort: schedule.cohort,
            });
          }
        }
      }

      return allRooms.map((room): RoomStatus => {
        const occupant = occupied.get(room);
        if (occupant) {
          return {
            room,
            isOccupied: true,
            currentLecture: occupant.lecture,
            currentCohort: occupant.cohort,
          };
        }

        return {
          room,
          isOccupied: false,
        };
      });
    },
    [schedules, getAllRooms, selectedCohort, selectedWeek, getAvailableWeeks]
  );

  // Sync selectedWeek whenever cohort or schedules change
  useEffect(() => {
    if (selectedCohort) {
      const weeks = getAvailableWeeks(selectedCohort);
      if (weeks.length > 0) {
        if (!selectedWeek || !weeks.includes(selectedWeek)) {
          setSelectedWeek(weeks[0]);
        }
      }
    }
  }, [selectedCohort, schedules, getAvailableWeeks, selectedWeek]);

  // Auto-select today
  useEffect(() => {
    if (!selectedDay) {
      setSelectedDay(getTodayDay());
    }
  }, [selectedDay]);

  return (
    <ScheduleContext.Provider
      value={{
        schedules,
        loading,
        error,
        progress,
        config,
        selectedCohort,
        selectedDay,
        selectedWeek,
        loadSchedules,
        uploadPdfFiles,
        loadDemoData,
        clearSchedules,
        setSelectedCohort,
        setSelectedDay,
        setSelectedWeek,
        setConfig,
        getCohortNames,
        getAvailableWeeks,
        getDailySchedule,
        getWeeklySchedule,
        getDateForDay,
        getEmptyRooms,
        getAllRooms,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule(): ScheduleContextType {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule must be used within ScheduleProvider');
  return ctx;
}
