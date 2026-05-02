import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Stethoscope, ArrowRight, Mail, Lock } from 'lucide-react';
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
    <div className="flex flex-col gap-8 pt-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-slate-500">Secure medical records on the go.</p>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setRole('patient')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            role === 'patient' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <User className="w-4 h-4" /> Patient
        </button>
        <button
          onClick={() => setRole('doctor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
            role === 'doctor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="w-5 h-5" />
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
