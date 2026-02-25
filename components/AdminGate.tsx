import React, { useEffect, useState } from 'react';
import { Loader2, ShieldX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../services/adminAuth';
import AdminLoginPage from './AdminLoginPage';
import AdminView from './AdminView';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data';
import type { Category } from '../types';

interface AdminGateProps {
  mainAppUrl?: string;
}

export default function AdminGate({ mainAppUrl = 'https://app.yazu.digital' }: AdminGateProps) {
  const { user, loading: authLoading, signIn, signOut, isConfigured } = useAuth();
  const [adminCheck, setAdminCheck] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    if (!user?.email) {
      setAdminCheck(null);
      return;
    }
    let cancelled = false;
    isAdmin(user.email).then((ok) => {
      if (!cancelled) setAdminCheck(ok);
    });
    return () => { cancelled = true; };
  }, [user?.email]);

  useEffect(() => {
    if (user && adminCheck === true) {
      const link = document.getElementById('favicon') as HTMLLinkElement;
      if (link) link.href = '/admin-fav.svg';
      return () => {
        const l = document.getElementById('favicon') as HTMLLinkElement;
        if (l) l.href = '/yazu-fav.svg';
      };
    }
  }, [user, adminCheck]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-stone-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage onSignIn={signIn} isConfigured={isConfigured} />;
  }

  if (adminCheck === null) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-stone-600 animate-spin" />
      </div>
    );
  }

  if (!adminCheck) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 max-w-md text-center">
          <ShieldX className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-800 mb-2">Erişim reddedildi</h1>
          <p className="text-stone-600 text-sm mb-6">Bu hesap admin yetkisine sahip değil.</p>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm text-stone-500 hover:text-stone-700 underline"
          >
            Çıkış yap
          </button>
          <a href={mainAppUrl} className="block mt-4 text-sm text-brand-600 hover:text-brand-700 font-medium">
            Ana uygulamaya dön
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminView
      categories={categories}
      setCategories={setCategories}
      onExit={() => { window.location.href = mainAppUrl; }}
    />
  );
}
