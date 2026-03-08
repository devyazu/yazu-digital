import React, { useState, useEffect } from 'react';
import { Mail, Lock, Loader2, Zap, Crown, ArrowRight, Check } from 'lucide-react';

type Step = 'landing' | 'plans' | 'signup';
type PlanTier = 'basic' | 'pro' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  tier: PlanTier;
  price_amount_cents: number;
  currency: string;
  sort_order: number;
}

interface StartLandingPageProps {
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  isConfigured: boolean;
}

const StartLandingPage: React.FC<StartLandingPageProps> = ({ onSignUp, onSignIn, isConfigured }) => {
  const [step, setStep] = useState<Step>('landing');
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    const base = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    fetch(`${base}/api/plans`)
      .then((r) => r.json())
      .then((data) => setPlans(Array.isArray(data?.plans) ? data.plans : []))
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, []);

  const handleCreateAccount = () => {
    setSelectedPlan(null);
    setStep('signup');
    setMessage(null);
  };

  const handleChoosePlan = () => {
    setStep('plans');
    setMessage(null);
  };

  const handleSelectPlan = (tier: PlanTier) => {
    if (typeof window !== 'undefined') window.sessionStorage.setItem('start_plan', tier);
    setSelectedPlan(tier);
    setStep('signup');
    setMessage(null);
  };

  const formatPrice = (cents: number, currency: string) => {
    const value = cents / 100;
    if (currency?.toLowerCase() === 'usd') return `$${value.toFixed(2)}`;
    if (currency?.toLowerCase() === 'eur') return `€${value.toFixed(2)}`;
    return `${value.toFixed(2)} ${(currency || 'USD').toUpperCase()}`;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const { error } = await onSignUp(email, password);
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setMessage({
      type: 'success',
      text: selectedPlan
        ? 'Account created. Redirecting to checkout…'
        : 'Account created. Check your email to confirm, or sign in if already confirmed.',
    });
    if (selectedPlan && typeof window !== 'undefined') {
      window.sessionStorage.setItem('start_plan', selectedPlan);
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-2">Supabase not configured</h1>
          <p className="text-stone-600 text-sm">Configure Supabase to use this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            Y
          </div>
          <span className="ml-2 text-2xl font-bold text-stone-800 self-center">Yazu.digital</span>
        </div>

        {step === 'landing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 text-center">
              <h1 className="text-2xl font-bold text-stone-800 mb-2">Get started</h1>
              <p className="text-stone-500 text-sm mb-6">
                Create an account or pick a plan and sign up to go straight to checkout.
              </p>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
                >
                  Create account
                </button>
                {plans.length > 0 && (
                  <button
                    type="button"
                    onClick={handleChoosePlan}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    Choose a plan <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {plans.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6">
                <h2 className="text-lg font-bold text-stone-800 mb-4 text-center">Plans</h2>
                {plansLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleSelectPlan(plan.tier)}
                        className="text-left rounded-2xl border-2 border-stone-200 p-5 hover:border-brand-400 hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
                          {plan.tier === 'premium' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                        </div>
                        <h3 className="font-bold text-stone-800">{plan.name}</h3>
                        <p className="text-sm text-stone-500 mt-1 capitalize">{plan.tier}</p>
                        <p className="mt-3 text-stone-600 font-semibold">
                          {formatPrice(plan.price_amount_cents, plan.currency)} / month
                        </p>
                        <span className="text-brand-600 font-bold text-sm mt-2 inline-block">Get this plan →</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-stone-400 mt-4 text-center">
                  Test mode: use card 4242 4242 4242 4242. No real charges.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'plans' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep('landing')}
              className="text-sm text-stone-500 hover:text-stone-700"
            >
              ← Back
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(plan.tier)}
                  className="text-left bg-white rounded-2xl border-2 border-stone-200 p-6 hover:border-brand-400 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${plan.tier === 'premium' ? 'bg-purple-100 text-purple-600' : 'bg-brand-100 text-brand-600'}`}>
                    {plan.tier === 'premium' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-stone-800">{plan.name}</h3>
                  <p className="text-sm text-stone-500 mt-1 capitalize">{plan.tier}</p>
                  <p className="mt-3 text-stone-600 font-semibold">
                    {formatPrice(plan.price_amount_cents, plan.currency)} / month
                  </p>
                  <span className={plan.tier === 'premium' ? 'text-purple-600 font-bold' : 'text-brand-600 font-bold'}>Get this plan →</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 text-center">
              Test mode: use card 4242 4242 4242 4242. No real charges.
            </p>
          </div>
        )}

        {step === 'signup' && (
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
            {selectedPlan && (
              <p className="text-sm text-stone-600 mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Plan: {plans.find((p) => p.tier === selectedPlan)?.name ?? selectedPlan} — you’ll go to checkout after sign up.
              </p>
            )}
            <h2 className="text-xl font-bold text-stone-800 mb-1">Create account</h2>
            <p className="text-stone-500 text-sm mb-6">
              {selectedPlan ? 'Sign up to continue to payment.' : 'Sign up with email and password.'}
            </p>
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-stone-800"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-stone-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {message && (
                <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                  {message.text}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-70 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <button
              type="button"
              onClick={() => { setStep(selectedPlan ? 'plans' : 'landing'); setMessage(null); }}
              className="w-full mt-4 text-sm text-stone-500 hover:text-stone-700"
            >
              ← Back
            </button>
            <p className="text-xs text-stone-400 mt-4">
              Test mode: use card 4242 4242 4242 4242 at checkout. No real charges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartLandingPage;
