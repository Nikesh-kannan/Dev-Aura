import React, { useState, useMemo } from 'react';
import { Task } from '../types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete Binary Search Module', deadline: new Date(Date.now() + 86400000).toISOString(), completed: false, priority: 'Medium', type: 'Task' },
    { id: '2', title: 'Refactor Linked List Project', deadline: new Date(Date.now() - 86400000).toISOString(), completed: false, priority: 'High', type: 'Project' },
    { id: '3', title: 'System Design Diagram', deadline: new Date(Date.now() + 432000000).toISOString(), completed: true, priority: 'Low', type: 'Task' },
    { id: '4', title: 'DevOps CI/CD Pipeline', deadline: new Date(Date.now() + 200000000).toISOString(), completed: false, priority: 'Critical', type: 'Project' },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskType, setNewTaskType] = useState<'Task' | 'Project'>('Task');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low'|'Medium'|'High'|'Critical'>('Medium');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskDeadline) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      deadline: new Date(newTaskDeadline).toISOString(),
      completed: false,
      priority: newTaskPriority,
      type: newTaskType
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDeadline('');
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, progress };
  }, [tasks]);

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col space-y-8">
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl p-4 shadow-lg flex flex-col justify-between">
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Overall Progress</span>
            <div className="flex items-end justify-between">
                <span className="text-4xl font-bold">{stats.progress}%</span>
                <i className="fas fa-chart-pie text-3xl opacity-50"></i>
            </div>
            <div className="w-full bg-black/20 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${stats.progress}%` }}></div>
            </div>
        </div>
        <div className="bg-white dark:bg-discord-dark rounded-2xl p-4 shadow-sm border border-earth-200 dark:border-discord-darker flex flex-col justify-center">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <i className="fas fa-list-check"></i>
                 </div>
                 <div>
                     <span className="block text-2xl font-bold text-earth-900 dark:text-white">{stats.total}</span>
                     <span className="text-xs text-gray-500 uppercase font-bold">Total Tasks</span>
                 </div>
             </div>
        </div>
        <div className="bg-white dark:bg-discord-dark rounded-2xl p-4 shadow-sm border border-earth-200 dark:border-discord-darker flex flex-col justify-center">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <i className="fas fa-check"></i>
                 </div>
                 <div>
                     <span className="block text-2xl font-bold text-earth-900 dark:text-white">{stats.completed}</span>
                     <span className="text-xs text-gray-500 uppercase font-bold">Completed</span>
                 </div>
             </div>
        </div>
        <div className="bg-white dark:bg-discord-dark rounded-2xl p-4 shadow-sm border border-earth-200 dark:border-discord-darker flex flex-col justify-center">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <i className="fas fa-clock"></i>
                 </div>
                 <div>
                     <span className="block text-2xl font-bold text-earth-900 dark:text-white">{stats.pending}</span>
                     <span className="text-xs text-gray-500 uppercase font-bold">Pending</span>
                 </div>
             </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
        
        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <h2 className="text-xl font-bold text-earth-900 dark:text-white mb-2">My Backlog</h2>
          {tasks.map(task => {
            const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
            const isProject = task.type === 'Project';
            
            return (
              <div 
                key={task.id} 
                className={`group p-5 rounded-xl flex items-center justify-between shadow-sm border transition-all cursor-pointer relative overflow-hidden
                  ${task.completed 
                    ? 'opacity-60 bg-gray-50 dark:bg-discord-darker border-gray-200 dark:border-discord-darkest' 
                    : 'bg-white dark:bg-discord-dark border-earth-100 dark:border-discord-darker hover:shadow-md hover:border-earth-300 dark:hover:border-discord-light'}
                `}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center gap-5 z-10 w-full">
                  {/* Custom Checkbox */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                     ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-500 group-hover:border-green-500'}
                  `}>
                      {task.completed && <i className="fas fa-check text-white text-xs"></i>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase
                            ${isProject ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}
                        `}>
                            {task.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase
                            ${task.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
                              task.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                        `}>
                            {task.priority}
                        </span>
                    </div>
                    
                    <h4 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-400' : 'text-earth-900 dark:text-gray-100'}`}>
                      {task.title}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-2">
                        <div className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                           <i className="far fa-calendar"></i>
                           {isOverdue ? 'Overdue' : `Due: ${new Date(task.deadline).toLocaleDateString()}`}
                        </div>
                        {isProject && !task.completed && (
                            <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full w-2/3"></div>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && <p className="text-center text-gray-500 py-10">No tasks found.</p>}
        </div>

        {/* Add Task Panel */}
        <div className="w-full lg:w-80 bg-white dark:bg-discord-dark rounded-2xl p-6 shadow-sm border border-earth-200 dark:border-discord-darker h-fit">
           <h3 className="font-bold text-lg mb-4 text-earth-900 dark:text-white">New Item</h3>
           <form onSubmit={addTask} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input 
                    type="text" 
                    placeholder="What needs doing?" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-3 rounded-xl bg-earth-50 dark:bg-discord-darker dark:text-white border border-transparent focus:border-earth-400 dark:focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deadline</label>
                    <input 
                    type="date" 
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="w-full p-3 rounded-xl bg-earth-50 dark:bg-discord-darker dark:text-white border border-transparent focus:border-earth-400 dark:focus:border-indigo-500 outline-none transition-colors"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select 
                            value={newTaskType}
                            onChange={(e) => setNewTaskType(e.target.value as 'Task' | 'Project')}
                            className="w-full p-3 rounded-xl bg-earth-50 dark:bg-discord-darker dark:text-white border border-transparent outline-none cursor-pointer"
                        >
                            <option value="Task">Task</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                        <select 
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as any)}
                            className="w-full p-3 rounded-xl bg-earth-50 dark:bg-discord-darker dark:text-white border border-transparent outline-none cursor-pointer"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={!newTaskTitle || !newTaskDeadline}
                    className="w-full bg-earth-600 dark:bg-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity mt-2"
                >
                    <i className="fas fa-plus mr-2"></i> Create Item
                </button>
           </form>
        </div>

      </div>
    </div>
  );
};

export default Tasks;