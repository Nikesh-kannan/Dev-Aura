export enum View {
  HOME = 'HOME',
  TUTOR = 'TUTOR',
  HANDS_ON = 'HANDS_ON',
  PROGRESS = 'PROGRESS',
  WEEKLY_GRAPH = 'WEEKLY_GRAPH',
  GUIDE = 'GUIDE',
  TASKS = 'TASKS'
}

export enum UserLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Task {
  id: string;
  title: string;
  deadline: string; // ISO date
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  type: 'Task' | 'Project';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string;
  isAudio?: boolean;
}

export interface NavItem {
  id: View;
  label: string;
  icon: string;
}

export interface CodeSnippet {
  language: 'javascript' | 'python' | 'cpp';
  code: string;
}

export interface TechNewsItem {
  title: string;
  url: string;
  source: string;
}

export interface EventItem {
  title: string;
  location: string;
  url: string;
}