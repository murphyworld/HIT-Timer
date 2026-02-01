import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Routine, RoutineStep, WeekSchedule, DayOfWeek } from '../types';
import { db } from '../db/database';

interface RoutineStore {
  routines: Routine[];
  weekSchedule: WeekSchedule | null;

  // Routine actions
  loadRoutines: () => Promise<void>;
  createRoutine: (name: string, steps: Omit<RoutineStep, 'id'>[]) => Promise<Routine>;
  updateRoutine: (id: string, updates: Partial<Omit<Routine, 'id'>>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  getRoutine: (id: string) => Routine | undefined;

  // Schedule actions
  loadSchedule: () => Promise<void>;
  assignRoutineToDay: (day: DayOfWeek, routineId: string | null) => Promise<void>;
  getTodaysRoutine: () => Routine | null;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: [],
  weekSchedule: null,

  loadRoutines: async () => {
    const routines = await db.routines.orderBy('createdAt').reverse().toArray();
    set({ routines });
  },

  createRoutine: async (name, steps) => {
    const routine: Routine = {
      id: uuidv4(),
      name,
      steps: steps.map((step) => ({ ...step, id: uuidv4() })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.routines.add(routine);
    await get().loadRoutines();
    return routine;
  },

  updateRoutine: async (id, updates) => {
    const routine = await db.routines.get(id);
    if (!routine) return;

    const updatedRoutine = {
      ...routine,
      ...updates,
      updatedAt: new Date(),
    };

    await db.routines.put(updatedRoutine);
    await get().loadRoutines();
  },

  deleteRoutine: async (id) => {
    await db.routines.delete(id);

    // Remove from schedule if assigned
    const schedule = get().weekSchedule;
    if (schedule) {
      const updatedAssignments = { ...schedule.assignments };
      for (const day of Object.keys(updatedAssignments) as DayOfWeek[]) {
        if (updatedAssignments[day] === id) {
          updatedAssignments[day] = null;
        }
      }
      await db.weekSchedule.put({ id: 'default', assignments: updatedAssignments });
      await get().loadSchedule();
    }

    await get().loadRoutines();
  },

  getRoutine: (id) => {
    return get().routines.find((r) => r.id === id);
  },

  loadSchedule: async () => {
    let schedule = await db.weekSchedule.get('default');
    if (!schedule) {
      schedule = {
        id: 'default',
        assignments: {
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: null,
          friday: null,
          saturday: null,
          sunday: null,
        },
      };
      await db.weekSchedule.add(schedule);
    }
    set({ weekSchedule: schedule });
  },

  assignRoutineToDay: async (day, routineId) => {
    const schedule = get().weekSchedule;
    if (!schedule) return;

    const updatedAssignments = {
      ...schedule.assignments,
      [day]: routineId,
    };

    await db.weekSchedule.put({ id: 'default', assignments: updatedAssignments });
    await get().loadSchedule();
  },

  getTodaysRoutine: () => {
    const schedule = get().weekSchedule;
    if (!schedule) return null;

    const dayIndex = new Date().getDay();
    const days: DayOfWeek[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = days[dayIndex];
    const routineId = schedule.assignments[today];

    if (!routineId) return null;
    return get().routines.find((r) => r.id === routineId) || null;
  },
}));
