import { db } from './database';
import { DEFAULT_EXERCISES } from '../constants/exercises';
import type { Settings } from '../types';

const DEFAULT_SETTINGS: Settings = {
  voiceEnabled: true,
  voiceVolume: 1.0,
  countdownFrom: 3,
  units: 'metric',
  theme: 'system',
};

export async function seedDatabase() {
  // Check if already seeded
  const exerciseCount = await db.exercises.count();
  if (exerciseCount === 0) {
    await db.exercises.bulkAdd(DEFAULT_EXERCISES);
    console.log('Seeded default exercises');
  }

  // Ensure settings exist
  const settings = await db.settings.get('default');
  if (!settings) {
    await db.settings.add({ id: 'default', ...DEFAULT_SETTINGS });
    console.log('Created default settings');
  }

  // Ensure week schedule exists
  const schedule = await db.weekSchedule.get('default');
  if (!schedule) {
    await db.weekSchedule.add({
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
    });
    console.log('Created default week schedule');
  }
}
