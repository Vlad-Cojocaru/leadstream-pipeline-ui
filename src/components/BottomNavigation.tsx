import React from 'react';
import { Home, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLeads } from '@/context/LeadsContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRefreshFlag } = useLeads();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/leadstream',
      isActive: location.pathname === '/leadstream'
    },
    {
      icon: BarChart3,
      label: 'Funnel',
      path: '/funnel',
      isActive: location.pathname === '/funnel'
    }
  ];

  const handleHomeClick = () => {
    if (location.pathname === '/leadstream') {
      console.log('[DEBUG] Home clicked while on Home, setting refreshFlag');
      setRefreshFlag(true);
    } else {
      navigate('/leadstream');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 px-4 py-2 z-50">
      <div className="flex justify-center items-center gap-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                item.isActive
                  ? 'text-[#0f7969] bg-[#0f7969]/10'
                  : 'text-gray-500 hover:text-[#0f7969] hover:bg-[#0f7969]/5'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${item.isActive ? 'text-[#0f7969]' : ''}`} />
              <span className={`text-xs font-medium ${item.isActive ? 'text-[#0f7969]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;