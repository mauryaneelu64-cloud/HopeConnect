import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, AlertTriangle, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Emergency: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [contacted, setContacted] = useState(false);

  const handleNotifyContact = () => {
    // In a real app, this would trigger an SMS/Push notification API
    setContacted(true);
    setTimeout(() => setContacted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-red-700 hover:text-red-900 font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <div className="bg-white p-6 rounded-3xl shadow-xl border-t-4 border-red-500 text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Emergency Help</h1>
          <p className="text-slate-600">You are not alone. Please reach out to one of the resources below.</p>
        </div>

        {/* Hotlines */}
        <div className="space-y-3">
            <a href="tel:988" className="block w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                        <div className="font-bold text-lg">Call 988</div>
                        <div className="text-red-100 text-xs">Suicide & Crisis Lifeline</div>
                    </div>
                </div>
                <div className="font-bold">CALL</div>
            </a>

            <a href="sms:741741" className="block w-full bg-slate-800 hover:bg-slate-900 text-white p-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <MessageSquare className="w-6 h-6" />
                    <div className="text-left">
                        <div className="font-bold text-lg">Text 741741</div>
                        <div className="text-slate-300 text-xs">Crisis Text Line</div>
                    </div>
                </div>
                <div className="font-bold">TEXT</div>
            </a>

             <a href="tel:911" className="block w-full bg-white border-2 border-red-100 hover:bg-red-50 text-red-700 p-4 rounded-xl transition-transform active:scale-95 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                        <div className="font-bold text-lg">Call 911</div>
                        <div className="text-slate-500 text-xs">Emergency Services</div>
                    </div>
                </div>
                <div className="font-bold">CALL</div>
            </a>
        </div>

        {/* Trusted Contact */}
        {user.emergencyContact.name && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8">
            <h3 className="font-bold text-slate-800 mb-2">Trusted Contact</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{user.emergencyContact.name}</div>
                <div className="text-sm text-slate-500">{user.emergencyContact.relationship}</div>
              </div>
              <button 
                onClick={handleNotifyContact}
                disabled={contacted}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    contacted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {contacted ? 'Notified' : 'Notify'}
              </button>
            </div>
            {contacted && <p className="text-xs text-green-600 mt-2">Notification sent via simulated backend.</p>}
             <a href={`tel:${user.emergencyContact.phone}`} className="mt-4 block w-full text-center py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                Call {user.emergencyContact.name} directly
             </a>
          </div>
        )}
      </div>
    </div>
  );
};
