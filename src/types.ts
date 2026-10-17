/** Represents a single lecture entry in the schedule */
export interface Lecture {
  name: string;
  room: string;
  instructor?: string;
  /** Raw text from the PDF cell */
  rawText: string;
}

/** A single time slot definition */
export interface TimeSlot {
  label: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

/** The days covered by the schedule */
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

/** A schedule entry maps a day + time slot to a lecture */
export interface ScheduleEntry {
  day: DayOfWeek;
  dateStr?: string;       // e.g. "Tuesday, October 13, 2026"
  teachingWeek?: string;  // e.g. "Teaching Week 3"
  timeSlot: TimeSlot;
  lecture: Lecture | null;
}

/** A full schedule for a cohort */
export interface CohortSchedule {
  cohort: string;          // e.g., "MET Year 3"
  fileName: string;        // original PDF filename
  entries: ScheduleEntry[];
  weeks?: string[];        // distinct teaching weeks, e.g. ["Teaching Week 1", "Teaching Week 2"]
}

/** A file in the Google Drive folder */
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  url: string;
}

/** Room availability info */
export interface RoomStatus {
  room: string;
  isOccupied: boolean;
  currentLecture?: string;
  currentCohort?: string;
  nextFreeSlot?: TimeSlot;
}

/** App configuration */
export interface AppConfig {
  /** Google Apps Script Web App URL for fetching Drive files */
  proxyUrl: string;
  /** Google Drive folder ID */
  folderId: string;
}
