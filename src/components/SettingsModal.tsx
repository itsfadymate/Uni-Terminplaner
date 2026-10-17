import { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { X, Save, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { config, setConfig, loadDemoData, clearSchedules } = useSchedule();
  const [proxyUrl, setProxyUrl] = useState(config.proxyUrl);
  const [folderId, setFolderId] = useState(config.folderId);

  const handleSave = () => {
    setConfig({ proxyUrl: proxyUrl.trim(), folderId: folderId.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Proxy URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Apps Script Proxy URL
            </label>
            <input
              type="url"
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Deploy the provided Apps Script and paste the Web App URL here.
            </p>
          </div>

          {/* Folder ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Drive Folder ID
            </label>
            <input
              type="text"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              placeholder="1n2n3ILYgJ-oBmC-7v9R6250uCpnjI4_5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              The folder ID from the Google Drive URL. Update this when the link changes.
            </p>
          </div>

          {/* Setup instructions */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-blue-900 text-sm">Quick Setup Guide</h3>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>
                Go to{' '}
                <a
                  href="https://script.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline inline-flex items-center gap-1"
                >
                  script.google.com <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and create a new project
              </li>
              <li>
                Paste the proxy code (see <code className="bg-blue-100 px-1 rounded">apps-script/Code.gs</code>)
              </li>
              <li>Deploy as Web App (Execute as: Me, Access: Anyone)</li>
              <li>Paste the Web App URL above</li>
              <li>Click Refresh to load schedules</li>
            </ol>
          </div>

          {/* JSON Import/Export and Quick Actions */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">
              Data Management & Offline Testing
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loadDemoData();
                  alert('Demo schedules loaded successfully!');
                  onClose();
                }}
                className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium border border-blue-200 transition-colors"
              >
                Load Demo Schedules
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all loaded schedules?')) {
                    clearSchedules();
                    onClose();
                  }
                }}
                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium border border-red-200 transition-colors"
              >
                Clear All Schedules
              </button>
            </div>

            <p className="text-xs text-gray-500">
              You can also backup and restore your parsed schedule datasets via JSON:
            </p>
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    try {
                      const data = JSON.parse(text);
                      localStorage.setItem('giu_schedule_data', JSON.stringify(data));
                      window.location.reload();
                    } catch {
                      alert('Invalid JSON file');
                    }
                  }}
                />
                <span className="block w-full text-center px-3 py-2 border border-gray-300 rounded-lg text-xs cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
                  Import JSON
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const data = localStorage.getItem('giu_schedule_data');
                  if (!data) {
                    alert('No schedule data to export');
                    return;
                  }
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'giu-schedules.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs hover:bg-gray-50 font-medium text-gray-700"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
