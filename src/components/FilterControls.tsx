import React from 'react';
import { 
  Search, 
  X, 
  List, 
  LayoutGrid, 
  Columns3, 
  ArrowUpDown, 
  CheckCheck, 
  Trash2, 
  Star, 
  Tag
} from 'lucide-react';
import { FilterState, SortOption, ViewMode, Task } from '../types';
import { sound } from '../utils/sound';

interface FilterControlsProps {
  filter: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  tasks: Task[];
  availableCategories: string[];
  onBatchComplete: () => void;
  onBatchClearCompleted: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  onFilterChange,
  tasks,
  availableCategories,
  onBatchComplete,
  onBatchClearCompleted,
  searchInputRef,
}) => {
  const totalCount = tasks.length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pinnedCount = tasks.filter(t => t.pinned).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleClearSearch = () => {
    onFilterChange({ search: '' });
    searchInputRef.current?.focus();
  };

  const toggleSortDirection = () => {
    sound.playClick();
    onFilterChange({ 
      sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <div className="space-y-3 mb-6">
      
      {/* Top row: Search input, Sort, View mode switcher, Batch actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4 text-emerald-500/80" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filter.search}
            onChange={handleSearchChange}
            placeholder="Search missions, tags, notes... (Press '/' to focus)"
            className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-dark-900/90 border border-emerald-950 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_15px_rgba(0,255,102,0.15)] transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {filter.search ? (
              <button
                onClick={handleClearSearch}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Right side controls: Sort, Direction, View Mode, Batch tools */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2">
          
          {/* Sort Selector */}
          <div className="flex items-center rounded-xl bg-dark-900/90 border border-emerald-950 p-1 text-xs font-mono">
            <select
              value={filter.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              className="bg-transparent text-zinc-300 px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="dueDate" className="bg-dark-900 text-zinc-200">Due Date</option>
              <option value="priority" className="bg-dark-900 text-zinc-200">Priority</option>
              <option value="createdAt" className="bg-dark-900 text-zinc-200">Date Created</option>
              <option value="alphabetical" className="bg-dark-900 text-zinc-200">Name (A-Z)</option>
            </select>
            <button
              onClick={toggleSortDirection}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors"
              title={`Sort direction: ${filter.sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-dark-900/90 border border-emerald-950 p-1">
            <button
              onClick={() => {
                sound.playClick();
                onFilterChange({ viewMode: 'list' });
              }}
              className={`p-1.5 rounded-lg transition-all ${
                filter.viewMode === 'list' 
                  ? 'bg-emerald-500 text-black shadow-glow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="List View (1)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onFilterChange({ viewMode: 'grid' });
              }}
              className={`p-1.5 rounded-lg transition-all ${
                filter.viewMode === 'grid' 
                  ? 'bg-emerald-500 text-black shadow-glow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View (2)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onFilterChange({ viewMode: 'kanban' });
              }}
              className={`p-1.5 rounded-lg transition-all ${
                filter.viewMode === 'kanban' 
                  ? 'bg-emerald-500 text-black shadow-glow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Kanban Board View (3)"
            >
              <Columns3 className="w-4 h-4" />
            </button>
          </div>

          {/* Batch Actions Dropdown / Buttons */}
          <div className="flex items-center gap-1.5">
            {activeCount > 0 && (
              <button
                onClick={() => {
                  sound.playComplete();
                  onBatchComplete();
                }}
                className="p-2 rounded-xl bg-dark-900 border border-emerald-950 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all text-xs flex items-center gap-1"
                title="Mark all pending as complete"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-mono">Complete All</span>
              </button>
            )}

            {completedCount > 0 && (
              <button
                onClick={() => {
                  sound.playDelete();
                  onBatchClearCompleted();
                }}
                className="p-2 rounded-xl bg-dark-900 border border-emerald-950 text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-all text-xs flex items-center gap-1"
                title="Clear all completed tasks"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-mono">Clear Done</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Bottom row: Status Pills & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Missions', count: totalCount },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'completed', label: 'Completed', count: completedCount },
            { id: 'pinned', label: 'Starred', count: pinnedCount, icon: Star },
          ].map((tab) => {
            const isSelected = filter.status === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  onFilterChange({ status: tab.id as FilterState['status'] });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/50 shadow-glow-sm'
                    : 'bg-dark-900/60 text-zinc-400 border border-emerald-950/60 hover:text-zinc-200 hover:border-emerald-900'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'fill-emerald-400' : ''}`} />}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-emerald-400 text-black font-bold' : 'bg-dark-950 text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills & Priority Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-xs font-mono text-zinc-500">
            <Tag className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <select
              value={filter.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="bg-dark-900 border border-emerald-950 text-zinc-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="all" className="bg-dark-900">All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat} className="bg-dark-900">{cat}</option>
              ))}
            </select>
          </div>

          {/* Priority dropdown */}
          <select
            value={filter.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="bg-dark-900 border border-emerald-950 text-zinc-300 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="all" className="bg-dark-900">All Priorities</option>
            <option value="urgent" className="bg-dark-900 text-red-400">Urgent</option>
            <option value="high" className="bg-dark-900 text-amber-400">High</option>
            <option value="medium" className="bg-dark-900 text-emerald-400">Medium</option>
            <option value="low" className="bg-dark-900 text-zinc-400">Low</option>
          </select>
        </div>

      </div>

    </div>
  );
};

