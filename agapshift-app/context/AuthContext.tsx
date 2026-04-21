import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'WORKER' | 'BUSINESS' | null;

interface BusinessData {
  type: 'SOLE_PROP' | 'PARTNERSHIP' | 'CORPORATION' | null;
  location: { latitude: number; longitude: number; address: string } | null;
  escrowBuffer: string;
  accountDetails: { name: string; number: string; method: string } | null;
}

interface WorkerData {
  skills: string[];
  bio: string;
  emergencyContact: { name: string; number: string } | null;
  walletBalance: number;
  isOnline: boolean;
  payoutMethod: { name: string; number: string; provider: string } | null;
}

interface Job {
  id: string;
  title: string;
  rate: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  businessName?: string;
  workerId?: string;
  workerName?: string;
  clockInTime?: number;
  clockOutTime?: number;
}

interface AuthState {
  role: Role;
  isAuthenticated: boolean;
  isKycVerified: boolean;
  isSimVerified: boolean;
  businessData: BusinessData;
  workerData: WorkerData;
  postedJobs: Job[];
}

interface AuthContextType extends AuthState {
  setRole: (role: Role) => void;
  login: () => void;
  logout: () => void;
  verifyKyc: () => void;
  verifySim: () => void;
  updateBusinessData: (data: Partial<BusinessData>) => void;
  updateWorkerData: (data: Partial<WorkerData>) => void;
  addJob: (job: Omit<Job, 'id' | 'status'>) => void;
  hireWorker: (jobId: string, workerId: string, workerName: string) => void;
  updateJobStatus: (jobId: string, status: Job['status'], timeKey?: 'clockInTime' | 'clockOutTime') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    role: null,
    isAuthenticated: false,
    isKycVerified: false,
    isSimVerified: false,
    businessData: {
      type: null,
      location: null,
      escrowBuffer: 'Per-Shift',
      accountDetails: null,
    },
    workerData: {
      skills: [],
      bio: '',
      emergencyContact: null,
      walletBalance: 0,
      isOnline: true,
      payoutMethod: null,
    },
    postedJobs: [
      { id: 'mock-1', title: 'Barista Help', rate: '500', status: 'PENDING', businessName: 'Starbucks' },
      { id: 'mock-2', title: 'Logistics Aid', rate: '750', status: 'PENDING', businessName: 'Grab Hub' }
    ],
  });

  const setRole = (role: Role) => setState((prev) => ({ ...prev, role }));
  const login = () => setState((prev) => ({ ...prev, isAuthenticated: true }));
  const logout = () => setState((prev) => ({ 
    ...prev,
    role: null, 
    isAuthenticated: false, 
    isKycVerified: false,
    isSimVerified: false
  }));
  const verifyKyc = () => setState((prev) => ({ ...prev, isKycVerified: true }));
  const verifySim = () => setState((prev) => ({ ...prev, isSimVerified: true }));
  
  const updateBusinessData = (data: Partial<BusinessData>) => 
    setState(prev => ({ ...prev, businessData: { ...prev.businessData, ...data } }));

  const updateWorkerData = (data: Partial<WorkerData>) => 
    setState(prev => ({ ...prev, workerData: { ...prev.workerData, ...data } }));

  const addJob = (job: Omit<Job, 'id' | 'status'>) => {
    const newJob: Job = { ...job, id: Math.random().toString(), status: 'PENDING' };
    setState(prev => ({ ...prev, postedJobs: [newJob, ...prev.postedJobs] }));
  };

  const hireWorker = (jobId: string, workerId: string, workerName: string) => {
    setState(prev => ({
      ...prev,
      postedJobs: prev.postedJobs.map(j => 
        j.id === jobId ? { ...j, status: 'ACTIVE', workerId, workerName } : j
      )
    }));
  };

  const updateJobStatus = (jobId: string, status: Job['status'], timeKey?: 'clockInTime' | 'clockOutTime') => {
    setState(prev => ({
      ...prev,
      postedJobs: prev.postedJobs.map(j => 
        j.id === jobId ? { ...j, status, [timeKey || '']: Date.now() } : j
      )
    }));
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      setRole, 
      login, 
      logout, 
      verifyKyc, 
      verifySim,
      updateBusinessData,
      updateWorkerData,
      addJob,
      hireWorker,
      updateJobStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
