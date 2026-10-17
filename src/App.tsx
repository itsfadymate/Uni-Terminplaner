import { useState } from 'react';
import { ScheduleProvider } from './context/ScheduleContext';
import { Header } from './components/Header';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { RoomView } from './components/RoomView';
import { SettingsModal } from './components/SettingsModal';

type View = 'daily' | 'weekly' | 'rooms';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('daily');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ScheduleProvider>
      <div className="min-h-screen bg-gray-100">
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onSettingsClick={() => setShowSettings(true)}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {currentView === 'daily' && <DailyView />}
          {currentView === 'weekly' && <WeeklyView />}
          {currentView === 'rooms' && <RoomView />}
        </main>

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </ScheduleProvider>
  );
}
