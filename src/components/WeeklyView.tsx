import { useSchedule } from '../context/ScheduleContext';
import { DAYS, TIME_SLOTS, formatTimeSlot, getCurrentSlotIndex } from '../constants';
import { getTodayDay } from '../constants';
import { CohortSelector, WeekSelector } from './Selectors';
import { MapPin, Calendar } from 'lucide-react';

export function WeeklyView() {
  const { selectedCohort, selectedWeek, getWeeklySchedule, schedules } = useSchedule();

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No schedules loaded. Configure settings and refresh.</p>
      </div>
    );
  }

  const entries = selectedCohort ? getWeeklySchedule(selectedCohort) : [];
  const today = getTodayDay();
  const currentSlot = getCurrentSlotIndex();

  return (
    <div className="space-y-4">
      {/* Top Filter Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <CohortSelector />
          <WeekSelector />
        </div>
      </div>

      {selectedCohort ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Weekly Timetable — {selectedCohort}</span>
            </div>
            {selectedWeek && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {selectedWeek}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                    Day
                  </th>
                  {TIME_SLOTS.map((slot, i) => (
                    <th
                      key={i}
                      className={`px-3 py-3 text-center text-xs font-bold uppercase tracking-wider ${
                        i === currentSlot
                          ? 'text-blue-700 bg-blue-50/80'
                          : 'text-gray-700'
                      }`}
                    >
                      <div>{slot.label}</div>
                      <div className="font-normal normal-case text-gray-500 mt-0.5">
                        {formatTimeSlot(slot)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DAYS.map((day) => {
                  const dayEntries = entries.filter((e) => e.day === day);
                  const isToday = day === today;
                  const dateStr = dayEntries.find((e) => e.dateStr)?.dateStr;

                  return (
                    <tr
                      key={day}
                      className={isToday ? 'bg-blue-50/40' : 'hover:bg-gray-50/50'}
                    >
                      <td
                        className={`px-3 py-3 text-sm font-bold align-top ${
                          isToday ? 'text-blue-700' : 'text-gray-800'
                        }`}
                      >
                        <div>{day}</div>
                        {dateStr && (
                          <div className="text-[11px] font-normal text-gray-500 mt-0.5 leading-tight">
                            {dateStr.replace(/^[A-Za-z]+day,?\s*/, '')}
                          </div>
                        )}
                        {isToday && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded font-bold uppercase">
                            Today
                          </span>
                        )}
                      </td>
                      {TIME_SLOTS.map((slot, slotIdx) => {
                        const entry = dayEntries.find(
                          (e) =>
                            e.timeSlot.start === slot.start ||
                            e.timeSlot.label === slot.label
                        );
                        const lecture = entry?.lecture;
                        const isNow = isToday && slotIdx === currentSlot;

                        return (
                          <td
                            key={slotIdx}
                            className={`p-1.5 align-top text-xs ${
                              isNow
                                ? 'bg-blue-100/60 ring-2 ring-inset ring-blue-300'
                                : ''
                            }`}
                          >
                            {lecture ? (
                              <div className="bg-white rounded-lg border border-gray-200 p-2.5 shadow-xs hover:shadow-sm transition-shadow min-h-[5.5rem] flex flex-col justify-between">
                                <div>
                                  <div className="font-bold text-gray-900 leading-snug line-clamp-2">
                                    {lecture.name}
                                  </div>
                                  {lecture.instructor && (
                                    <div className="mt-1 text-[11px] text-gray-500 line-clamp-1">
                                      {lecture.instructor}
                                    </div>
                                  )}
                                </div>

                                {lecture.room && (
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[11px] rounded border border-amber-300">
                                      <MapPin className="w-2.5 h-2.5 text-amber-700" />
                                      {lecture.room}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="min-h-[5.5rem] rounded-lg border border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center text-gray-400 text-xs">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Select a cohort to view the weekly schedule.</p>
        </div>
      )}
    </div>
  );
}
