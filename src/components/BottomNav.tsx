import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Sparkles, User, Stethoscope } from 'lucide-react';
import { AuthContext } from '../App';

export default function BottomNav() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user || location.pathname === '/login' || location.pathname === '/onboarding' || location.pathname === '/ai-assistant') {
    return null;
  }

  const isPatient = user.role === 'patient';

  return (
    <div className="bottom-nav">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <LayoutDashboard className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
      </NavLink>

      {isPatient && (
        <NavLink 
          to="/patient/timeline" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Vault</span>
        </NavLink>
      )}

      <NavLink 
        to="/ai-assistant" 
        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      >
        <div className="relative">
          <Sparkles className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Healthu</span>
      </NavLink>

      <div className="nav-link">
        {user.role === 'patient' ? <User className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
        <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
      </div>
    </div>
  );
}
