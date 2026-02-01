import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TimerPage, RoutinesPage, HistoryPage, MetricsPage, SettingsPage } from './pages';
import { BottomNav, OfflineIndicator } from './components/layout';
import { seedDatabase } from './db/seed';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const theme = useSettingsStore((s) => s.theme);

  // Initialize database
  useEffect(() => {
    seedDatabase();
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <OfflineIndicator />
        <Routes>
          <Route path="/" element={<TimerPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
