'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
  category = 'T-Shirts'
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  // Athletic Mens Sizing Matrix
  const topSizeData = [
    { size: 'S', chestIn: '36 - 38', chestCm: '91 - 96', lengthIn: '27.5', lengthCm: '70', shoulderIn: '16.5', shoulderCm: '42' },
    { size: 'M', chestIn: '39 - 41', chestCm: '99 - 104', lengthIn: '28.5', lengthCm: '72', shoulderIn: '17.5', shoulderCm: '44.5' },
    { size: 'L', chestIn: '42 - 44', chestCm: '106 - 112', lengthIn: '29.5', lengthCm: '75', shoulderIn: '18.5', shoulderCm: '47' },
    { size: 'XL', chestIn: '45 - 47', chestCm: '114 - 120', lengthIn: '30.5', lengthCm: '77', shoulderIn: '19.5', shoulderCm: '49.5' },
    { size: 'XXL', chestIn: '48 - 51', chestCm: '122 - 129', lengthIn: '31.5', lengthCm: '80', shoulderIn: '20.5', shoulderCm: '52' },
  ];

  const bottomSizeData = [
    { size: 'S', waistIn: '28 - 30', waistCm: '71 - 76', hipIn: '37 - 39', hipCm: '94 - 99', lengthIn: '39', lengthCm: '99' },
    { size: 'M', waistIn: '31 - 33', waistCm: '78 - 84', hipIn: '40 - 42', hipCm: '101 - 106', lengthIn: '40', lengthCm: '101' },
    { size: 'L', waistIn: '34 - 36', waistCm: '86 - 91', hipIn: '43 - 45', hipCm: '109 - 114', lengthIn: '41', lengthCm: '104' },
    { size: 'XL', waistIn: '37 - 39', waistCm: '94 - 99', hipIn: '46 - 48', hipCm: '116 - 122', lengthIn: '41.5', lengthCm: '105' },
    { size: 'XXL', waistIn: '40 - 43', waistCm: '101 - 109', hipIn: '49 - 52', hipCm: '124 - 132', lengthIn: '42', lengthCm: '106' },
  ];

  const isBottom = ['joggers', 'shorts', 'track-pants', 'innerwear'].some(c => category.toLowerCase().includes(c));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SPORTS MENS WEAR ATHLETIC FIT GUIDE"
      subtitle="Precision measurements engineered for athletic physiques"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Unit Toggle */}
        <div className="flex items-center justify-between bg-zinc-900/80 p-3 border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Ruler className="w-4 h-4 text-white" />
            <span>Select Measurement Unit:</span>
          </div>
          <div className="flex bg-black p-0.5 border border-zinc-700">
            <button
              onClick={() => setUnit('inches')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                unit === 'inches' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                unit === 'cm' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900 uppercase tracking-widest text-zinc-300 border-b border-zinc-800 font-bold">
              <tr>
                <th className="p-3.5">Size</th>
                {isBottom ? (
                  <>
                    <th className="p-3.5">Waist ({unit})</th>
                    <th className="p-3.5">Hip ({unit})</th>
                    <th className="p-3.5">Outseam ({unit})</th>
                  </>
                ) : (
                  <>
                    <th className="p-3.5">Chest ({unit})</th>
                    <th className="p-3.5">Length ({unit})</th>
                    <th className="p-3.5">Shoulder ({unit})</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium text-zinc-300">
              {isBottom
                ? bottomSizeData.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-3.5 font-bold text-white bg-zinc-900/30">{row.size}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.waistIn : row.waistCm}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.hipIn : row.hipCm}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                    </tr>
                  ))
                : topSizeData.map((row) => (
                    <tr key={row.size} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-3.5 font-bold text-white bg-zinc-900/30">{row.size}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.chestIn : row.chestCm}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.lengthIn : row.lengthCm}</td>
                      <td className="p-3.5">{unit === 'inches' ? row.shoulderIn : row.shoulderCm}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Fit Advice */}
        <div className="bg-zinc-900/40 p-4 border-l-2 border-white text-xs text-zinc-400 space-y-1">
          <p className="font-bold text-white uppercase tracking-wider">Fit Tip for Athletes:</p>
          <p>• If you prefer a tailored muscle taper, pick your exact measurement size.</p>
          <p>• For oversized streetwear or heavy layering, we recommend ordering one size up.</p>
        </div>
      </div>
    </Modal>
  );
};
