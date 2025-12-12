import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { analyzeCode, runCodeWithAI } from '../services/geminiService';

const HandsOn: React.FC = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Problem: Two Sum
// Given an array of integers nums and an integer target, 
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
  // Write your code here
  
}

// Test case to print output
console.log("Two Sum Test");
`);
  const [output, setOutput] = useState('');
  const [aiHelperInput, setAiHelperInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [helperLoading, setHelperLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (newLang === 'javascript') {
      setCode(`// Javascript Example\nfunction hello() {\n  console.log("Hello from JavaScript");\n}\n\nhello();`);
    } else if (newLang === 'python') {
      setCode(`# Python Example\ndef hello():\n    print("Hello from Python")\n\nhello()`);
    } else if (newLang === 'cpp') {
      setCode(`// C++ Example\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++";\n    return 0;\n}`);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');

    if (language === 'javascript') {
      // Local JavaScript execution with Console Capture
      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      // Override console methods
      console.log = (...args) => logs.push(args.map(a => String(a)).join(' '));
      console.error = (...args) => logs.push("Error: " + args.map(a => String(a)).join(' '));
      console.warn = (...args) => logs.push("Warn: " + args.map(a => String(a)).join(' '));

      try {
        // eslint-disable-next-line no-eval
        const result = window.eval(code);
        
        let displayOutput = logs.join('\n');
        // Only show return value if it's significant and logs are empty, or append it
        if (result !== undefined && typeof result !== 'function') {
           displayOutput += `\n> ${result}`;
        }
        
        setOutput(displayOutput || "Execution successful (No output)");
      } catch (err: any) {
        setOutput(`Runtime Error:\n${err.message}`);
      } finally {
        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        setIsRunning(false);
      }
    } else {
      // Python and C++ Simulation via Gemini
      const result = await runCodeWithAI(code, language);
      setOutput(result || "No output returned.");
      setIsRunning(false);
    }
  };

  const askHelper = async () => {
    if (!aiHelperInput) return;
    setHelperLoading(true);
    const response = await analyzeCode(code, aiHelperInput, language);
    setAiResponse(response || "No response generated.");
    setHelperLoading(false);
  };

  return (
    <div className="flex h-full gap-4 p-4 bg-earth-100 dark:bg-discord-dark">
      {/* Editor & Output */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 flex flex-col bg-white dark:bg-discord-darker rounded-xl overflow-hidden shadow-sm">
          <div className="bg-earth-200 dark:bg-discord-darkest px-4 py-2 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <span className="font-mono text-sm">editor</span>
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="text-xs p-1 rounded bg-white dark:bg-discord-light text-earth-900 dark:text-white border-none outline-none cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
             </div>
             <button 
                onClick={runCode} 
                disabled={isRunning}
                className={`text-white text-xs px-3 py-1 rounded flex items-center gap-2 transition-all ${isRunning ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
               {isRunning ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-play"></i>}
               {isRunning ? 'Running...' : 'Run'}
             </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono text-sm outline-none resize-none bg-white dark:bg-discord-darker text-gray-800 dark:text-gray-200"
            spellCheck={false}
          />
        </div>
        
        <div className="h-48 bg-black rounded-xl p-4 font-mono text-sm text-green-400 overflow-auto shadow-inner border-t-4 border-earth-400 dark:border-discord-light">
          <div className="text-gray-500 mb-1">Console Output:</div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      {/* Code Context Sync (CCS) Helper Sidebar */}
      <div className="w-80 flex flex-col bg-white dark:bg-discord-darker rounded-xl shadow-lg border border-earth-200 dark:border-discord-darkest">
        <div className="p-4 border-b border-earth-200 dark:border-discord-darkest">
          <h3 className="font-bold flex items-center gap-2">
            <i className="fas fa-magic text-purple-500"></i> AI Code Helper
          </h3>
          <p className="text-xs text-gray-500 mt-1">Context Synced: I see your {language} code.</p>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto text-sm space-y-4">
           {aiResponse ? (
             <div className="bg-earth-50 dark:bg-discord-dark p-3 rounded-lg border border-earth-200 dark:border-none prose dark:prose-invert max-w-none">
               <ReactMarkdown>{aiResponse}</ReactMarkdown>
             </div>
           ) : (
             <div className="text-center text-gray-400 mt-10">
               Ask about your code snippet...
             </div>
           )}
        </div>

        <div className="p-4 bg-earth-50 dark:bg-discord-dark">
          <div className="flex flex-col gap-2">
            <textarea 
               className="w-full bg-white dark:bg-discord-light rounded p-2 text-sm outline-none resize-none h-20 border border-earth-300 dark:border-none"
               placeholder="Why is this loop broken?"
               value={aiHelperInput}
               onChange={(e) => setAiHelperInput(e.target.value)}
            />
            <button 
              onClick={askHelper}
              disabled={helperLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm font-semibold disabled:opacity-50"
            >
              {helperLoading ? 'Analyzing...' : 'Ask Helper'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandsOn;