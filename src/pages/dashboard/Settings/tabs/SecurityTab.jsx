import { useState } from 'react';
import { useApp } from '../../../../context/AppContext';
import { Loader2, Check } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

const SecurityTab = () => {
  const { token, logout } = useApp();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('idle');
  const [deleteStatus, setDeleteStatus] = useState('idle');

  const handleUpdatePassword = async () => {
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    setPasswordStatus('loading');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const result = await res.json();

      if (result.success) {
        setPasswordStatus('success');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordStatus('idle'), 4000);
      } else {
        alert(result.message || "Failed to update password.");
        setPasswordStatus('idle');
      }
    } catch (error) {
      console.error("Update Password Error:", error);
      alert("A network error occurred.");
      setPasswordStatus('idle');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? All of your mock interviews, resumes, and data will be permanently lost."
    );
    
    if (!confirmed) return;

    setDeleteStatus('loading');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();

      if (res.ok) {
        logout(); 
      } else {
        alert(result.message || "Failed to delete account.");
        setDeleteStatus('idle');
      }
    } catch (error) {
      console.error("Delete Account Error:", error);
      alert("A network error occurred.");
      setDeleteStatus('idle');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-6 transition-colors">Security & Privacy</h2>
      
      <div className="space-y-6">
        <div className="p-5 md:p-6 bg-card2 border border-bdr rounded-xl transition-colors">
          <h4 className="font-bold text-txt mb-4 transition-colors">Change Password</h4>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold text-muted transition-colors flex justify-between">
                Current Password
                <span className="text-[10px] font-normal text-ghost">Optional for Google sign-ins</span>
              </label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Leave blank if setting for the first time"
                className="w-full bg-card border border-bdr2 rounded-lg px-4 py-2.5 text-txt focus:outline-none focus:border-brand transition-colors mt-1 placeholder:text-muted/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted transition-colors">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-card border border-bdr2 rounded-lg px-4 py-2.5 text-txt focus:outline-none focus:border-brand transition-colors mt-1 text-sm"
              />
            </div>
            
            <div className="pt-2 flex items-center gap-4">
              <button 
                onClick={handleUpdatePassword}
                disabled={passwordStatus === 'loading' || !newPassword}
                className="px-6 py-2.5 bg-brand hover:bg-brand-lt text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {passwordStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
              </button>
              
              {passwordStatus === 'success' && (
                <p className="text-green-500 text-sm font-semibold animate-fade-in-up flex items-center gap-1">
                  <Check size={16} /> Saved
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 bg-red-500/5 border border-red-500/20 rounded-xl transition-colors">
          <h4 className="font-bold text-red-500 mb-2 transition-colors">Danger Zone</h4>
          <p className="text-sm text-red-500/70 mb-5 transition-colors max-w-2xl">
            Permanently delete your account and all associated data. This action is completely irreversible and your mock interview history cannot be recovered.
          </p>
          
          <button 
            onClick={handleDeleteAccount}
            disabled={deleteStatus === 'loading'}
            className="px-6 py-2.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {deleteStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;