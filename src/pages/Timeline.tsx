import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FileUp, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { AuthContext } from '../App';
import { mockDb } from '../lib/mockFirebase';

export function TimelineList({ records }) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <FileText className="w-12 h-12 mb-4 stroke-1 opacity-50" />
        <p className="font-medium text-center">No medical records found in the vault.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="glass-card flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            record.type === 'prescription' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {record.type === 'prescription' ? <FileText className="w-6 h-6" /> : <FileUp className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate text-slate-900">{record.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(record.createdAt).toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </div>
          </div>
          <a 
            href={record.fileURL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      ))}
    </div>
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Medical Timeline</h1>
        <p className="text-sm text-slate-500">Your secure history, sorted by date.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {[
          { label: 'All Records', value: 'all' },
          { label: 'Prescriptions', value: 'prescription' },
          { label: 'Reports', value: 'report' }
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === btn.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600'
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
