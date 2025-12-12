import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, LiveSessionManager } from '../services/geminiService';
import { ChatMessage } from '../types';

const Tutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: "Hello! I'm **DEVAURA**, your AI Tutor. I'll keep things **short and clear**. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const liveManagerRef = useRef<LiveSessionManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !file) || isLoading) return;

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input,
      image: file ? URL.createObjectURL(file) : undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    let imagePart = undefined;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        imagePart = {
          inlineData: { data: base64String, mimeType: file.type }
        };
        const responseText = await sendChatMessage(input, history, imagePart);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText || "" }]);
        setFile(null);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      const responseText = await sendChatMessage(input, history);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: responseText || "" }]);
      setIsLoading(false);
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      await liveManagerRef.current?.disconnect();
      setIsLive(false);
      liveManagerRef.current = null;
    } else {
      setIsLive(true);
      liveManagerRef.current = new LiveSessionManager((text) => {
         // For now, we are not displaying partial transcriptions in the main chat to keep it clean
      });
      await liveManagerRef.current.connect();
    }
  };

  return (
    <div className="flex flex-col h-full bg-earth-50 dark:bg-discord-dark relative">
      <div className="flex-none p-4 border-b border-earth-200 dark:border-discord-darkest flex justify-between items-center">
        <h2 className="text-xl font-bold">AI Tutor</h2>
        <button 
          onClick={toggleLive}
          className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
            isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-earth-400 dark:bg-indigo-600 text-white'
          }`}
        >
          <i className={`fas ${isLive ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
          {isLive ? 'End Live Session' : 'Start Voice Chat'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-earth-500 text-white dark:bg-indigo-500' 
                : 'bg-white text-earth-900 dark:bg-discord-light dark:text-gray-100'
            }`}>
              {msg.image && (
                <img src={msg.image} alt="User upload" className="max-w-xs rounded mb-2" />
              )}
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500 italic">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 bg-white dark:bg-discord-darker">
        <div className="flex items-center gap-2 rounded-xl bg-earth-100 dark:bg-discord-dark p-2 border border-earth-300 dark:border-none">
           <label className="cursor-pointer text-earth-600 dark:text-gray-400 hover:text-earth-800 dark:hover:text-white p-2">
             <i className="fas fa-paperclip"></i>
             <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
           </label>
           {file && <span className="text-xs bg-earth-300 dark:bg-discord-light px-2 py-1 rounded">{file.name}</span>}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about code, algorithms, or upload a diagram..."
            className="flex-1 bg-transparent outline-none text-earth-900 dark:text-gray-100"
          />
          <button onClick={handleSend} className="p-2 text-earth-600 dark:text-indigo-400 hover:text-earth-800">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;