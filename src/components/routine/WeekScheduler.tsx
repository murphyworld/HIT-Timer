import { useState } from 'react';
import { Card, Button, Modal } from '../common';
import type { Routine, DayOfWeek, WeekSchedule } from '../../types';
import { DAYS_OF_WEEK, DAY_LABELS, getTodayDayOfWeek } from '../../utils/dateUtils';

interface WeekSchedulerProps {
  schedule: WeekSchedule | null;
  routines: Routine[];
  onAssign: (day: DayOfWeek, routineId: string | null) => void;
  onStartToday: (routine: Routine) => void;
}

export function WeekScheduler({ schedule, routines, onAssign, onStartToday }: WeekSchedulerProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const today = getTodayDayOfWeek();

  const todaysRoutine = schedule
    ? routines.find((r) => r.id === schedule.assignments[today])
    : null;

  return (
    <div className="space-y-4">
      {/* Today's Routine Quick Start */}
      {todaysRoutine && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Today's Routine</p>
              <p className="font-semibold text-lg">{todaysRoutine.name}</p>
            </div>
            <Button
              onClick={() => onStartToday(todaysRoutine)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Start Now
            </Button>
          </div>
        </Card>
      )}

      {/* Week Grid */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Week Schedule</h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day) => {
            const routineId = schedule?.assignments[day] ?? null;
            const isToday = day === today;
            const hasRoutine = routineId !== null;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  isToday
                    ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {DAY_LABELS[day]}
                </span>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full mt-1 ${
                    hasRoutine
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {hasRoutine ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5 1.41-1.41L9 14.17l9.59-9.59L20 6z" />
                    </svg>
                  ) : (
                    <span className="text-xs">-</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Day Assignment Modal */}
      <Modal
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? `${DAY_LABELS[selectedDay]} Routine` : ''}
      >
        <div className="space-y-2">
          <button
            onClick={() => {
              if (selectedDay) {
                onAssign(selectedDay, null);
                setSelectedDay(null);
              }
            }}
            className={`w-full p-3 rounded-xl text-left transition-all ${
              schedule?.assignments[selectedDay!] === null
                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
            }`}
          >
            <span className="font-medium text-gray-900 dark:text-white">Rest Day</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Take a break and recover
            </p>
          </button>

          {routines.map((routine) => (
            <button
              key={routine.id}
              onClick={() => {
                if (selectedDay) {
                  onAssign(selectedDay, routine.id);
                  setSelectedDay(null);
                }
              }}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                schedule?.assignments[selectedDay!] === routine.id
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
              }`}
            >
              <span className="font-medium text-gray-900 dark:text-white">{routine.name}</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {routine.steps.length} exercises
              </p>
            </button>
          ))}

          {routines.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No routines created yet. Create a routine first!
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
