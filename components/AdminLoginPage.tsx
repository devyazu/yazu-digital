import React, { useState } from 'react';
import { Lock, Mail, Loader2, Shield } from 'lucide-react';

interface AdminLoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  isConfigured: boolean;
}

export default function AdminLoginPage({ onSignIn, isConfigured }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await onSignIn(email, password);
    setLoading(false);
    if (err) setError(err.message);
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-md text-center">
          <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-800 mb-2">Supabase ayarlanmamış</h1>
          <p className="text-stone-600 text-sm">Admin girişi için önce Supabase bağlantısı gerekir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-stone-800 self-center">Admin Girişi</span>
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
          <p className="text-stone-500 text-sm mb-6">Sadece yetkili yönetici hesabı ile giriş yapabilirsiniz.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-stone-800 outline-none text-stone-800"
                  placeholder="admin@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-800 focus:border-stone-800 outline-none text-stone-800"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-70 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş yap'}
            </button>
          </form>
          <a
            href="/"
            className="block mt-6 text-center text-sm text-stone-500 hover:text-stone-700"
          >
            ← Ana uygulamaya dön
          </a>
        </div>
      </div>
    </div>
  );
}
