import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import {
  Settings,
  User,
  Sliders,
  Database,
  Building,
  RotateCcw,
  Download,
  CheckCircle2,
  ShieldAlert,
  Moon,
  Sun,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SettingsPage = () => {
  const workspace = useSettingsStore(state => state.workspace);
  const preferences = useSettingsStore(state => state.preferences);
  const updateWorkspace = useSettingsStore(state => state.updateWorkspace);
  const updatePreferences = useSettingsStore(state => state.updatePreferences);
  const toggleTheme = useSettingsStore(state => state.toggleTheme);
  const resetAllDemoData = useSettingsStore(state => state.resetAllDemoData);
  const exportAllDataJSON = useSettingsStore(state => state.exportAllDataJSON);

  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'profile' | 'preferences' | 'data'

  // General Form
  const [wsName, setWsName] = useState(workspace?.name || 'TASKSPHERE HQ');
  const [wsDesc, setWsDesc] = useState(workspace?.description || '');
  const [wsTimezone, setWsTimezone] = useState(workspace?.timezone || 'America/New_York (UTC-5)');
  const [wsDateFormat, setWsDateFormat] = useState(workspace?.dateFormat || 'MMM d, yyyy');

  // Profile Form
  const [profName, setProfName] = useState(user?.name || '');
  const [profTitle, setProfTitle] = useState(user?.jobTitle || '');
  const [profEmail, setProfEmail] = useState(user?.email || '');
  const [profPhone, setProfPhone] = useState(user?.phone || '');
  const [profLocation, setProfLocation] = useState(user?.location || '');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    updateWorkspace({
      name: wsName,
      description: wsDesc,
      timezone: wsTimezone,
      dateFormat: wsDateFormat
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profName,
      jobTitle: profTitle,
      email: profEmail,
      phone: profPhone,
      location: profLocation
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm('⚠️ Reset all workspace state back to fresh demo seed datasets? All created tasks, projects and timers will be restored.')) {
      resetAllDemoData();
      confetti({ particleCount: 50, spread: 60 });
      alert('Demo data restored successfully!');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'Workspace General', icon: Building },
    { id: 'profile', label: 'My Profile & Bio', icon: User },
    { id: 'preferences', label: 'Preferences & Theme', icon: Sliders },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
          Workspace Settings & Administration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize workspace metadata, personal credentials, display preferences, and backup data
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-brand-violet text-brand-violet'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. General Settings */}
      {activeTab === 'general' && (
        <Card>
          <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">
              Workspace Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Workspace Name *
              </label>
              <input
                type="text"
                required
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Workspace Description
              </label>
              <textarea
                rows={3}
                value={wsDesc}
                onChange={(e) => setWsDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Default Timezone
                </label>
                <select
                  value={wsTimezone}
                  onChange={(e) => setWsTimezone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                >
                  <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                  <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
                  <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                  <option value="Europe/Berlin (UTC+1)">Europe/Berlin (UTC+1)</option>
                  <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date Format
                </label>
                <select
                  value={wsDateFormat}
                  onChange={(e) => setWsDateFormat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                >
                  <option value="MMM d, yyyy">MMM d, yyyy (e.g. Nov 23, 2026)</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd (e.g. 2026-11-23)</option>
                  <option value="dd/MM/yyyy">dd/MM/yyyy (e.g. 23/11/2026)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Workspace Info
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 2. Profile Settings */}
      {activeTab === 'profile' && (
        <Card>
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mb-4">
              Personal Profile & Credentials
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <Avatar src={user?.avatar} name={user?.name} size="xl" status="online" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h4>
                <p className="text-xs text-slate-400">{user?.role} · {user?.department}</p>
                <span className="text-[10px] text-brand-violet font-semibold">Simulated demo account profile</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={profTitle}
                  onChange={(e) => setProfTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profLocation}
                  onChange={(e) => setProfLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 3. Preferences */}
      {activeTab === 'preferences' && (
        <Card className="max-w-2xl space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
            Interface Preferences
          </h3>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Theme</h4>
              <p className="text-xs text-slate-400">Switch between clean light interface and deep midnight navy dark mode</p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
            >
              {preferences.theme === 'dark' ? <Moon className="w-4 h-4 text-brand-softPurple" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="capitalize">{preferences.theme} Mode</span>
            </button>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notification Chimes</h4>
              <p className="text-xs text-slate-400">Play audio cue on task completion celebration</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.soundNotifications}
              onChange={(e) => updatePreferences({ soundNotifications: e.target.checked })}
              className="w-4 h-4 text-brand-violet rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Default Project View</h4>
              <p className="text-xs text-slate-400">Preferred layout when opening the projects portfolio</p>
            </div>
            <select
              value={preferences.defaultProjectView}
              onChange={(e) => updatePreferences({ defaultProjectView: e.target.value })}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>
        </Card>
      )}

      {/* 4. Data Management */}
      {activeTab === 'data' && (
        <Card className="max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Data Management & Backup
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage browser storage, export full workspace JSON state, or reset to original demo seed datasets
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Export Full Workspace Backup</h4>
              <p className="text-xs text-slate-400">Download complete JSON archive of all projects, tasks, comments, and time entries.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={Download}
              onClick={exportAllDataJSON}
            >
              Export JSON
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Reset Demo Data
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                Revert all modified projects, deleted tasks, and timers back to original initial state.
              </p>
            </div>
            <Button
              size="sm"
              variant="danger"
              icon={RotateCcw}
              onClick={handleResetData}
            >
              Restore Seed
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
