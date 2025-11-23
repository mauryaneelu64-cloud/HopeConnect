import { Counselor, WellnessResource } from "./types";

export const MOCK_COUNSELORS: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Jenkins',
    specialization: 'Anxiety & Depression',
    experience: '12 Years',
    rating: 4.9,
    reviewCount: 124,
    fee: '$120/session',
    availability: 'Mon-Fri, 9AM-5PM',
    location: 'New York, NY',
    imageUrl: 'https://picsum.photos/100/100?random=1',
    isOnline: true
  },
  {
    id: '2',
    name: 'Mark Tumbarello',
    specialization: 'Trauma & PTSD',
    experience: '8 Years',
    rating: 4.8,
    reviewCount: 89,
    fee: '$90/session',
    availability: 'Tue-Sat, 10AM-6PM',
    location: 'Chicago, IL',
    imageUrl: 'https://picsum.photos/100/100?random=2',
    isOnline: false
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    specialization: 'Child Psychology',
    experience: '15 Years',
    rating: 5.0,
    reviewCount: 210,
    fee: '$150/session',
    availability: 'Mon-Thu, 8AM-4PM',
    location: 'Los Angeles, CA',
    imageUrl: 'https://picsum.photos/100/100?random=3',
    isOnline: true
  },
  {
    id: '4',
    name: 'David Chen',
    specialization: 'Addiction Recovery',
    experience: '10 Years',
    rating: 4.7,
    reviewCount: 56,
    fee: '$110/session',
    availability: 'Flexible',
    location: 'Seattle, WA',
    imageUrl: 'https://picsum.photos/100/100?random=4',
    isOnline: false
  }
];

export const MOCK_RESOURCES: WellnessResource[] = [
  {
    id: '1',
    title: '5-Minute Box Breathing',
    category: 'Exercise',
    content: 'Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat.',
    thumbnail: 'https://picsum.photos/300/200?random=5',
    duration: '5 min'
  },
  {
    id: '2',
    title: 'Understanding Anxiety',
    category: 'Video',
    content: 'https://www.youtube.com/embed/placeholder', 
    thumbnail: 'https://picsum.photos/300/200?random=6',
    duration: '12 min'
  },
  {
    id: '3',
    title: 'The only way out is through.',
    category: 'Quote',
    content: 'The only way out is through.',
    author: 'Robert Frost'
  },
  {
    id: '4',
    title: 'From Darkness to Light - Sarah\'s Journey',
    category: 'Story',
    content: 'Sarah struggled for years before finding the right support...',
    thumbnail: 'https://picsum.photos/300/200?random=7'
  },
  {
    id: '5',
    title: 'Progressive Muscle Relaxation',
    category: 'Exercise',
    content: 'Tense and then relax each muscle group, starting from your toes up to your head.',
    thumbnail: 'https://picsum.photos/300/200?random=8',
    duration: '10 min'
  }
];

export const AGE_RANGES = ["Under 18", "18-24", "25-34", "35-44", "45-64", "65+"];
