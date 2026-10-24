'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserAddress } from '@/types';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<UserAddress, 'id'> & { id?: string }) => void;
  initialAddress?: UserAddress | null;
}

const TN_DISTRICTS = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Salem',
  'Tiruchirappalli',
  'Tiruppur',
  'Erode',
  'Vellore',
  'Tirunelveli',
  'Thoothukudi',
  'Dindigul',
  'Thanjavur',
  'Ranipet',
  'Kanchipuram',
  'Chengalpattu',
  'Tiruvallur',
  'Krishnagiri',
  'Dharmapuri',
  'Namakkal',
  'Cuddalore',
  'Villupuram',
  'Nagapattinam',
  'Karur',
  'Theni',
  'Sivaganga',
  'Virudhunagar',
  'Ramanathapuram',
  'Nilgiris',
  'Kanyakumari'
];

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAddress
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    doorNo: '',
    street: '',
    area: '',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '',
    landmark: '',
    isDefault: false,
    type: 'home' as 'home' | 'work' | 'other'
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData({
        fullName: initialAddress.fullName,
        mobile: initialAddress.mobile,
        doorNo: initialAddress.doorNo,
        street: initialAddress.street,
        area: initialAddress.area,
        city: initialAddress.city,
        district: initialAddress.district || 'Chennai',
        state: initialAddress.state || 'Tamil Nadu',
        pincode: initialAddress.pincode,
        landmark: initialAddress.landmark || '',
        isDefault: Boolean(initialAddress.isDefault),
        type: initialAddress.type || 'home'
      });
    } else {
      setFormData({
        fullName: '',
        mobile: '',
        doorNo: '',
        street: '',
        area: '',
        city: 'Chennai',
        district: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '',
        landmark: '',
        isDefault: false,
        type: 'home'
      });
    }
  }, [initialAddress, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: initialAddress?.id
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialAddress ? 'EDIT SHIPPING ADDRESS' : 'ADD NEW TAMIL NADU ADDRESS'}
      subtitle="Orders delivered via Express surface logistics within 24-48 hours"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Karthik Raja"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Mobile Number (For Delivery SMS) *
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Door / Flat / Building No. *
            </label>
            <input
              type="text"
              required
              value={formData.doorNo}
              onChange={(e) => setFormData({ ...formData, doorNo: e.target.value })}
              placeholder="Flat 4B, Sky Residency"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Street / Road Name *
            </label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              placeholder="12th Cross Street"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Area / Locality *
            </label>
            <input
              type="text"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="Anna Nagar West / RS Puram"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="Near Tower Park / Opposite Gym"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              District *
            </label>
            <select
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value, city: e.target.value })}
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white focus:border-white focus:outline-none"
            >
              {TN_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className="bg-zinc-900 text-white">
                  {dist}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              State
            </label>
            <input
              type="text"
              disabled
              value="Tamil Nadu, India"
              className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="600040"
              className="w-full bg-black border border-zinc-700 px-3 py-2 text-white font-mono placeholder-zinc-500 focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Address Type & Default */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-zinc-400">Type:</span>
            {(['home', 'work', 'other'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`px-3 py-1 text-xs font-bold uppercase border transition-colors ${
                  formData.type === t
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="accent-white cursor-pointer"
            />
            <span>Set as Default Address</span>
          </label>
        </div>

        <div className="pt-3 border-t border-zinc-800 flex justify-end gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            SAVE ADDRESS
          </Button>
        </div>
      </form>
    </Modal>
  );
};
