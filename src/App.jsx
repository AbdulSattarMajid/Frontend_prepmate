import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import PaymentSuccessPage from './pages/dashboard/PaymentSuccessPage';
// Layout
import Navbar from './components/layout/Navbar';

// Marketing Pages
import LandingPage from './pages/marketing/LandingPage';
import PremiumPage from './pages/marketing/PremiumPage';
import FAQPage from './pages/FAQPage'; // 🌟 ADDED FAQ IMPORT

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPage from './pages/auth/ForgotPage';

// Dashboard Shell
import DashboardShell from './pages/dashboard/DashboardShell';

// Community Forum
import CommunityFeedPage from './pages/community/CommunityFeedPage';
import SinglePostPage from './pages/community/SinglePostPage';

const App = () => {  
  const { user } = useApp();

  return (    
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes (Wrapped with Navbar) */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/premium" element={<><Navbar /><PremiumPage /></>} />
        
        <Route path="/success" element={<PaymentSuccessPage />} />
        {/* 🌟 ADDED FAQ ROUTE */}
        <Route path="/faq" element={<><Navbar /><FAQPage /></>} />

        {/* Auth Routes (Redirects to dashboard if already logged in) */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
        <Route path="/forgot" element={user ? <Navigate to="/dashboard" /> : <ForgotPage />} />

        {/* Protected Dashboard Route */}
        {/* Community Forum */}
        <Route path="/community" element={<><Navbar /><CommunityFeedPage /></>} />
        <Route path="/community/post/:id" element={<SinglePostPage />} />
        
        {/* The /* tells the router that DashboardShell will handle its own sub-pages */}
        <Route 
          path="/dashboard/*" 
          element={user ? <DashboardShell /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;