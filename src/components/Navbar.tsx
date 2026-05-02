import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { AuthContext } from '../App';
import { mockAuth } from '../lib/mockFirebase';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    mockAuth.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-50">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tighter text-slate-900">MedVault</span>
        </Link>
        
        {user && (
          <button 
            onClick={handleLogout}
            className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-white shadow-sm"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}
