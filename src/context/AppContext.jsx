import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const BASE_URL = import.meta.env.VITE_AUTH_BASE_URL ;

const snatchTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  
  if (urlToken) {
    console.log(" Intercepted Google Token on mount!");
    localStorage.setItem('prepMateToken', urlToken);
    window.history.replaceState({}, document.title, window.location.pathname);
    return urlToken;
  }
  return localStorage.getItem('prepMateToken') || null;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(snatchTokenFromUrl);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // 🌟 NEW: Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('prepmate_theme') || 'dark';
  });

  // 🌟 NEW: Apply theme to HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('prepmate_theme', theme);
  }, [theme]);

  // 🌟 NEW: Toggle Function
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoadingAuth(false);
        return;
      }
      
      try {
        console.log("⏳ Verifying token with backend...");
        const res = await fetch(`${BASE_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          console.log("✅ Profile loaded successfully!");
          setUser(data.data || data.user || data); 
        } else {
          console.error("❌ Backend rejected the token:", data.message);
          setToken(null);
          localStorage.removeItem('prepMateToken');
        }
      } catch (err) {
        console.error("❌ Network error fetching profile:", err);
      } finally {
        setLoadingAuth(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('prepMateToken', jwtToken);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch(e) { 
      console.error("Logout error", e); 
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('prepMateToken');
  }, [token]);

  return (
    // 🌟 Added theme and toggleTheme to the export
    <AppContext.Provider value={{ user, token, login, logout, setUser, theme, toggleTheme }}>
      {!loadingAuth ? children : (
        <div className="min-h-screen bg-deep flex items-center justify-center text-brand-lt font-sora font-bold text-xl animate-pulse transition-colors duration-300">
          Loading PrepMate...
        </div>
      )}
    </AppContext.Provider>
  );
};