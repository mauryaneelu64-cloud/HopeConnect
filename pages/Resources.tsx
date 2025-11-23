import React, { useState } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { PlayCircle, FileText, Quote, BookOpen } from 'lucide-react';

export const Resources: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Video' | 'Exercise' | 'Quote' | 'Story'>('All');

  const filteredResources = filter === 'All' 
    ? MOCK_RESOURCES 
    : MOCK_RESOURCES.filter(r => r.category === filter);

  const getIcon = (cat: string) => {
    switch(cat) {
      case 'Video': return PlayCircle;
      case 'Exercise': return FileText;
      case 'Quote': return Quote;
      case 'Story': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Wellness Library</h2>
      
      {/* Category Filter */}
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
        {['All', 'Video', 'Exercise', 'Quote', 'Story'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === cat 
                ? 'bg-teal-600 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource) => {
          const Icon = getIcon(resource.category);
          return (
            <div key={resource.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              {resource.thumbnail && (
                <div className="h-40 bg-slate-200 w-full relative">
                   <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover" />
                   {resource.category === 'Video' && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                           <PlayCircle className="w-12 h-12 text-white opacity-90" />
                       </div>
                   )}
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">{resource.category}</span>
                  {resource.duration && <span className="text-slate-400 text-xs">• {resource.duration}</span>}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{resource.title}</h3>
                
                {resource.category === 'Quote' ? (
                  <blockquote className="text-teal-700 italic border-l-4 border-teal-500 pl-4 py-2 bg-teal-50 rounded-r-lg">
                    "{resource.content}"
                    <footer className="text-sm not-italic text-teal-600 mt-1">- {resource.author}</footer>
                  </blockquote>
                ) : (
                  <p className="text-slate-600 text-sm line-clamp-3">{resource.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
