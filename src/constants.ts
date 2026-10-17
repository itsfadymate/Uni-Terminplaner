import type { TimeSlot, DayOfWeek } from './types';

/** The 5 standard time slots used at GIU Berlin */
export const TIME_SLOTS: TimeSlot[] = [
  { label: 'Slot 1', start: '08:30', end: '10:00' },
  { label: 'Slot 2', start: '10:30', end: '12:00' },
  { label: 'Slot 3', start: '12:15', end: '13:45' },
  { label: 'Slot 4', start: '14:15', end: '15:45' },
  { label: 'Slot 5', start: '16:00', end: '17:30' },
];

/** Days covered by the schedule (Monday–Saturday) */
export const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/** Convert a day name to JS Date day index (0=Sunday) */
export function dayToIndex(day: DayOfWeek): number {
  const map: Record<DayOfWeek, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[day];
}

/** Get today's day of week */
export function getTodayDay(): DayOfWeek | null {
  const jsDay = new Date().getDay();
  const day = DAYS.find((d) => dayToIndex(d) === jsDay);
  return day ?? null;
}

/** Check if a time string "HH:mm" is within a time slot */
export function isTimeInSlot(time: string, slot: TimeSlot): boolean {
  const [h, m] = time.split(':').map(Number);
  const minutes = h * 60 + m;

  const [sh, sm] = slot.start.split(':').map(Number);
  const startMinutes = sh * 60 + sm;

  const [eh, em] = slot.end.split(':').map(Number);
  const endMinutes = eh * 60 + em;

  return minutes >= startMinutes && minutes <= endMinutes;
}

/** Get current time as "HH:mm" */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/** Get current time slot index (0-based) or -1 if outside schedule */
export function getCurrentSlotIndex(): number {
  const now = getCurrentTime();
  return TIME_SLOTS.findIndex((slot) => isTimeInSlot(now, slot));
}

/** Format a time slot for display */
export function formatTimeSlot(slot: TimeSlot): string {
  return `${slot.start} – ${slot.end}`;
}
