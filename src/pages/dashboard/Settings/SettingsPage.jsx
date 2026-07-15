import { useState } from 'react';
import { User, CreditCard, Palette, Shield, Star, LogOut } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

// Import our new chunked components
import ProfileTab from './tabs/ProfileTab';
import AppearanceTab from './tabs/AppearanceTab';
import BillingTab from './tabs/BillingTab';
import SecurityTab from './tabs/SecurityTab';
import SupportTab from './tabs/SupportTab';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'support', label: 'Help & Support', icon: Star },
];

const SettingsPage = () => {
  const { logout } = useApp();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full animate-fade-in-up transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-txt transition-colors duration-300">Settings</h1>
        <p className="text-muted mt-2 text-sm transition-colors duration-300">Manage your account preferences and profile details.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent ${
                  isActive 
                    ? 'bg-brand/10 text-brand-lt border-brand/20' 
                    : 'text-muted hover:bg-card hover:text-txt hover:border-bdr'
                }`}
              >
                <Icon size={18} />
                {tab.label}
               </button>
            );
          })}
          
          <div className="pt-4 mt-4 border-t border-bdr">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border border-bdr rounded-2xl p-6 md:p-8 transition-colors duration-300">
            {/* We dynamically render only the active chunk */}
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'appearance' && <AppearanceTab />}
            {activeTab === 'billing' && <BillingTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'support' && <SupportTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;