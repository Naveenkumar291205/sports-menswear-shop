'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, authService } from '@/services/authService';
import { UserAddress } from '@/types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (mobileOrEmail: string) => Promise<void>;
  sendOtp: (mobile: string) => Promise<{ success: boolean; testOtp: string; message: string }>;
  verifyOtp: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveAddress: (address: Omit<UserAddress, 'id'> & { id?: string }) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(authService.getDefaultUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const login = async (mobileOrEmail: string) => {
    const updated = await authService.login(mobileOrEmail);
    setUser(updated);
    showToast(`Welcome back, ${updated.name}!`, 'success');
  };

  const sendOtp = async (mobile: string) => {
    return authService.sendOtp(mobile);
  };

  const verifyOtp = async (mobile: string, otp: string): Promise<boolean> => {
    const res = await authService.verifyOtp(mobile, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast('Logged in successfully!', 'success');
      return true;
    }
    showToast(res.message, 'error');
    return false;
  };

  const logout = async () => {
    await authService.logout();
    setUser(authService.getDefaultUser());
    showToast('Logged out of SPORTS MENS WEAR', 'info');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await authService.updateUser(updates);
    setUser(updated);
    showToast('Profile updated successfully', 'success');
  };

  const saveAddress = async (address: Omit<UserAddress, 'id'> & { id?: string }) => {
    const addresses = await authService.saveAddress(address);
    setUser((prev) => ({ ...prev, addresses }));
    showToast('Address saved successfully', 'success');
  };

  const deleteAddress = async (id: string) => {
    const addresses = await authService.deleteAddress(id);
    setUser((prev) => ({ ...prev, addresses }));
    showToast('Address removed', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
        saveAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
