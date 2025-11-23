export enum EmotionalStatus {
  Unknown = "Unknown",
  Great = "Great",
  Good = "Good",
  Okay = "Okay",
  Struggling = "Struggling",
  Crisis = "Crisis"
}

export interface UserProfile {
  name: string;
  ageRange: string;
  isOnboarded: boolean;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  permissions: {
    emergencyAlerts: boolean;
    locationSharing: boolean;
    autoCall: boolean;
  };
  currentStatus: EmotionalStatus;
}

export interface Counselor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviewCount: number;
  fee: string;
  availability: string;
  location: string;
  imageUrl: string;
  isOnline: boolean;
}

export interface WellnessResource {
  id: string;
  title: string;
  category: 'Video' | 'Exercise' | 'Quote' | 'Story';
  content: string; // URL or text
  thumbnail?: string;
  duration?: string;
  author?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}
