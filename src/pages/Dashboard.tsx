import { useState, useContext, useEffect } from 'react';
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
  ScanLine,
  Bell,
  CheckCircle,
  Stethoscope,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthContext } from '../App';
import { mockAuth, mockDb } from '../lib/mockFirebase';
import Scanner from '../components/Scanner';

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [patientIdSearch, setPatientIdSearch] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');

  useEffect(() => {
    if (user?.role === 'patient') {
      const data = mockDb.getReminders(user.id);
      setReminders(data);
    }
  }, [user]);

  const handleToggleSharing = () => {
    const updated = mockAuth.updateProfile({ isSharing: !user.isSharing });
    setUser(updated);
  };

  const handlePatientSearch = (id) => {
    const cleanId = typeof id === 'string' ? id.trim() : patientIdSearch.trim();
    if (cleanId) {
      navigate(`/doctor/patient/${cleanId}`);
    }
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (newReminder.trim()) {
      const added = mockDb.addReminder(user.id, { text: newReminder });
      setReminders([...reminders, added]);
      setNewReminder('');
    }
  };

  const handleToggleReminder = (id) => {
    mockDb.toggleReminder(id);
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  if (user?.role === 'patient') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-end px-1">
          <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Good Morning</p>
            <h1 className="text-3xl font-bold">{user.name.split(' ')[0]} 👋</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 relative">
            <Bell className="w-6 h-6" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </header>

        {/* Profile Card */}
        <div className="glass-card p-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {user.address}
              </p>
              <div className="flex gap-4 mt-4">
                <div className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold ring-1 ring-red-100">
                  <Droplets className="w-3.5 h-3.5 fill-red-600" /> {user.bloodGroup}
                </div>
                <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-xs font-bold">
                  {user.age} Yrs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/patient/upload')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-600 text-white rounded-[2.2rem] shadow-xl shadow-blue-500/20 active:scale-95 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
            <Plus className="w-10 h-10" />
            <span className="font-bold tracking-tight">Upload Record</span>
          </button>
          <button 
            onClick={() => navigate('/patient/timeline')}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-slate-200 text-slate-700 rounded-[2.2rem] shadow-sm active:scale-95 transition-all"
          >
            <History className="w-10 h-10 text-blue-600" />
            <span className="font-bold tracking-tight">Medical History</span>
          </button>
        </div>

        {/* Reminders Widget */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" /> Reminders
            </h3>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{reminders.filter(r => !r.completed).length} Pending</span>
          </div>
          
          <div className="space-y-3">
            {reminders.map((rem) => (
              <div 
                key={rem.id} 
                onClick={() => handleToggleReminder(rem.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  rem.completed ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  rem.completed ? 'bg-green-500 border-green-500' : 'border-slate-300'
                }`}>
                  {rem.completed && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`text-sm font-medium ${rem.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {rem.text}
                </span>
              </div>
            ))}
            
            <form onSubmit={handleAddReminder} className="flex gap-2">
              <input 
                type="text"
                placeholder="Add medication/appt reminder..."
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
              <button className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-90">
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* AI Assistant Hook */}
        <button 
          onClick={() => navigate('/ai-assistant')}
          className="w-full glass-card p-5 flex items-center justify-between bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl shadow-blue-500/20 active:scale-[0.98] group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <p className="font-bold leading-none">Talk to Healthu</p>
              <p className="text-[10px] text-white/70 mt-1.5 uppercase font-bold tracking-widest font-mono">Expert AI Analysis</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>

        {/* QR Section */}
        <div className="glass-card overflow-hidden">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="font-bold">Vault Access QR</span>
            </div>
            <div className={`w-2 h-2 rounded-full transition-colors ${showQR ? 'bg-red-500' : 'bg-blue-500'}`} />
          </button>
          
          <AnimatePresence>
            {showQR && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-10 flex flex-col items-center"
              >
                <div className="p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] mt-2 shadow-inner">
                  <QRCodeSVG 
                    value={user.id} 
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unique Vault ID</p>
                  <p className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">{user.id}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sharing Toggle */}
        <div className="glass-card p-6 flex items-center justify-between bg-white border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${user.isSharing ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold leading-tight">Privacy Control</p>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">{user.isSharing ? 'Public Access On' : 'Private Access Only'}</p>
            </div>
          </div>
          <button 
            onClick={handleToggleSharing}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${user.isSharing ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 transform ${user.isSharing ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // Doctor Dashboard
  return (
    <div className="space-y-8 pt-4 animate-in fade-in duration-500">
      <header className="px-1">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-1">Clinic Portal</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Welcome, Doc 👋</h1>
      </header>

      <div className="space-y-6">
        {showScanner ? (
          <div className="animate-in zoom-in-95 duration-500">
            <Scanner 
              onScan={handlePatientSearch} 
              onClose={() => setShowScanner(false)} 
            />
          </div>
        ) : (
          <button 
            onClick={() => setShowScanner(true)}
            className="w-full p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col items-center gap-6 shadow-2xl shadow-blue-900/20 active:scale-[0.98] transition-all relative overflow-hidden group border-4 border-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/30">
              <ScanLine className="w-12 h-12" />
            </div>
            <div className="text-center space-y-2 relative z-10">
              <h2 className="text-3xl font-extrabold font-display">Tap to Scan</h2>
              <p className="text-slate-400 text-sm font-medium">Point at patient's MedVault QR</p>
            </div>
          </button>
        )}

        <div className="relative flex items-center gap-4 py-2 opacity-50">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Manual Search</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Manual Search */}
        <div className="glass-card p-6 bg-white/50 border-slate-100">
          <form onSubmit={(e) => { e.preventDefault(); handlePatientSearch(patientIdSearch); }} className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text"
                placeholder="Patient ID (ex: ab12cd3)"
                value={patientIdSearch}
                onChange={(e) => setPatientIdSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-5 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono font-bold"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 hover:text-slate-700 transition-all"
            >
              Search Database <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Stats/Summary Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 border-none bg-blue-50">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Today</p>
          <p className="text-2xl font-bold text-blue-900">12</p>
          <p className="text-xs font-semibold text-blue-600/50">Patients seen</p>
        </div>
        <div className="glass-card p-5 border-none bg-indigo-50">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-sm font-bold text-indigo-900">On Duty</p>
          </div>
          <p className="text-xs font-semibold text-indigo-600/50">City Hospital</p>
        </div>
      </div>
    </div>
  );
}
