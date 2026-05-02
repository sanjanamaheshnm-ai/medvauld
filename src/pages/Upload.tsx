import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FileUp, CheckCircle2, X } from 'lucide-react';
import { AuthContext } from '../App';
import { mockDb } from '../lib/mockFirebase';

export default function Upload() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [type, setType] = useState('prescription');
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate file upload delay
    setTimeout(async () => {
      try {
        await mockDb.uploadRecord(user.id, {
          type,
          title: title || `${type} Record`,
          fileURL: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8df?auto=format&fit=crop&q=80&w=1000' // Placeholder for simulated "file"
        });
        setIsUploading(false);
        setIsSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        console.error(err);
        setIsUploading(false);
      }
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold">Successfully Uploaded!</h2>
        <p className="text-slate-500 mt-2">Your record has been saved to the vault.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upload Record</h1>
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-100 rounded-full">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Record Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('prescription')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              type === 'prescription' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Prescription</span>
          </button>
          <button
            type="button"
            onClick={() => setType('report')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              type === 'report' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            <FileUp className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Report</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Record Title (Optional)</label>
          <input 
            type="text"
            placeholder="e.g. Blood Test Result"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Dropzone Simulation */}
        <div className="relative group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            required
            accept="image/*,application/pdf"
          />
          <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center gap-4 bg-white group-hover:border-blue-300 transition-colors">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
              <FileUp className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="font-bold">Choose File or Photo</p>
              <p className="text-sm text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all ${
            isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>Secure Upload</>
          )}
        </button>
      </form>
    </div>
  );
}
