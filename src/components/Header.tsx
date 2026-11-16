import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Database, 
  Plus, 
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  onOpenNewTaskModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenBackupModal: () => void;
  totalTasks: number;
  completedTasks: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewTaskModal,
  onOpenShortcutsModal,
  onOpenBackupModal,
  totalTasks,
  completedTasks
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(sound.isEnabled());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setIsSoundEnabled(newState);
  };

  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="border-b border-emerald-950/60 bg-black/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Matrix Status */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-dark-900 border border-emerald-500/30 shadow-[0_0_15px_rgba(0,255,102,0.15)] group hover:border-emerald-400 transition-colors">
              <Zap className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 beacon-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                  <span>KRONOS</span>
                  <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30">
                    MATRIX
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                SYSTEM ACTIVE // OBSIDIAN ENGINE
              </p>
            </div>
          </div>

          {/* Quick status on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenNewTaskModal();
              }}
              className="p-2 rounded-lg bg-emerald-500 text-black font-semibold shadow-glow-sm"
              title="Add Task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Live Monospace Clock & Date */}
        <div className="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-full bg-dark-950/90 border border-emerald-900/30 text-xs font-mono">
          <div className="text-zinc-400 flex items-center gap-2">
            <span className="text-emerald-500">SYS_TIME:</span>
            <span className="text-white font-bold tracking-widest">{currentTime || '00:00:00'}</span>
          </div>
          <div className="w-px h-3 bg-emerald-950/80"></div>
          <div className="text-zinc-400 flex items-center gap-1.5">
            <span className="text-emerald-500">DATE:</span>
            <span className="text-zinc-300">{currentDate}</span>
          </div>
          <div className="w-px h-3 bg-emerald-950/80"></div>
          <div className="text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{percentage}% SYNCED</span>
          </div>
        </div>

        {/* Action Controls & New Task Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-all ${
              isSoundEnabled 
                ? 'bg-dark-900/80 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/30 shadow-glow-sm' 
                : 'bg-dark-900/40 text-zinc-600 border-zinc-800 hover:text-zinc-400 hover:border-zinc-700'
            }`}
            title={isSoundEnabled ? 'Mute Sound Effects (M)' : 'Enable Sound Effects (M)'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Backup & Import Modal Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBackupModal();
            }}
            className="p-2 rounded-lg bg-dark-900/80 text-zinc-300 border border-emerald-950 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
            title="Backup & Restore (JSON/CSV)"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenShortcutsModal();
            }}
            className="p-2 rounded-lg bg-dark-900/80 text-zinc-300 border border-emerald-950 hover:border-emerald-500/40 hover:text-emerald-300 transition-all hidden sm:flex items-center"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* New Task Main CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenNewTaskModal();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
        </div>

      </div>
    </header>
  );
};

