import { useSchedule } from '../context/ScheduleContext';
import { formatTimeSlot, getCurrentSlotIndex } from '../constants';
import type { ScheduleEntry } from '../types';
import { CohortSelector, DaySelector, WeekSelector } from './Selectors';
import { Clock, MapPin, User, BookOpenCheck, Calendar, Sparkles } from 'lucide-react';

export function DailyView() {
  const {
    selectedCohort,
    selectedDay,
    selectedWeek,
    getDailySchedule,
    getDateForDay,
    schedules,
  } = useSchedule();

  if (schedules.length === 0) {
    return <EmptyState />;
  }

  const entries =
    selectedCohort && selectedDay
      ? getDailySchedule(selectedCohort, selectedDay)
      : [];

  const dateStr =
    selectedCohort && selectedDay
      ? getDateForDay(selectedCohort, selectedDay)
      : undefined;

  const currentSlotIdx = getCurrentSlotIndex();

  return (
    <div className="space-y-6">
      {/* Selectors Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CohortSelector />
          <WeekSelector />
        </div>
        <div className="pt-1 border-t border-gray-100">
          <DaySelector />
        </div>
      </div>

      {/* Schedule Header with Date & Week Info */}
      {selectedCohort && selectedDay ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xl md:text-2xl">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>{dateStr || `${selectedDay}'s Schedule`}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">{selectedCohort}</span>
                  {selectedWeek && (
                    <>
                      <span>•</span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium text-xs">
                        {selectedWeek}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                5 Daily Time Slots
              </div>
            </div>
          </div>

          {/* Guaranteed Exactly 5 Slots */}
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry, idx) => (
              <LectureCard
                key={idx}
                entry={entry}
                isCurrentSlot={idx === currentSlotIdx}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Select a cohort and day to view the schedule.</p>
        </div>
      )}
    </div>
  );
}

function LectureCard({
  entry,
  isCurrentSlot,
}: {
  entry: ScheduleEntry;
  isCurrentSlot: boolean;
}) {
  const hasLecture = entry.lecture !== null;
  const room = entry.lecture?.room;

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 transition-all ${
        isCurrentSlot
          ? 'border-blue-400 bg-blue-50/70 shadow-md ring-2 ring-blue-300'
          : hasLecture
          ? 'border-gray-200 bg-white shadow-sm hover:shadow-md'
          : 'border-dashed border-gray-200 bg-gray-50/70'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Time Slot Info */}
        <div className="flex items-center gap-3 sm:w-36 flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              isCurrentSlot
                ? 'bg-blue-600 text-white'
                : hasLecture
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {entry.timeSlot.label.replace('Slot ', 'S')}
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>{entry.timeSlot.label}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatTimeSlot(entry.timeSlot)}
            </div>
            {isCurrentSlot && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold tracking-wide rounded-full uppercase">
                Now
              </span>
            )}
          </div>
        </div>

        {/* Center: Lecture details */}
        <div className="flex-1 min-w-0">
          {hasLecture ? (
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-snug">
                {entry.lecture!.name}
              </h3>
              {entry.lecture!.instructor && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>{entry.lecture!.instructor}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic flex items-center gap-1.5">
              <span>No scheduled lectures (Free slot)</span>
            </div>
          )}
        </div>

        {/* Right: Prominent Room Badge */}
        {hasLecture && (
          <div className="flex-shrink-0 self-start sm:self-center">
            {room ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-sm bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Room {room}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-600">
                <span>Room TBA</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  const { loadDemoData, uploadPdfFiles, loading } = useSchedule();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadPdfFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center max-w-xl mx-auto my-8">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpenCheck className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No Schedules Loaded Yet</h2>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Sync directly from the public Google Drive folder, upload your schedule PDF file(s), or load sample GIU schedules to explore right away.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={loadDemoData}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          Load Demo Schedules
        </button>

        <label className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer text-center">
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
          Upload Schedule PDF(s)
        </label>
      </div>
    </div>
  );
}
