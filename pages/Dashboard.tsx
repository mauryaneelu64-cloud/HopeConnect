import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { EmotionalStatus } from '../types';
import { MessageCircle, Search, PlayCircle, AlertCircle, Smile, Frown, Meh, Heart } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, setEmotionalStatus } = useApp();
  const navigate = useNavigate();

  const handleCheckIn = (status: EmotionalStatus) => {
    setEmotionalStatus(status);
  };

  const getStatusColor = (status: EmotionalStatus) => {
    switch(status) {
      case EmotionalStatus.Great: return 'text-green-600 bg-green-50 border-green-200';
      case EmotionalStatus.Good: return 'text-teal-600 bg-teal-50 border-teal-200';
      case EmotionalStatus.Okay: return 'text-blue-600 bg-blue-50 border-blue-200';
      case EmotionalStatus.Struggling: return 'text-orange-600 bg-orange-50 border-orange-200';
      case EmotionalStatus.Crisis: return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hi, {user.name}</h1>
          <p className="text-slate-500">How are you feeling right now?</p>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(user.currentStatus)}`}>
          Status: {user.currentStatus}
        </div>
      </div>

      {/* Mood Check-in Grid */}
      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {[
          { label: 'Great', icon: Heart, status: EmotionalStatus.Great, color: 'hover:bg-green-100 text-green-600' },
          { label: 'Good', icon: Smile, status: EmotionalStatus.Good, color: 'hover:bg-teal-100 text-teal-600' },
          { label: 'Okay', icon: Meh, status: EmotionalStatus.Okay, color: 'hover:bg-blue-100 text-blue-600' },
          { label: 'Struggling', icon: Frown, status: EmotionalStatus.Struggling, color: 'hover:bg-orange-100 text-orange-600' },
          { label: 'Crisis', icon: AlertCircle, status: EmotionalStatus.Crisis, color: 'hover:bg-red-100 text-red-600' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleCheckIn(item.status)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-100 shadow-sm bg-white transition-all transform hover:scale-105 ${item.color}`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div onClick={() => navigate('/chat')} className="cursor-pointer bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-200 transform hover:-translate-y-1 transition-all">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-1">Talk to AI Support</h3>
          <p className="text-teal-100 text-sm">24/7 empathetic companion tailored to your feelings.</p>
        </div>

        <div onClick={() => navigate('/counselors')} className="cursor-pointer bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Find a Counselor</h3>
          <p className="text-slate-500 text-sm">Browse professionals nationwide or near you.</p>
        </div>

        <div onClick={() => navigate('/resources')} className="cursor-pointer bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
            <PlayCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Instant Resources</h3>
          <p className="text-slate-500 text-sm">Guided exercises, calming videos, and stories.</p>
        </div>
      </div>

      {/* Emergency CTA */}
      <div className="mt-8">
        <button 
          onClick={() => navigate('/emergency')}
          className="w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between group hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center group-hover:bg-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-red-700">I Need Immediate Help</h4>
              <p className="text-red-500 text-sm">Access crisis hotlines & notify emergency contact</p>
            </div>
          </div>
          <div className="text-red-400 group-hover:translate-x-1 transition-transform">→</div>
        </button>
      </div>
    </div>
  );
};
