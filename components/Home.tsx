import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { searchTechNews, findLocalEvents } from '../services/geminiService';
import { Task, View } from '../types';

interface HomeProps {
  onChangeView: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ onChangeView }) => {
  const [news, setNews] = useState<{text: string, chunks: any[]}>({ text: 'Loading news...', chunks: [] });
  const [events, setEvents] = useState<{text: string, chunks: any[]}>({ text: 'Locating...', chunks: [] });
  const [points] = useState(1250);
  
  // Mock Tasks for Home Display
  const [homeTasks] = useState<Task[]>([
    { id: '1', title: 'Binary Search Module', deadline: new Date(Date.now() + 86400000).toISOString(), completed: false, priority: 'Medium', type: 'Task' },
    { id: '2', title: 'Personal Portfolio', deadline: new Date(Date.now() + 172800000).toISOString(), completed: false, priority: 'High', type: 'Project' },
    { id: '3', title: 'Database Optimization', deadline: new Date(Date.now() - 86400000).toISOString(), completed: false, priority: 'Critical', type: 'Project' },
  ]);

  useEffect(() => {
    searchTechNews().then(setNews);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          findLocalEvents(position.coords.latitude, position.coords.longitude).then(setEvents);
        },
        () => setEvents({ text: "Location access denied.", chunks: [] })
      );
    } else {
      setEvents({ text: "Geolocation not supported.", chunks: [] });
    }
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto">
      {/* 1. Vibrant Stats & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-earth-400 to-earth-600 dark:from-indigo-600 dark:to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
              <i className="fas fa-trophy text-9xl"></i>
           </div>
           <div>
             <h3 className="text-white/80 uppercase text-xs font-bold tracking-wider mb-2">Total XP</h3>
             <div className="text-5xl font-bold">{points}</div>
             <p className="text-sm text-white/90 mt-2">Level: Intermediate</p>
           </div>
           <div className="mt-4">
             <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/90 w-[70%]"></div>
             </div>
             <p className="text-xs mt-1 text-right">350 XP to Advanced</p>
           </div>
        </div>

        {/* Active Projects & Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-discord-dark rounded-2xl p-6 shadow-sm border border-earth-200 dark:border-discord-darker flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-earth-800 dark:text-white">
              <i className="fas fa-tasks text-earth-500 dark:text-indigo-400"></i>
              Active Priorities
            </h3>
            <button 
              onClick={() => onChangeView(View.TASKS)}
              className="text-xs text-earth-600 dark:text-gray-400 hover:text-earth-800 dark:hover:text-white"
            >
              See All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="flex-1 space-y-3">
             {homeTasks.map(task => {
                const isProject = task.type === 'Project';
                const date = new Date(task.deadline);
                const isOverdue = date < new Date();
                
                return (
                  <div 
                    key={task.id} 
                    onClick={() => onChangeView(View.TASKS)}
                    className="flex items-center justify-between p-3 rounded-xl bg-earth-50 dark:bg-discord-darker hover:bg-earth-100 dark:hover:bg-discord-light transition-colors cursor-pointer"
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isProject ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <div>
                           <p className="font-bold text-sm text-earth-900 dark:text-gray-200">{task.title}</p>
                           <p className="text-xs text-gray-500">
                             {isProject ? 'Project' : 'Task'} • {task.priority} Priority
                           </p>
                        </div>
                     </div>
                     <div className={`text-right ${isOverdue ? 'text-red-500' : 'text-earth-600 dark:text-gray-400'}`}>
                        <p className="text-xs font-bold">{isOverdue ? 'Overdue' : 'Due'}</p>
                        <p className="text-xs font-mono">{date.toLocaleDateString()}</p>
                     </div>
                  </div>
                );
             })}
          </div>
        </div>
      </div>

      {/* 2. Horizontal News Slider */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-earth-800 dark:text-white">
          <i className="fas fa-bolt text-yellow-500"></i>
          Trending Tech
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
           {/* If we have chunks (links), prioritize showing them as cards */}
           {news.chunks.length > 0 ? (
             news.chunks.map((chunk, i) => (
                chunk.web?.uri ? (
                  <a 
                    key={i} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="snap-center shrink-0 w-72 h-40 bg-white dark:bg-discord-dark rounded-xl p-4 shadow-sm border border-earth-200 dark:border-discord-darker hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <h4 className="font-bold text-earth-900 dark:text-white line-clamp-3">{chunk.web.title}</h4>
                    <span className="text-xs text-blue-500 dark:text-blue-400 self-end">Read Article <i className="fas fa-external-link-alt ml-1"></i></span>
                  </a>
                ) : null
             ))
           ) : (
             // Fallback to parsing text if no structured chunks or while loading
             <div className="snap-center shrink-0 w-80 bg-white dark:bg-discord-dark rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-6">{news.text}</p>
             </div>
           )}
           
           {/* View All Card - Fixed Link */}
           <a 
              href="https://news.google.com/topics/CAAqJggBCiSJASIhSDJ5X3d2R1JibXN5TjHaTWh2YXdKZXdwYlMxNE9Rb0FQAQ?hl=en-US&gl=US&ceid=US%3Aen" 
              target="_blank" 
              rel="noreferrer"
              className="snap-center shrink-0 w-40 flex items-center justify-center bg-earth-200 dark:bg-discord-darker rounded-xl text-earth-600 dark:text-gray-400 font-bold cursor-pointer hover:bg-earth-300 dark:hover:bg-discord-light transition group"
            >
              <div className="text-center">
                 View All
                 <i className="fas fa-arrow-right block mt-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
           </a>
        </div>
      </div>

      {/* 3. Local Events List */}
      <div className="bg-white dark:bg-discord-dark rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-earth-800 dark:text-white">
          <i className="fas fa-map-marked-alt text-earth-600 dark:text-indigo-400"></i>
          Local Tech Events
        </h2>
        <div className="flex flex-col gap-3">
             {events.chunks.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {events.chunks.map((chunk, i) => (
                    chunk.web?.uri ? (
                      <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="flex items-start gap-3 bg-earth-50 dark:bg-discord-darker p-3 rounded-xl hover:bg-earth-100 dark:hover:bg-discord-light transition group">
                        <div className="w-10 h-10 rounded-full bg-earth-200 dark:bg-indigo-900/50 flex items-center justify-center text-earth-600 dark:text-indigo-400 group-hover:bg-earth-300 dark:group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div>
                          <strong className="block text-earth-900 dark:text-white text-sm">{chunk.web.title}</strong>
                          <span className="text-xs text-gray-500">Click to view event details</span>
                        </div>
                      </a>
                    ) : null
                 ))}
               </div>
             ) : (
                <div className="text-center text-gray-400 text-sm py-4">
                  {/* Changed to remove large paragraph fallback */}
                  {events.text === 'Locating...' ? 'Checking for events...' : 'No specific events found nearby.'}
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default Home;