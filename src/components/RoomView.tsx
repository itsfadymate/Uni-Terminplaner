import { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { DAYS, TIME_SLOTS, formatTimeSlot, getCurrentSlotIndex, getTodayDay } from '../constants';
import type { DayOfWeek } from '../types';
import { DoorOpen, DoorClosed, ChevronDown } from 'lucide-react';

export function RoomView() {
  const { getEmptyRooms, selectedWeek, schedules } = useSchedule();
  const today = getTodayDay();
  const currentSlot = getCurrentSlotIndex();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today ?? 'Monday');
  const [selectedSlot, setSelectedSlot] = useState(
    currentSlot >= 0 ? currentSlot : 0
  );
  const [filterFreeOnly, setFilterFreeOnly] = useState(true);

  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No schedules loaded. Configure settings and refresh.</p>
      </div>
    );
  }

  const rooms = getEmptyRooms(selectedDay, selectedSlot, selectedWeek);
  const freeRooms = rooms.filter((r) => !r.isOccupied);
  const occupiedRooms = rooms.filter((r) => r.isOccupied);
  const displayRooms = filterFreeOnly ? freeRooms : rooms;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Day
            </label>
            <div className="flex gap-1 flex-wrap">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Time slot selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Time Slot
            </label>
            <div className="relative">
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(Number(e.target.value))}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                {TIME_SLOTS.map((slot, i) => (
                  <option key={i} value={i}>
                    {slot.label}: {formatTimeSlot(slot)}
                    {i === currentSlot && selectedDay === today ? ' (NOW)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Filter
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterFreeOnly(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterFreeOnly
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Free Only ({freeRooms.length})
              </button>
              <button
                onClick={() => setFilterFreeOnly(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !filterFreeOnly
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({rooms.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <DoorOpen className="w-8 h-8 text-green-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-green-700">{freeRooms.length}</div>
          <div className="text-sm text-green-600">Free Rooms</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <DoorClosed className="w-8 h-8 text-red-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-red-600">{occupiedRooms.length}</div>
          <div className="text-sm text-red-500">Occupied Rooms</div>
        </div>
      </div>

      {/* Room list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filterFreeOnly ? 'Available' : 'All'} Rooms — {selectedDay},{' '}
            {formatTimeSlot(TIME_SLOTS[selectedSlot])}
          </h2>
        </div>

        {displayRooms.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {displayRooms.map((room) => (
              <div
                key={room.room}
                className={`flex items-center justify-between px-4 py-3 ${
                  room.isOccupied ? 'bg-red-50/50' : 'hover:bg-green-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {room.isOccupied ? (
                    <DoorClosed className="w-5 h-5 text-red-500" />
                  ) : (
                    <DoorOpen className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <span className="font-medium text-gray-900">
                      Room {room.room}
                    </span>
                    {room.isOccupied && room.currentLecture && (
                      <div className="text-sm text-gray-500">
                        {room.currentLecture}
                        {room.currentCohort && (
                          <span className="text-gray-400"> — {room.currentCohort}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {room.isOccupied ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Occupied
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {filterFreeOnly
              ? 'No free rooms available at this time.'
              : 'No room data available.'}
          </div>
        )}
      </div>
    </div>
  );
}
