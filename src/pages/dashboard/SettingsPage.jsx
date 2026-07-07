import { useState, useRef } from 'react';
import { User, CreditCard, Palette, Bell, Check, Loader2, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const SettingsPage = () => {
  // 🌟 Pulled token and setUser from AppContext to make the API call and update the UI globally
  const { user, token, setUser, theme, toggleTheme, logout } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🌟 NEW: Image Upload State & Refs
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Trigger the hidden file input when the user clicks "Change Avatar"
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the file selection and create a temporary preview image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }
      setAvatarFile(file);
      // Create a local URL to preview the image instantly before saving
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 🌟 NEW: The actual API call to your Cloudinary-equipped backend
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      // Because we are sending a file, we MUST use FormData instead of standard JSON
      const formData = new FormData();
      formData.append('name', name);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
 
        },
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        // Update the global app state so the Navbar Avatar updates instantly!
        setUser(result.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile Save Error:", error);
      alert("A network error occurred while saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  // Determine what image to show (Preview > Existing Avatar > Initial Letter)
  const displayAvatar = avatarPreview || user?.avatarUrl;

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
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Profile Information</h2>
                
                <div className="flex items-center gap-6 pb-6 border-b border-bdr transition-colors">
                  
                  {/* 🌟 Dynamic Avatar Display */}
                  {displayAvatar ? (
                    <img 
                      src={displayAvatar} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-brand/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-brand/20 text-brand-lt flex items-center justify-center text-2xl font-bold border border-brand/30">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <div>
                    {/* Hidden file input controlled by the button below */}
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/gif"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button 
                      onClick={handleAvatarClick}
                      className="px-4 py-2 bg-card2 border border-bdr2 text-txt text-sm font-semibold rounded-lg hover:border-brand transition-colors"
                    >
                      Change Avatar
                    </button>
                    <p className="text-xs text-muted mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted transition-colors">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-card2 border border-bdr2 rounded-lg px-4 py-2.5 text-txt focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted transition-colors">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="w-full bg-card2/50 border border-bdr2 rounded-lg px-4 py-2.5 text-muted cursor-not-allowed transition-colors"
                    />
                    <p className="text-[10px] text-muted">Email cannot be changed.</p>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-4">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-brand hover:bg-brand-lt text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                  </button>
                  {saved && <span className="text-sm text-green-500 font-semibold flex items-center gap-1 animate-fade-in-up"><Check size={16} /> Saved</span>}
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-txt mb-2 transition-colors">Theme Preferences</h2>
                <p className="text-sm text-muted mb-6 transition-colors">Choose how PrepMate looks to you. This setting is saved to your browser.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { if(theme !== 'light') toggleTheme(); }}
                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                      theme === 'light' ? 'border-brand bg-brand/5' : 'border-bdr hover:border-bdr2 bg-card2'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex flex-col gap-2">
                      <div className="w-full h-4 bg-[#FFFFFF] rounded border border-[#E2E8F0]"></div>
                      <div className="w-3/4 h-4 bg-[#FFFFFF] rounded border border-[#E2E8F0]"></div>
                    </div>
                    <span className="font-bold text-txt transition-colors">Light Mode</span>
                  </button>

                  <button 
                    onClick={() => { if(theme !== 'dark') toggleTheme(); }}
                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                      theme === 'dark' ? 'border-brand bg-brand/5' : 'border-bdr hover:border-bdr2 bg-card2'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg bg-[#0B0E14] border border-[#1F2937] p-2 flex flex-col gap-2">
                      <div className="w-full h-4 bg-[#181D2A] rounded border border-[#1F2937]"></div>
                      <div className="w-3/4 h-4 bg-[#181D2A] rounded border border-[#1F2937]"></div>
                    </div>
                    <span className="font-bold text-txt transition-colors">Dark Mode</span>
                  </button>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Billing & Plan</h2>
                
                <div className="bg-card2 border border-brand-lt/30 rounded-xl p-6 relative overflow-hidden transition-colors">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                      <span className="inline-block px-3 py-1 bg-brand text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                        Current Plan
                      </span>
                      <h3 className="text-2xl font-bold text-txt transition-colors">Pro Tier</h3>
                      <p className="text-muted text-sm mt-1 transition-colors">Unlimited mock interviews and advanced ATS grading.</p>
                    </div>
                    <span className="text-3xl font-black text-txt transition-colors">$15<span className="text-sm text-muted font-normal">/mo</span></span>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-brand/20 relative z-10 flex gap-3">
                    <button className="px-5 py-2 bg-card border border-bdr text-txt text-sm font-semibold rounded-lg hover:border-brand transition-colors">
                      Cancel Subscription
                    </button>
                    <button className="px-5 py-2 bg-brand hover:bg-brand-lt text-white text-sm font-semibold rounded-lg transition-colors">
                      Update Payment Method
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { title: "Interview Analysis Complete", desc: "Get an email when your AI mock interview report is ready." },
                    { title: "Weekly Practice Reminders", desc: "Receive gentle nudges to keep up with your prep streak." },
                    { title: "Community Updates", desc: "Notify me when someone replies to my forum posts." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-card2 border border-bdr rounded-xl transition-colors">
                      <div>
                        <h4 className="font-bold text-txt text-sm transition-colors">{item.title}</h4>
                        <p className="text-xs text-muted mt-1 transition-colors">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-bdr2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;