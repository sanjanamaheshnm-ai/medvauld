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
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">MedVault</span>
        </Link>
        
        {user && (
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}
