import { useState, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Loader2, Check } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const ProfileTab = () => {
  const { user, token, setUser } = useApp();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB.");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        setUser(result.data);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile Save Error:", error);
      alert("A network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const displayAvatar = avatarPreview || user?.avatarUrl;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Profile Information</h2>
      
      <div className="flex items-center gap-6 pb-6 border-b border-bdr transition-colors">
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
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-6 py-2.5 bg-brand hover:bg-brand-lt text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
        </button>
        {saved && <span className="text-sm text-green-500 font-semibold flex items-center gap-1 animate-fade-in-up"><Check size={16} /> Saved</span>}
      </div>
    </div>
  );
};

export default ProfileTab;