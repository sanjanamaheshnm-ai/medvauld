import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FileUp, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  User as UserIcon,
  ShieldCheck,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthContext } from '../App';
import { mockDb } from '../lib/mockFirebase';

export function TimelineList({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <FileText className="w-12 h-12 mb-4 stroke-1 opacity-50" />
        <p className="font-medium text-center italic">No medical records found in the vault.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {records.map((record) => (
          <div 
            key={record.id} 
            onClick={() => setSelectedRecord(record)}
            className="glass-card flex items-center gap-4 p-5 hover:shadow-lg hover:shadow-blue-500/5 group cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
              record.type === 'prescription' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
            }`}>
              {record.type === 'prescription' ? <FileText className="w-7 h-7" /> : <FileUp className="w-7 h-7" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold truncate text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{record.title}</h3>
                {record.type === 'report' && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] font-black rounded uppercase">Lab</span>}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(record.createdAt).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedRecord.type === 'prescription' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {selectedRecord.type === 'prescription' ? <FileText className="w-5 h-5" /> : <FileUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg leading-tight">{selectedRecord.title}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRecord.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Visual Preview */}
                <div className="w-full aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative border-2 border-slate-100 shadow-inner group">
                  <img 
                    src={selectedRecord.fileURL} 
                    alt="Medical Record"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <a 
                    href={selectedRecord.fileURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur text-blue-600 rounded-2xl shadow-xl hover:bg-blue-600 hover:text-white transition-all scale-90 group-hover:scale-100"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Issued</p>
                    <p className="font-bold text-slate-900">{new Date(selectedRecord.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security</p>
                    <div className="flex items-center gap-1.5 text-green-600">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-tighter">Vault Protected</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-blue-600" /> Professional Details
                  </h4>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Status</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">Verified Record</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Shared with Doctor</span>
                      <span className="font-bold text-slate-700">Yes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button className="flex-1 neo-button-primary flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> Download
                </button>
                <a 
                  href={selectedRecord.fileURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Timeline() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      const data = await mockDb.getRecordsByPatientId(user.id);
      setRecords(data);
    };
    fetch();
  }, [user.id]);

  const filteredRecords = filter === 'all' 
    ? records 
    : records.filter(r => r.type === filter);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">Medical Vault</h1>
        <p className="text-sm font-medium text-slate-500">Your secure digital history, end-to-end encrypted.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
        {[
          { label: 'All History', value: 'all' },
          { label: 'Prescriptions', value: 'prescription' },
          { label: 'Lab Reports', value: 'report' }
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === btn.value 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 ring-2 ring-blue-500 ring-offset-2' 
                : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-200 active:scale-95'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <TimelineList records={filteredRecords} />
    </div>
  );
}
