import { useSchedule } from '../context/ScheduleContext';
import { Settings, RefreshCw, BookOpen, CalendarDays, DoorOpen } from 'lucide-react';

type View = 'daily' | 'weekly' | 'rooms';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onSettingsClick: () => void;
}

export function Header({ currentView, onViewChange, onSettingsClick }: HeaderProps) {
  const { loading, loadSchedules, uploadPdfFiles, schedules, progress, error } = useSchedule();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadPdfFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <BookOpen className="w-7 h-7 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">GIU Schedule Manager</h1>
              <p className="text-blue-200 text-sm">
                {schedules.length > 0
                  ? `${schedules.length} schedule cohort(s) active`
                  : 'Ready to load GIU Berlin schedules'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer border border-white/10 shadow-sm">
              <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={loading}
              />
              <span className="text-xs md:text-sm">Upload PDF</span>
            </label>

            <button
              onClick={loadSchedules}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/60 rounded-lg transition-colors text-sm font-medium shadow-sm"
              title="Sync schedules from Google Drive"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {loading
                  ? progress
                    ? `Loading ${progress.current}/${progress.total}...`
                    : 'Syncing...'
                  : 'Sync Drive'}
              </span>
            </button>

            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-200 hover:text-white"
              title="Configure Drive Sync Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-xs md:text-sm text-red-200 flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {/* Navigation tabs */}
        <nav className="mt-4 flex gap-1">
          <TabButton
            active={currentView === 'daily'}
            onClick={() => onViewChange('daily')}
            icon={<CalendarDays className="w-4 h-4" />}
            label="Today's Schedule"
          />
          <TabButton
            active={currentView === 'weekly'}
            onClick={() => onViewChange('weekly')}
            icon={<BookOpen className="w-4 h-4" />}
            label="Weekly View"
          />
          <TabButton
            active={currentView === 'rooms'}
            onClick={() => onViewChange('rooms')}
            icon={<DoorOpen className="w-4 h-4" />}
            label="Empty Rooms"
          />
        </nav>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-white text-blue-900'
          : 'text-blue-200 hover:text-white hover:bg-blue-600/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
