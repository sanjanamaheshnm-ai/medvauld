import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Stethoscope, ArrowRight, Mail, Lock, Shield } from 'lucide-react';
import { mockAuth } from '../lib/mockFirebase';
import { AuthContext } from '../App';

export default function Login() {
  const [role, setRole] = useState('patient');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let user;
      if (isLogin) {
        user = await mockAuth.login(email, password, role);
      } else {
        user = await mockAuth.signup(email, password, role);
      }
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-500/20 mb-2">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-display">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-slate-500 font-medium">Your medical world, secured.</p>
      </div>

      <div className="flex p-1.5 bg-slate-100 rounded-2xl ring-1 ring-slate-200">
        <button
          onClick={() => setRole('patient')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
            role === 'patient' ? 'bg-white text-blue-600 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-4 h-4" /> Patient
        </button>
        <button
          onClick={() => setRole('doctor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
            role === 'doctor' ? 'bg-white text-blue-600 shadow-lg shadow-slate-200' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-2xl border border-red-100 text-center"
          >
            {error}
          </motion.div>
        )}
        
        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4.5 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-4"
        >
          {isLogin ? 'Sign In to Vault' : 'Create Secure Vault'} <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-slate-500 text-sm font-medium hover:text-blue-600"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
