import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { sound } from '../utils/sound';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', desc: 'Create new mission / task' },
    { key: '/', desc: 'Quick focus search field' },
    { key: 'Esc', desc: 'Dismiss modals or blur search' },
    { key: 'M', desc: 'Toggle sound effects (mute/unmute)' },
    { key: '1', desc: 'Switch to List view' },
    { key: '2', desc: 'Switch to Grid view' },
    { key: '3', desc: 'Switch to Kanban Board view' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#050806] border border-emerald-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,255,102,0.15)] overflow-hidden">
        
        <div className="px-5 py-4 border-b border-emerald-950 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-100">
              Keyboard Shortcodes // Hotkeys
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2.5">
          {shortcuts.map((sc) => (
            <div 
              key={sc.key}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-dark-900/60 border border-emerald-950/60"
            >
              <span className="text-xs text-zinc-300 font-medium">
                {sc.desc}
              </span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold text-emerald-400 bg-dark-950 border border-emerald-500/30 rounded-lg shadow-glow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-emerald-950 bg-dark-950/40 text-center">
          <p className="text-[11px] font-mono text-zinc-500">
            Press <span className="text-emerald-400">Esc</span> or click anywhere outside to close
          </p>
        </div>

      </div>
    </div>
  );
};

