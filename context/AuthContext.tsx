import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabaseMain, supabaseAdmin } from '../lib/supabase';

const ADMIN_DOMAIN = (import.meta.env.VITE_ADMIN_DOMAIN || 'admin.yazu.digital').toLowerCase();

function usePathname(): string {
  const [pathname, setPathname] = useState(
    () => (typeof window !== 'undefined' ? window.location.pathname : '')
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setPathname(window.location.pathname);
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
      origPush.apply(this, args);
      update();
    };
    history.replaceState = function (...args) {
      origReplace.apply(this, args);
      update();
    };
    window.addEventListener('popstate', update);
    return () => {
      history.pushState = origPush;
      history.replaceState = origReplace;
      window.removeEventListener('popstate', update);
    };
  }, []);
  return pathname;
}

function useSupabaseForAuth() {
  const pathname = usePathname();
  const isAdmin =
    typeof window !== 'undefined' &&
    (window.location.hostname === ADMIN_DOMAIN ||
      pathname === '/admin' ||
      pathname.startsWith('/admin/'));
  return isAdmin ? supabaseAdmin : supabaseMain;
}

function normalizeAuthError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error ?? 'Unknown auth error');
  if (/failed to fetch|networkerror|network request failed/i.test(message)) {
    return new Error('Baglanti hatasi: Supabase endpointine ulasilamadi. VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ve ag baglantisini kontrol edin.');
  }
  return error instanceof Error ? error : new Error(message);
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseForAuth();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const failSafeTimer = window.setTimeout(() => {
      if (active) setLoading(false);
    }, 10000);
    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!active) return;
        setSession(s);
        setUser(s?.user ?? null);
      })
      .catch(() => {
        if (!active) return;
        setSession(null);
        setUser(null);
      })
      .finally(() => {
        if (!active) return;
        window.clearTimeout(failSafeTimer);
        setLoading(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      window.clearTimeout(failSafeTimer);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ?? null };
    } catch (e) {
      return { error: normalizeAuthError(e) };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (data?.user) {
      try {
        const base = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
        await fetch(`${base}/api/send-confirm-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: data.user.id, email: data.user.email ?? email }),
        });
      } catch (_) {}
    }
    return { error: null };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isConfigured: Boolean(supabaseMain ?? supabaseAdmin),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
