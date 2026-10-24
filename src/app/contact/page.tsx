'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/common/Button';
import { PHYSICAL_STORES } from '@/data/stores';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Store,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'Sizing & Product Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you for contacting SPORTS MENS WEAR! Our customer desk will reach out within 4 business hours.', 'success');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        subject: 'Sizing & Product Inquiry',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-6 mb-10 text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <Store className="w-3.5 h-3.5 text-white" />
            <span>ATHLETE SUPPORT & RETAIL STORES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            GET IN TOUCH WITH SPORTS MENS WEAR
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Visit our physical experience centers in Tamil Nadu or reach our online customer desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Physical Store Locations */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <span>Physical Retail Locations</span>
            </h2>

            <div className="space-y-4">
              {PHYSICAL_STORES.length === 0 ? (
                <div className="p-8 bg-zinc-950 border border-zinc-800 text-center space-y-2">
                  <p className="text-sm font-bold uppercase text-white">Online Direct Fulfillment</p>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    We currently dispatch 100% of orders directly from our central fulfillment hub with express delivery across Tamil Nadu. Physical retail locations will be announced soon.
                  </p>
                </div>
              ) : (
                PHYSICAL_STORES.map((st) => (
                  <div key={st.id} className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold uppercase text-white">{st.name}</h3>
                          {st.isFlagship && (
                            <span className="px-2 py-0.5 bg-white text-black text-[9px] font-black uppercase">
                              Flagship
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{st.address}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300 pt-2 border-t border-zinc-900">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span>{st.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span>{st.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                        <span>{st.hours} ({st.days})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {st.features.map((feat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-5">
              <h2 className="text-lg font-black uppercase tracking-wider text-white border-b border-zinc-800 pb-3">
                Send An Inquiry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Karthik Raja"
                    className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
                  >
                    <option>Sizing & Product Fit Inquiry</option>
                    <option>Store Visit & Trial Appointment</option>
                    <option>Order Dispatch & Tracking</option>
                    <option>Bulk Gym / Team Orders</option>
                    <option>Other Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase font-bold mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our sportswear team assist your training rotation?"
                    className="w-full bg-black border border-zinc-700 p-3 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  SEND MESSAGE
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
