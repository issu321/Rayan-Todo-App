import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  FileText, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Task } from '../types';
import { sound } from '../utils/sound';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImportTasks: (imported: Task[], replace: boolean) => void;
  onResetToDefault: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onImportTasks,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kronos_matrix_tasks_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedback('JSON backup successfully downloaded.');
    setIsError(false);
  };

  const handleExportCSV = () => {
    sound.playClick();
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Status', 'Completed', 'Category', 'DueDate', 'SubtasksCount', 'CreatedAt'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.completed ? 'TRUE' : 'FALSE',
      `"${t.category}"`,
      t.dueDate || '',
      t.subtasks.length,
      new Date(t.createdAt).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `kronos_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setFeedback('CSV spreadsheet exported successfully.');
    setIsError(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          throw new Error('File must contain an array of task objects.');
        }
        // Minimal validation of tasks
        const validTasks: Task[] = parsed.filter(item => item && typeof item === 'object' && item.title);
        if (validTasks.length === 0) {
          throw new Error('No valid task entries discovered in JSON.');
        }

        onImportTasks(validTasks, importMode === 'replace');
        sound.playComplete();
        setFeedback(`Imported ${validTasks.length} missions (${importMode} mode).`);
        setIsError(false);
      } catch (err) {
        sound.playDelete();
        setIsError(true);
        setFeedback((err as Error).message || 'Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#050806] border border-emerald-500/40 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(0,255,102,0.15)] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-950 flex items-center justify-between bg-dark-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse" />
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-100">
              Database Persistence & Synchronization
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {feedback && (
            <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 animate-fade-in ${
              isError 
                ? 'bg-red-950/50 border-red-500/40 text-red-300' 
                : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
            }`}>
              {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{feedback}</span>
            </div>
          )}

          {/* Export Options */}
          <div>
            <h4 className="text-xs font-mono uppercase text-zinc-400 mb-2.5">
              1. Export Workspace Data
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="p-3 rounded-xl bg-dark-900 border border-emerald-950 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-zinc-200 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="p-3 rounded-xl bg-dark-900 border border-emerald-950 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-zinc-200 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="pt-2 border-t border-emerald-950/80">
            <h4 className="text-xs font-mono uppercase text-zinc-400 mb-2.5">
              2. Restore / Import JSON File
            </h4>
            
            <div className="flex items-center gap-4 mb-3 text-xs font-mono text-zinc-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="accent-emerald-500"
                />
                <span>Merge with existing</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="accent-emerald-500"
                />
                <span>Replace all tasks</span>
              </label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-dark-900 border border-dashed border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/20 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Select .JSON File from Computer</span>
            </button>
          </div>

          {/* Factory Reset */}
          <div className="pt-2 border-t border-emerald-950/80 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono text-zinc-400">Reset Demo Data</h4>
              <p className="text-[11px] text-zinc-600">Reverts to initial matrix template missions</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Reset database to default matrix missions? Current changes will be overwritten.')) {
                  sound.playDelete();
                  onResetToDefault();
                  setFeedback('Matrix restored to default starter missions.');
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-red-950 hover:border-red-500/60 bg-red-950/20 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

