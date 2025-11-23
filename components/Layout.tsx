import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Users, BookOpen, Menu, X, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // If not onboarded, don't show layout (simplified for this structure)
  if (!user.isOnboarded && location.pathname !== '/onboarding') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'AI Chat', icon: MessageCircle, path: '/chat' },
    { name: 'Counselors', icon: Users, path: '/counselors' },
    { name: 'Resources', icon: BookOpen, path: '/resources' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">H</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">HopeConnect</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 font-medium transition-colors ${
                    isActive ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <button 
              onClick={() => navigate('/emergency')}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-4">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-4 rounded-xl ${
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
                  }`
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="text-lg font-medium">{item.name}</span>
              </NavLink>
            ))}
             <button 
              onClick={() => {
                navigate('/emergency');
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 p-4 rounded-xl bg-red-50 text-red-600 w-full"
            >
              <Phone className="w-6 h-6" />
              <span className="text-lg font-bold">Emergency Help</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-6 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Nav (Sticky) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50 safe-area-bottom">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg ${
                isActive ? 'text-teal-600' : 'text-slate-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
