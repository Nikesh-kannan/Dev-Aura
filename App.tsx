import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Tutor from './components/Tutor';
import HandsOn from './components/HandsOn';
import Progress from './components/Progress';
import WeeklyGraph from './components/WeeklyGraph';
import Guide from './components/Guide';
import Tasks from './components/Tasks';
import Login from './components/Login';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check system preference or default
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <Home onChangeView={setCurrentView} />;
      case View.TUTOR: return <Tutor />;
      case View.HANDS_ON: return <HandsOn />;
      case View.PROGRESS: return <Progress />;
      case View.WEEKLY_GRAPH: return <WeeklyGraph />;
      case View.GUIDE: return <Guide />;
      case View.TASKS: return <Tasks />;
      default: return <Home onChangeView={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden text-earth-900 dark:text-gray-200 transition-colors duration-300 relative bg-earth-100 dark:bg-[#1a1b1e]`}>
      
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
      />
      
      <main className="flex-1 ml-20 h-full overflow-hidden relative z-10">
        {renderView()}
      </main>
    </div>
  );
};

export default App;