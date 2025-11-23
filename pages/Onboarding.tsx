import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { AGE_RANGES } from '../constants';
import { ShieldCheck, User, Phone, Lock } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { updateUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    ecName: '',
    ecPhone: '',
    ecRelation: '',
    permAlerts: false,
    permLocation: false,
    permAutoCall: false
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = () => {
    updateUser({
      name: formData.name,
      ageRange: formData.ageRange,
      isOnboarded: true,
      emergencyContact: {
        name: formData.ecName,
        phone: formData.ecPhone,
        relationship: formData.ecRelation
      },
      permissions: {
        emergencyAlerts: formData.permAlerts,
        locationSharing: formData.permLocation,
        autoCall: formData.permAutoCall
      }
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100">
          <div 
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome to HopeConnect</h2>
                <p className="text-slate-500 mt-2">Let's get to know you better to personalize your journey.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">What should we call you?</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age Range</label>
                  <select 
                    value={formData.ageRange}
                    onChange={e => setFormData({...formData, ageRange: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="">Select age range</option>
                    {AGE_RANGES.map(age => <option key={age} value={age}>{age}</option>)}
                  </select>
                </div>
              </div>

              <Button 
                fullWidth 
                onClick={handleNext}
                disabled={!formData.name || !formData.ageRange}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                  <Phone className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Emergency Contact</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  We will <span className="font-bold">only</span> contact this person in a severe crisis with your explicit consent.
                </p>
              </div>

              <div className="space-y-4">
                <input 
                  type="text"
                  placeholder="Contact Name (e.g., Mom, Best Friend)"
                  value={formData.ecName}
                  onChange={e => setFormData({...formData, ecName: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.ecPhone}
                  onChange={e => setFormData({...formData, ecPhone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <input 
                  type="text"
                  placeholder="Relationship (e.g., Friend)"
                  value={formData.ecRelation}
                  onChange={e => setFormData({...formData, ecRelation: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex space-x-3">
                <Button variant="ghost" onClick={handleBack} className="w-1/3">Back</Button>
                <Button 
                  className="w-2/3"
                  onClick={handleNext}
                  disabled={!formData.ecName || !formData.ecPhone}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Safety & Privacy</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  Customize your safety nets. These are OFF by default.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'permAlerts', label: 'Emergency Alerts', desc: 'Notify emergency contact in crisis' },
                  { key: 'permLocation', label: 'Location Sharing', desc: 'Find nearby resources automatically' },
                  { key: 'permAutoCall', label: 'Auto-call Services', desc: 'Connect to 911/988 in severe events' },
                ].map((item) => (
                  <label key={item.key} className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox"
                      checked={(formData as any)[item.key]}
                      onChange={e => setFormData({...formData, [item.key]: e.target.checked})}
                      className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <div>
                      <div className="font-medium text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex items-start space-x-3 text-xs text-slate-500">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Your data is end-to-end encrypted. We never share your data with third parties. You can delete your account at any time.</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="ghost" onClick={handleBack} className="w-1/3">Back</Button>
                <Button className="w-2/3" onClick={handleFinish}>Complete Setup</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
