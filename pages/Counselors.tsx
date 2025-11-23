import React, { useState } from 'react';
import { MOCK_COUNSELORS } from '../constants';
import { Button } from '../components/Button';
import { MapPin, Star, MessageSquare, Clock, Search, Map as MapIcon } from 'lucide-react';
import { findNearbyPlaces } from '../services/geminiService';

export const Counselors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'national' | 'local'>('national');
  const [searchQuery, setSearchQuery] = useState('');
  const [localResults, setLocalResults] = useState<any[]>([]);
  const [isSearchingLocal, setIsSearchingLocal] = useState(false);
  const [localSearchText, setLocalSearchText] = useState('');

  const filteredNational = MOCK_COUNSELORS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocalSearch = async () => {
    setIsSearchingLocal(true);
    if (!navigator.geolocation) {
       alert("Geolocation is not supported by this browser.");
       setIsSearchingLocal(false);
       return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const result = await findNearbyPlaces("Mental health counselors", { lat: latitude, lng: longitude });
      
      if (result.places && result.places.length > 0) {
        setLocalResults(result.places);
      } else {
        setLocalResults([]);
      }
      setLocalSearchText(result.text || '');
      setIsSearchingLocal(false);
    }, (error) => {
       console.error(error);
       alert("Unable to retrieve your location. Please allow location access.");
       setIsSearchingLocal(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-fit">
        <button
          onClick={() => setActiveTab('national')}
          className={`flex-1 md:w-40 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'national' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          National Directory
        </button>
        <button
          onClick={() => setActiveTab('local')}
          className={`flex-1 md:w-40 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'local' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Near Me
        </button>
      </div>

      {activeTab === 'national' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="grid gap-4">
            {filteredNational.map((counselor) => (
              <div key={counselor.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
                <img src={counselor.imageUrl} alt={counselor.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{counselor.name}</h3>
                      <p className="text-teal-600 text-sm font-medium">{counselor.specialization}</p>
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {counselor.rating}
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                       <MapPin className="w-4 h-4" /> <span>{counselor.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Clock className="w-4 h-4" /> <span>{counselor.availability}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 md:w-40 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                  <div className="text-center font-bold text-slate-800">{counselor.fee}</div>
                  <Button size="sm" onClick={() => alert("Simulating chat with doctor...")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'local' && (
        <div className="space-y-6 py-4">
            {localResults.length === 0 && !localSearchText && (
                 <div className="text-center py-10">
                     <div className="bg-teal-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-teal-600 mb-4">
                        <MapPin className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Find Professionals Nearby</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        We use your location to find verified mental health professionals in your area using Google Maps.
                    </p>
                     <Button onClick={handleLocalSearch} disabled={isSearchingLocal}>
                        {isSearchingLocal ? 'Searching...' : 'Search Near Me'}
                    </Button>
                 </div>
            )}

            {isSearchingLocal && (
                <div className="text-center py-10 text-slate-500 animate-pulse">
                    Searching nearby resources...
                </div>
            )}

            {localSearchText && !isSearchingLocal && (
                 <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
                     <h4 className="font-bold text-slate-800 mb-2">AI Summary</h4>
                     <p className="text-sm text-slate-600">{localSearchText}</p>
                 </div>
            )}

            {localResults.length > 0 && (
                <div className="grid gap-4">
                    {localResults.map((place: any, idx: number) => (
                         <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{place.maps.title}</h4>
                                    <p className="text-slate-500 text-sm mt-1">{place.maps.address}</p>
                                    {place.maps.rating && (
                                        <div className="flex items-center text-yellow-500 text-sm font-bold mt-2">
                                            <Star className="w-4 h-4 fill-current mr-1" />
                                            {place.maps.rating} ({place.maps.userRatingCount})
                                        </div>
                                    )}
                                </div>
                                <div className="bg-teal-50 p-2 rounded-lg">
                                    <MapIcon className="w-6 h-6 text-teal-600" />
                                </div>
                            </div>
                            {place.maps.uri && (
                                <a 
                                    href={place.maps.uri} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                                >
                                    View on Google Maps
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                </a>
                            )}
                         </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};