import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  MapPin, 
  User, 
  Droplets, 
  ArrowLeft,
  Lock,
  Stethoscope
} from 'lucide-react';
import { mockDb } from '../lib/mockFirebase';
import { TimelineList } from './Timeline';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foundPatient = await mockDb.getPatientById(id);
        if (!foundPatient) {
          setError('Patient not found');
        } else {
          setPatient(foundPatient);
          if (foundPatient.isSharing) {
            const history = await mockDb.getRecordsByPatientId(id);
            setRecords(history);
          }
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 pt-10 text-center">
        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{error}</h2>
          <p className="text-slate-500 mt-2 px-6">We couldn't find a MedVault associated with this ID.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mx-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  if (!patient.isSharing) {
    return (
      <div className="flex flex-col gap-6 pt-10 text-center">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto rotate-3">
          <Lock className="w-12 h-12" />
        </div>
        <div className="space-y-2 px-4">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-slate-600 font-medium font-display uppercase tracking-widest text-xs">Patient Privacy Lock</p>
          <p className="text-slate-500 mt-4">
            The patient <strong>{patient.name}</strong> has disabled data sharing. Please ask them to enable sharing in their dashboard to view records.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mx-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-2xl font-bold">Patient Records</h1>
      </div>

      {/* Patient Profile Summary */}
      <div className="p-6 bg-slate-900 text-white rounded-[2rem] space-y-4 shadow-xl shadow-blue-100">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-blue-400">{patient.name}</h2>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {patient.address}
            </p>
          </div>
          <div className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
            Verified
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Blood Group</p>
            <div className="flex items-center gap-1 text-red-400">
              <Droplets className="w-3 h-3" /> <span className="font-bold">{patient.bloodGroup}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gender</p>
            <p className="font-bold">{patient.gender}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Age</p>
            <p className="font-bold">{patient.age} Yrs</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 px-1 pt-2">
        <Stethoscope className="w-5 h-5" />
        <h2 className="font-display font-bold text-slate-900">Medical History</h2>
      </div>

      <TimelineList records={records} />
    </div>
  );
}
