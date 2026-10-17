import { useSchedule } from '../context/ScheduleContext';
import { DAYS, getTodayDay } from '../constants';
import { ChevronDown, Calendar } from 'lucide-react';

export function CohortSelector() {
  const { getCohortNames, selectedCohort, setSelectedCohort } = useSchedule();
  const cohorts = getCohortNames();

  if (cohorts.length === 0) return null;

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Program / Cohort
      </label>
      <div className="relative">
        <select
          value={selectedCohort ?? ''}
          onChange={(e) => setSelectedCohort(e.target.value || null)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-xs"
        >
          <option value="">Select a cohort...</option>
          {cohorts.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function formatShortDate(fullDate?: string): string | null {
  if (!fullDate) return null;
  // Match "October 13" or "Oct 13"
  const match = fullDate.match(
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember))\s+(\d{1,2})\b/i
  );
  if (match) {
    const month = match[1].slice(0, 3);
    const day = match[2];
    return `${month} ${day}`;
  }
  // Match "13.10.2026" or "13/10"
  const numMatch = fullDate.match(/\b(\d{1,2})[\.\/-](\d{1,2})\b/);
  if (numMatch) {
    return `${numMatch[1]}/${numMatch[2]}`;
  }
  return null;
}

export function DaySelector() {
  const {
    selectedDay,
    setSelectedDay,
    selectedCohort,
    selectedWeek,
    getDateForDay,
  } = useSchedule();

  const today = getTodayDay();

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        Select Day & Date
      </label>
      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = day === today;
          const fullDate = selectedCohort
            ? getDateForDay(selectedCohort, day, selectedWeek)
            : undefined;
          const shortDate = formatShortDate(fullDate);

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 font-bold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold tracking-tight">
                {day.slice(0, 3)}
              </div>
              <div
                className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight ${
                  isSelected ? 'text-blue-100 font-medium' : 'text-gray-500'
                }`}
              >
                {shortDate || '—'}
              </div>
              {isToday && (
                <div
                  className={`mt-1 w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-amber-300' : 'bg-blue-600'
                  }`}
                  title="Today"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WeekSelector() {
  const { selectedCohort, getAvailableWeeks, selectedWeek, setSelectedWeek } =
    useSchedule();
  if (!selectedCohort) return null;

  const weeks = getAvailableWeeks(selectedCohort);
  if (weeks.length === 0) return null;

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-blue-600" />
          Teaching Week
        </span>
        <span className="text-xs text-blue-600 font-semibold">
          {weeks.length} week{weeks.length > 1 ? 's' : ''} available
        </span>
      </label>
      <div className="relative">
        <select
          value={selectedWeek ?? weeks[0] ?? ''}
          onChange={(e) => setSelectedWeek(e.target.value || null)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-xs"
        >
          {weeks.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
