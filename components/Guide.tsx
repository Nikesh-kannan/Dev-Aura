import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, evaluateProject } from '../services/geminiService';
import { ChatMessage } from '../types';

const Guide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'mentor'>('tracker');
  
  // Mentor State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: "**Hello! I am your DEVAURA Career Guide.** \n\nI'm here to analyze your current skills and provide tailored advice. Tell me about your interests, current level, or what you're confused about." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tracker State
  const [projectText, setProjectText] = useState('');
  const [evalResult, setEvalResult] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
    }));

    const responseText = await sendChatMessage(input, history, undefined, true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText || "" }]);
    setIsLoading(false);
  };

  const handleEvaluate = async () => {
    if (!projectText.trim()) return;
    setIsEvaluating(true);
    setEvalResult('');
    const feedback = await evaluateProject(projectText);
    setEvalResult(feedback || "No feedback generated.");
    setIsEvaluating(false);
  };

  const roadmap = [
    { id: 1, title: 'Foundations', desc: 'Syntax, Logic, & Git', status: 'completed' },
    { id: 2, title: 'Data Structures', desc: 'Trees, Graphs, & Arrays', status: 'completed' },
    { id: 3, title: 'Algorithms', desc: 'Sorting, Searching, & DP', status: 'in-progress', current: true },
    { id: 4, title: 'System Design', desc: 'Scalability & Databases', status: 'locked' },
    { id: 5, title: 'Cloud/DevOps', desc: 'AWS, Docker, CI/CD', status: 'locked' },
  ];

  return (
    <div className="flex flex-col h-full bg-earth-50 dark:bg-discord-dark">
      <div className="flex-none p-4 border-b border-earth-200 dark:border-discord-darkest bg-white dark:bg-discord-darker flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-earth-900 dark:text-white">
            <i className="fas fa-compass text-earth-600 dark:text-indigo-500"></i>
            Guide
          </h2>
          
          <div className="flex bg-earth-100 dark:bg-discord-dark p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'tracker' ? 'bg-white dark:bg-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              Progress Tracker
            </button>
            <button 
              onClick={() => setActiveTab('mentor')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'mentor' ? 'bg-white dark:bg-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
            >
              AI Mentor
            </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'tracker' ? (
          <div className="p-8 max-w-5xl mx-auto space-y-10">
            {/* Roadmap Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-map-signs text-earth-500"></i> Learning Roadmap
              </h3>
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-200 dark:bg-discord-light -z-10"></div>
                
                <div className="space-y-6">
                  {roadmap.map((step) => (
                    <div key={step.id} className={`flex items-start gap-6 relative ${step.status === 'locked' ? 'opacity-50 grayscale' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-discord-dark z-10 
                        ${step.status === 'completed' ? 'bg-green-500 text-white' : 
                          step.status === 'in-progress' ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-300 dark:bg-discord-light text-gray-500'}`}>
                        {step.status === 'completed' ? <i className="fas fa-check"></i> : 
                         step.status === 'in-progress' ? <i className="fas fa-running"></i> : <i className="fas fa-lock"></i>}
                      </div>
                      <div className="flex-1 bg-white dark:bg-discord-darker p-4 rounded-xl shadow-sm border border-earth-100 dark:border-discord-darkest">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="font-bold text-lg">{step.title}</h4>
                               <p className="text-sm text-gray-500">{step.desc}</p>
                            </div>
                            {step.current && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase">Current Focus</span>}
                         </div>
                         
                         {step.current && (
                           <div className="mt-4 pt-4 border-t border-gray-100 dark:border-discord-dark">
                             <h5 className="text-xs font-bold uppercase text-gray-400 mb-2">Next Actions</h5>
                             <ul className="space-y-2">
                               <li className="flex items-center gap-2 text-sm text-earth-800 dark:text-gray-300">
                                 <i className="far fa-circle text-blue-400"></i> Implement Dijkstra's Algorithm
                               </li>
                               <li className="flex items-center gap-2 text-sm text-earth-800 dark:text-gray-300">
                                 <i className="far fa-circle text-blue-400"></i> Solve 3 Dynamic Programming problems
                               </li>
                             </ul>
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Project Evaluation Section */}
            <section className="bg-white dark:bg-discord-darker p-6 rounded-2xl shadow-sm border border-earth-200 dark:border-discord-darkest">
               <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-earth-900 dark:text-white">
                 <i className="fas fa-microscope text-purple-500"></i> Project Evaluator
               </h3>
               <p className="text-sm text-gray-500 mb-4">Submit your current project code, GitHub link, or description for instant AI grading and feedback.</p>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-3">
                   <textarea 
                     value={projectText}
                     onChange={(e) => setProjectText(e.target.value)}
                     placeholder="Paste your code snippet, GitHub repository URL, or a detailed description of your project here..."
                     className="flex-1 h-64 p-4 rounded-xl bg-earth-50 dark:bg-discord-dark border border-earth-200 dark:border-discord-darkest outline-none focus:border-purple-500 transition-colors resize-none font-mono text-sm"
                   />
                   <button 
                     onClick={handleEvaluate}
                     disabled={!projectText.trim() || isEvaluating}
                     className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                   >
                     {isEvaluating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                     {isEvaluating ? 'Grading...' : 'Submit for Evaluation'}
                   </button>
                 </div>
                 
                 <div className="bg-earth-50 dark:bg-discord-dark rounded-xl p-4 h-64 overflow-y-auto border border-earth-200 dark:border-discord-darkest">
                    {evalResult ? (
                      <div className="prose dark:prose-invert text-sm max-w-none">
                        <ReactMarkdown>{evalResult}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                        <i className="fas fa-clipboard-check text-4xl mb-2 opacity-30"></i>
                        <p>Feedback will appear here.</p>
                      </div>
                    )}
                 </div>
               </div>
            </section>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-6 shadow-md ${
                    msg.role === 'user' 
                      ? 'bg-earth-600 text-white dark:bg-indigo-600' 
                      : 'bg-white text-earth-900 dark:bg-discord-light dark:text-gray-100'
                  }`}>
                    <div className="prose dark:prose-invert max-w-none text-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start animate-pulse">
                      <div className="bg-white dark:bg-discord-light p-4 rounded-xl text-sm text-gray-500">
                          Analyzing your profile...
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-earth-100 dark:bg-discord-darker">
              <div className="flex gap-2 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="e.g. I know Python but don't know if I should do Data Science or Backend..."
                  className="flex-1 p-4 rounded-xl bg-white dark:bg-discord-dark border-none outline-none shadow-sm text-earth-900 dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-earth-600 dark:bg-indigo-600 text-white px-6 rounded-xl hover:opacity-90 transition-opacity font-bold disabled:opacity-50"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guide;