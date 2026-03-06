import React, { useState } from 'react';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  isConfigured: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn, onSignUp, isConfigured }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const fn = mode === 'in' ? onSignIn : onSignUp;
    const { error } = await fn(email, password);
    setLoading(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    if (mode === 'up') setMessage({ type: 'success', text: 'Account created. Check your email for the verification link or sign in.' });
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">Supabase not configured</h1>
          <p className="text-stone-600 text-sm">
            Add <code className="bg-stone-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-stone-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to .env.local for login and archive.
          </p>
          <p className="text-stone-500 text-xs mt-4">See: SUPABASE_KURULUM.md</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            Y
          </div>
          <span className="ml-2 text-2xl font-bold text-stone-800 self-center">Yazu.digital</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
          <h1 className="text-xl font-bold text-stone-800 mb-1">
            {mode === 'in' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-stone-500 text-sm mb-6">
            {mode === 'in' ? 'Access AI tools and chat archive.' : 'Sign up with email and password.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-stone-800"
                  placeholder="ornek@email.com"
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
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-stone-800"
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-70 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Please wait...' : mode === 'in' ? 'Sign in' : 'Sign up'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMessage(null); }}
            className="w-full mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {mode === 'in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
