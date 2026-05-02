/**
 * Mock Service to simulate Firebase Auth and Firestore using LocalStorage.
 * This allows the app to be fully functional without an external backend.
 */

const STORAGE_KEYS = {
  USERS: 'medvault_users',
  RECORDS: 'medvault_records',
  AUTH: 'medvault_current_user'
};

const getStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const mockAuth = {
  signup: async (email, password, role, metadata) => {
    const users = getStorage(STORAGE_KEYS.USERS);
    if (users.find(u => u.email === email)) throw new Error('User already exists');
    
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      password, // In a real app, never store passwords like this
      role,
      isSharing: role === 'patient' ? true : undefined,
      ...metadata
    };
    
    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email, password, role) => {
    const users = getStorage(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (!user) throw new Error('Invalid credentials or role');
    
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.AUTH);
    return user ? JSON.parse(user) : null;
  },

  updateProfile: (updates) => {
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH));
    const users = getStorage(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
      const updated = { ...users[index], ...updates };
      users[index] = updated;
      setStorage(STORAGE_KEYS.USERS, users);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(updated));
      return updated;
    }
    return currentUser;
  }
};

export const mockDb = {
  getPatientById: async (id) => {
    const users = getStorage(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id && u.role === 'patient');
  },

  getRecordsByPatientId: async (patientId) => {
    const records = getStorage(STORAGE_KEYS.RECORDS);
    return records
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  uploadRecord: async (patientId, recordData) => {
    const records = getStorage(STORAGE_KEYS.RECORDS);
    const newRecord = {
      id: Math.random().toString(36).substring(2, 9),
      patientId,
      createdAt: new Date().toISOString(),
      ...recordData // type, fileURL, title
    };
    records.push(newRecord);
    setStorage(STORAGE_KEYS.RECORDS, records);
    return newRecord;
  }
};
