import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, 
  History, 
  Share2, 
  QrCode, 
  User, 
  MapPin, 
  Droplets,
  Search,
  ScanLine
} from 'lucide-react';
import { AuthContext } from '../App';
import { mockAuth } from '../lib/mockFirebase';

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patientIdSearch, setPatientIdSearch] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleToggleSharing = () => {
    const updated = mockAuth.updateProfile({ isSharing: !user.isSharing });
    setUser(updated);
  };

  const handlePatientSearch = (e) => {
    e.preventDefault();
    if (patientIdSearch.trim()) {
      navigate(`/doctor/patient/${patientIdSearch.trim()}`);
    }
  };

  if (user?.role === 'patient') {
    return (
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-6 flex items-start gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {user.address}
            </p>
            <div className="flex gap-4 mt-3">
              <div className="text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-md flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {user.bloodGroup}
              </div>
              <div className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                Age: {user.age}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/patient/upload')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus className="w-8 h-8" />
            <span className="font-semibold">Upload</span>
          </button>
          <button 
            onClick={() => navigate('/patient/timeline')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm active:scale-95 transition-all"
          >
            <History className="w-8 h-8 text-blue-600" />
            <span className="font-semibold">Timeline</span>
          </button>
        </div>

        {/* QR Section */}
        <div className="glass-card overflow-hidden">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-slate-400" />
              <span className="font-semibold">Show Access QR</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </button>
          
          {showQR && (
            <div className="px-5 pb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl mt-4">
                <QRCodeSVG 
                  value={user.id} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-xs font-mono text-slate-400">ID: {user.id}</p>
            </div>
          )}
        </div>

        {/* Sharing Toggle */}
        <div className="glass-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold leading-tight">Emergency Sharing</p>
              <p className="text-xs text-slate-500">Allow doctors to view data</p>
            </div>
          </div>
          <button 
            onClick={handleToggleSharing}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${user.isSharing ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all duration-200 ${user.isSharing ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // Doctor Dashboard
  return (
    <div className="space-y-8 pt-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <p className="text-slate-500">Access patient records securely.</p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handlePatientSearch} className="space-y-4">
          <label className="text-sm font-medium text-slate-700">Enter Patient ID</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="e.g. ab12cd34"
              value={patientIdSearch}
              onChange={(e) => setPatientIdSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            <ScanLine className="w-5 h-5" /> View Records
          </button>
        </form>
      </div>

      <div className="p-4 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center gap-3 text-slate-400">
        <QrCode className="w-12 h-12 stroke-1" />
        <p className="text-sm font-medium">Scan Patient QR for instant access</p>
      </div>
    </div>
  );
}
