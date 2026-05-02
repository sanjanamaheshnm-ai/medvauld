/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { mockAuth } from './lib/mockFirebase';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Timeline from './pages/Timeline';
import PatientDetail from './pages/PatientDetail';
import Onboarding from './pages/Onboarding';

// Components
import Navbar from './components/Navbar';

export const AuthContext = createContext(null);

const ProtectedRoute = ({ children, role = null }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  if (!user.name && !window.location.pathname.includes('/onboarding')) return <Navigate to="/onboarding" />;
  return children;
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const current = mockAuth.getCurrentUser();
      setUser(current);
      setLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <Router>
        <div className="min-h-screen pb-20">
          <Navbar />
          <div className="max-w-md mx-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/patient/upload" element={
                <ProtectedRoute role="patient">
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/patient/timeline" element={
                <ProtectedRoute role="patient">
                  <Timeline />
                </ProtectedRoute>
              } />
              <Route path="/doctor/patient/:id" element={
                <ProtectedRoute role="doctor">
                  <PatientDetail />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

