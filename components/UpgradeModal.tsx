import React from 'react';
import { UserTier } from '../types';
import { X, Check, Zap, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTier: 'pro' | 'premium';
  currentTier: UserTier;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, targetTier, currentTier }) => {
  if (!isOpen) return null;

  // Prorated Logic Simulation
  const daysInMonth = 30;
  const daysLeft = 14;
  
  const currentPrice = currentTier === 'free' ? 0 : currentTier === 'basic' ? 4.99 : currentTier === 'pro' ? 19.99 : 29.99;
  const newPrice = targetTier === 'premium' ? 29.99 : 19.99;
  
  // Calculate unused value of current plan
  const dailyRateCurrent = currentPrice / daysInMonth;
  const unusedValue = dailyRateCurrent * daysLeft;
  
  // Calculate cost of new plan for remainder of month
  const dailyRateNew = newPrice / daysInMonth;
  const newPlanCostForRemainder = dailyRateNew * daysLeft;
  
  // Amount to pay now = New Cost Remainder - Unused Value
  const payNow = Math.max(0, newPlanCostForRemainder - unusedValue).toFixed(2);

  const features = targetTier === 'premium' 
    ? ['Unlimited AI Generations', 'All 100+ Tools Unlocked', 'Priority Support', 'Unlimited Brand Workspaces']
    : ['50+ Pro Tools', '5 Brand Workspaces', 'Faster Processing', 'Sales Intelligence Tools'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Graphic */}
        <div className={`h-32 ${targetTier === 'premium' ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-brand-500 to-orange-600'} relative overflow-hidden flex items-center justify-center`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="relative z-10 text-center text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                    {targetTier === 'premium' ? <Crown className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <h2 className="text-xl font-bold">Unlock {targetTier === 'premium' ? 'Premium' : 'Pro'} Power</h2>
            </div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6">
            {/* Prorated Offer Box */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Upgrade Summary</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Pro-rated Savings applied</span>
                </div>
                
                <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-bold text-stone-900">${payNow}</span>
                    <span className="text-sm text-stone-500 mb-1">due today</span>
                </div>
                
                <p className="text-xs text-stone-400 leading-tight">
                    We deducted the unused days ({daysLeft} days) of your current plan. <br/>
                    Starting next month, you'll pay just <strong>${newPrice}/mo</strong>.
                </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
                {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full ${targetTier === 'premium' ? 'bg-purple-100 text-purple-600' : 'bg-brand-100 text-brand-600'}`}>
                            <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-stone-700">{feat}</span>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <button className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 ${targetTier === 'premium' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-brand-600 hover:bg-brand-700'}`}>
                Upgrade Instantly <ArrowRight className="w-4 h-4" />
            </button>
            
            <p className="text-center text-[10px] text-stone-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Secure payment processed by Stripe
            </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
