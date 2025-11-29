export interface CoreValue {
  name: string;
  score: number; // 0-100 representation of focus
  description: string;
}

export interface ActionItem {
  id: string;
  title: string;
  category: 'Family' | 'Society' | 'Career' | 'Self';
  isCompleted: boolean;
}

export interface ManifestoAnalysis {
  englishTranslation: string;
  coreValues: CoreValue[];
  dailyMotivation: string;
  suggestedActions: string[]; // Raw strings to be converted to ActionItems
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}