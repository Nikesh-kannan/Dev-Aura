import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createPcmBlob, base64ToBytes, decodeAudioData } from "./audioUtils";

// NOTE: In a production app, never expose keys on the client.
// This is for demonstration using the env variable pattern requested.
const apiKey = process.env.API_KEY || ''; 

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey });

// --- Chat & Tutoring ---

export const sendChatMessage = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[],
  imagePart?: { inlineData: { data: string; mimeType: string } },
  isGuide: boolean = false
) => {
  try {
    const model = 'gemini-3-pro-preview'; // Powerful model for reasoning
    const parts: any[] = [{ text: prompt }];
    if (imagePart) {
      parts.unshift(imagePart);
    }
    
    // Construct history for context
    const chatHistory = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    const systemInstruction = isGuide 
      ? "You are a specialized Career Guide and Mentor within the DEVAURA platform. Your goal is to analyze the user's current status and provide tailored, actionable career advice. Ask probing questions if you need more info. Be supportive but realistic. Keep responses concise and structured."
      : "You are DEVAURA, an Adaptive CS Tutor. Your responses must be **concise**, **detailed**, and **accurate**. Do not provide excessive fluff. Focus on delivering the correct answer or explanation clearly. Use bold text for key concepts.";

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...chatHistory,
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Chat Error", error);
    return "I'm having trouble connecting to my brain right now. Please try again.";
  }
};

// --- Project Evaluation ---

export const evaluateProject = async (projectDetails: string) => {
  try {
    const prompt = `
    You are a Senior Technical Lead evaluating a student's project submission.
    
    Submission Details:
    ${projectDetails}
    
    Please provide a structured evaluation in Markdown format:
    1. **Grade** (A-F) based on complexity, code quality (if provided), and description.
    2. **Key Strengths**: Bullet points of what was done well.
    3. **Areas for Improvement**: Specific technical or logical advice.
    4. **Recommended Next Steps**: What should they learn or refactor next?
    
    Keep the tone constructive but professional and rigorous.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });
    return response.text;
  } catch (error) {
    return "Unable to evaluate project at this time. Please try again later.";
  }
};

// --- Code Helper (CCS) ---

export const analyzeCode = async (code: string, query: string, language: string) => {
  try {
    const prompt = `
    Analyze this ${language} code context:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    User Query: ${query}
    
    Provide a concise, helpful response. If there's a bug, point it out.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Code Analysis Error", error);
    return "Could not analyze code.";
  }
};

// --- Code Execution Simulation (Compiler) ---

export const runCodeWithAI = async (code: string, language: string) => {
  try {
    const prompt = `
    Act as a strictly compliant ${language} compiler/interpreter.
    Execute the following code and provide *only* the output that would appear on the standard output (stdout).
    
    Code:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Rules:
    1. If the code runs successfully, output the result.
    2. If there is a syntax or runtime error, output the error message exactly as the compiler would.
    3. Do NOT provide explanations, markdown formatting, or 'Output:' prefixes. Just the raw string result.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Error: Unable to connect to Cloud Execution Engine.";
  }
};

// --- Grounding (News & Maps) ---

export const searchTechNews = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Find 5 recent, trending computer science news headlines. Return them as a list.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text;
    
    return { text, chunks };
  } catch (error) {
    return { text: "Failed to fetch news.", chunks: [] };
  }
};

export const findLocalEvents = async (lat: number, lng: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 3 upcoming computer science or tech events (like Hackathons, Symposiums, Meetups) near latitude ${lat}, longitude ${lng}. List them with their type (e.g., Hackathon, Symposium).`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text: response.text, chunks };
  } catch (error) {
    return { text: "Could not find local events.", chunks: [] };
  }
};

// --- Live API Management ---

export class LiveSessionManager {
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private sessionPromise: Promise<any> | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private onMessageCallback: (text: string) => void;

  constructor(onMessage: (text: string) => void) {
    this.onMessageCallback = onMessage;
  }

  async connect() {
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = this.outputAudioContext.createGain();
    outputNode.connect(this.outputAudioContext.destination);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          console.log("Live Session Opened");
          if (!this.inputAudioContext) return;
          
          const source = this.inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createPcmBlob(inputData);
            this.sessionPromise?.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          
          source.connect(scriptProcessor);
          scriptProcessor.connect(this.inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
           if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
             this.onMessageCallback(message.serverContent.modelTurn.parts[0].text);
           }

          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio && this.outputAudioContext) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(
              base64ToBytes(base64Audio),
              this.outputAudioContext,
              24000
            );
            
            const source = this.outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.sources.add(source);
            
            source.onended = () => this.sources.delete(source);
          }
          
          if (message.serverContent?.interrupted) {
             this.sources.forEach(src => src.stop());
             this.sources.clear();
             this.nextStartTime = 0;
          }
        },
        onError: (err) => console.error("Live Error", err),
        onClose: () => console.log("Live Closed")
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        },
        systemInstruction: "You are DEVAURA, an Adaptive CS Tutor. Be concise, helpful, and encouraging."
      }
    });
  }
  
  async disconnect() {
      if (this.inputAudioContext) await this.inputAudioContext.close();
      if (this.outputAudioContext) await this.outputAudioContext.close();
      this.inputAudioContext = null;
      this.outputAudioContext = null;
  }
}