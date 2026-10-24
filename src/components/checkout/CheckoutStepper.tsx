'use client';

import React from 'react';
import { Check } from 'lucide-react';

export type CheckoutStep = 'cart' | 'address' | 'delivery' | 'payment' | 'review';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  onStepClick
}) => {
  const steps: { key: CheckoutStep; label: string; number: number }[] = [
    { key: 'cart', label: 'Bag', number: 1 },
    { key: 'address', label: 'Address', number: 2 },
    { key: 'delivery', label: 'Shipping', number: 3 },
    { key: 'payment', label: 'Payment', number: 4 },
  ];

  const getCurrentIndex = () => {
    return steps.findIndex((s) => s.key === currentStep);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="w-full py-4 border-b border-zinc-800 bg-black">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? 'text-white'
                    : isDone
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-600'
                }`}
                onClick={() => onStepClick && isDone && onStepClick(step.key)}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-none flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                    isCurrent
                      ? 'bg-white text-black ring-2 ring-white/20'
                      : isDone
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-950 text-zinc-600 border border-zinc-800'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                </div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mx-2 sm:mx-4 transition-colors ${
                    idx < currentIndex ? 'bg-zinc-600' : 'bg-zinc-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
