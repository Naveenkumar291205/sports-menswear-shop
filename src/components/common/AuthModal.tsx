'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Phone, Mail, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, sendOtp, verifyOtp } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    const res = await sendOtp(identifier);
    setIsLoading(false);

    if (res.success) {
      setDemoNotice(`Test OTP generated: ${res.testOtp}`);
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    const success = await verifyOtp(identifier, otp);
    setIsLoading(false);

    if (success) {
      setStep('input');
      setIdentifier('');
      setOtp('');
      setDemoNotice(null);
    }
  };

  const resetState = () => {
    setIsAuthModalOpen(false);
    setStep('input');
    setOtp('');
    setDemoNotice(null);
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={resetState}
      title={step === 'otp' ? 'VERIFY OTP' : tab === 'login' ? 'CUSTOMER ACCESS' : 'CREATE ACCOUNT'}
      subtitle={
        step === 'otp'
          ? `Enter the 4-digit code sent to ${identifier}`
          : 'Unlock priority Tamil Nadu delivery, express checkout, & order tracking'
      }
      maxWidth="md"
    >
      <div className="space-y-6">
        {step === 'input' ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  tab === 'login'
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                  tab === 'register'
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
              {tab === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Karthik Raja"
                    className="w-full bg-black border border-zinc-700 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="+91 98765 43210 or name@example.com"
                    className="w-full bg-black border border-zinc-700 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  We will send a one-time verification code (OTP)
                </p>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                GET OTP CODE
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {demoNotice && (
              <div className="bg-zinc-900 border border-zinc-700 p-3 flex items-center gap-2.5 text-xs text-white">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{demoNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                4-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 5699"
                className="w-full bg-black border border-zinc-700 px-4 py-3.5 text-center text-xl font-mono tracking-widest text-white focus:border-white focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              VERIFY & LOGIN
            </Button>

            <div className="flex justify-between items-center text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="hover:text-white underline transition-colors"
              >
                Change mobile/email
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="hover:text-white transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 text-center text-[10px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900">
          SECURE 256-BIT ENCRYPTION • TAMIL NADU RETAIL & ONLINE
        </div>
      </div>
    </Modal>
  );
};
