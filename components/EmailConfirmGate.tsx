import React, { useEffect, useState } from 'react';
import { Mail, Loader2, AlertTriangle } from 'lucide-react';
import { getProfile, isConfirmRequired, isWithinConfirmGrace, type Profile } from '../services/profileService';

const CONFIRM_HOURS = 3;

interface EmailConfirmGateProps {
  userId: string;
  onSignOut?: () => void | Promise<void>;
  children: React.ReactNode;
}

export default function EmailConfirmGate({ userId, onSignOut, children }: EmailConfirmGateProps) {
  // #region agent log
  fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'EmailConfirmGate.tsx:render',message:'EmailConfirmGate render',data:{userId},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const loadProfile = React.useCallback(() => {
    getProfile(userId).then(({ profile: p }) => {
      setProfile(p ?? null);
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getProfile(userId).then(({ profile: p }) => {
      if (!cancelled) {
        setProfile(p ?? null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [userId]);

  // Refetch when user returns from confirm link (?confirm=ok)
  useEffect(() => {
    const q = window.location.search;
    if (q.includes('confirm=')) {
      loadProfile();
      window.history.replaceState(null, '', window.location.pathname || '/');
    }
  }, [loadProfile]);

  const handleResend = async () => {
    setResendDone(false);
    setResendError(null);
    setResendLoading(true);
    try {
      const base = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
      const r = await fetch(`${base}/api/send-confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email: undefined }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = data?.detail || data?.error || `Hata ${r.status}`;
        setResendError(msg);
        return;
      }
      if (data.sent === false) {
        setResendError(data?.detail || data?.error || 'E-posta gönderilemedi.');
        return;
      }
      setResendDone(true);
    } catch (e) {
      setResendError(e?.message || 'Bağlantı hatası.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoToLogin = async () => {
    await onSignOut?.();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const required = isConfirmRequired(profile);
  const grace = isWithinConfirmGrace(profile) && profile && !profile.email_confirmed_at;

  if (required) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-md text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 mb-2">E-posta onayı gerekli</h1>
          <p className="text-stone-600 text-sm mb-4">
            Hesabınızı {CONFIRM_HOURS} saat içinde onaylamadığınız için kullanıma kapatıldı. E-postanıza gelen onay linkine tıklayarak hesabınızı tekrar açabilirsiniz.
          </p>
          <p className="text-stone-500 text-xs mb-4">
            Link gelmediyse spam klasörünü kontrol edin veya aşağıdaki butonla tekrar gönderin.
          </p>
          {resendDone && (
            <p className="text-green-600 text-sm font-medium mb-3">Onay linki e-postanıza tekrar gönderildi.</p>
          )}
          {resendError && (
            <p className="text-red-600 text-sm font-medium mb-3">E-posta gönderilemedi: {resendError}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {resendLoading ? 'Gönderiliyor...' : 'Onay linkini tekrar gönder'}
            </button>
            <button
              type="button"
              onClick={handleGoToLogin}
              className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700"
            >
              Giriş sayfasına dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {grace && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex flex-wrap items-center justify-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-amber-800 font-medium">
            E-postanızı {CONFIRM_HOURS} saat içinde onaylayın; aksi halde hesap kullanıma kapanacaktır. Onay linki e-postanıza gönderildi.
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-amber-800 underline font-medium hover:no-underline disabled:opacity-50"
          >
            {resendLoading ? 'Gönderiliyor...' : 'Linki tekrar gönder'}
          </button>
        </div>
      )}
      {children}
    </>
  );
}
