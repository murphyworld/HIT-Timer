import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';
import { db } from '../db/database';

interface SettingsStore extends Settings {
  userWeight: number; // kg
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceVolume: (volume: number) => void;
  setCountdownFrom: (seconds: number) => void;
  setUnits: (units: 'metric' | 'imperial') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setUserWeight: (weight: number) => void;
  loadFromDb: () => Promise<void>;
  saveToDb: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      voiceEnabled: true,
      voiceVolume: 1.0,
      countdownFrom: 3,
      units: 'metric',
      theme: 'system',
      userWeight: 70,

      setVoiceEnabled: (enabled) => {
        set({ voiceEnabled: enabled });
        get().saveToDb();
      },

      setVoiceVolume: (volume) => {
        set({ voiceVolume: volume });
        get().saveToDb();
      },

      setCountdownFrom: (seconds) => {
        set({ countdownFrom: seconds });
        get().saveToDb();
      },

      setUnits: (units) => {
        set({ units });
        get().saveToDb();
      },

      setTheme: (theme) => {
        set({ theme });
        get().saveToDb();
      },

      setUserWeight: (weight) => {
        set({ userWeight: weight });
        get().saveToDb();
      },

      loadFromDb: async () => {
        const settings = await db.settings.get('default');
        if (settings) {
          set({
            voiceEnabled: settings.voiceEnabled,
            voiceVolume: settings.voiceVolume,
            countdownFrom: settings.countdownFrom,
            units: settings.units,
            theme: settings.theme,
          });
        }
      },

      saveToDb: async () => {
        const state = get();
        await db.settings.put({
          id: 'default',
          voiceEnabled: state.voiceEnabled,
          voiceVolume: state.voiceVolume,
          countdownFrom: state.countdownFrom,
          units: state.units,
          theme: state.theme,
        });
      },
    }),
    {
      name: 'hit-timer-settings',
    }
  )
);
