import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isDark, toggleTheme }) => {
  const navItems = [
    { id: View.HOME, icon: 'fa-home', label: 'Home' },
    { id: View.TUTOR, icon: 'fa-robot', label: 'Tutor' },
    { id: View.HANDS_ON, icon: 'fa-code', label: 'Hands-on' },
    { id: View.PROGRESS, icon: 'fa-users', label: 'Social' },
    { id: View.WEEKLY_GRAPH, icon: 'fa-chart-line', label: 'Stats' },
    { id: View.GUIDE, icon: 'fa-compass', label: 'Guide' },
    { id: View.TASKS, icon: 'fa-tasks', label: 'Tasks' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6 bg-earth-200/90 dark:bg-discord-darker/90 backdrop-blur-sm shadow-lg z-50 transition-colors duration-200">
      {/* Brand Logo - Scaled down slightly to fit the vertical bar */}
      <div className="mb-8 text-xs font-extrabold text-earth-800 dark:text-white tracking-widest text-center">
        DEV<br/>AURA
      </div>
      
      <div className="flex-1 flex flex-col gap-6 w-full">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`group relative flex items-center justify-center w-12 h-12 mx-auto rounded-2xl transition-all duration-200
              ${currentView === item.id 
                ? 'bg-earth-500 text-white dark:bg-indigo-500 shadow-md' 
                : 'text-earth-700 hover:bg-earth-300 dark:text-gray-400 dark:hover:bg-discord-light dark:hover:text-gray-100'
              }`}
          >
            <i className={`fas ${item.icon} text-xl`}></i>
            <span className="absolute left-16 bg-black/80 backdrop-blur text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <button 
        onClick={toggleTheme}
        className="mt-auto w-12 h-12 rounded-full bg-earth-300/80 dark:bg-discord-darkest/80 flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
      >
        <i className={`fas ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-earth-800'}`}></i>
      </button>
    </div>
  );
};

export default Sidebar;