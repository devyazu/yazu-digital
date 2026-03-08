import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Brand } from '../types';
import { Menu, Search, Zap, ChevronDown, Briefcase, Plus, Settings, Bell } from '../lib/safeIcons';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleDesktopSidebar: () => void;
  user: UserProfile;
  profileAvatarUrl?: string | null;
  brands: Brand[];
  currentBrand: Brand | null;
  brandsLoading?: boolean;
  onBrandSelect: (brand: Brand) => void;
  onNavigate: (view: 'brands-list' | 'brand-connect' | 'settings') => void;
  isDesktopSidebarOpen: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  authEmail?: string;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar, 
  onToggleDesktopSidebar,
  user, 
  brands, 
  currentBrand, 
  profileAvatarUrl,
  brandsLoading = false,
  onBrandSelect, 
  onNavigate,
  isDesktopSidebarOpen,
  searchQuery = '',
  onSearchChange,
  authEmail,
  onOpenNotifications,
  unreadNotificationCount = 0,
}) => {
  const creditPercent = (user.credits.used / user.credits.total) * 100;
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const brandMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandMenuRef.current && !brandMenuRef.current.contains(event.target as Node)) {
        setIsBrandMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/40 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      {/* Left: Logo (toggle moved to sidebar footer) */}
      <div className="flex items-center gap-4">
        {/* Mobile: menu toggle */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-stone-500 hover:bg-white/50 rounded-md lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()} title="Yazu">
          <img src="/yazu.svg" alt="Yazu" className="h-8 w-auto" />
        </div>
      </div>

      {/* Center: Search (Hidden on Mobile) */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-hover:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tools (e.g. Viral, TikTok, SEO)..." 
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-100/50 hover:bg-white focus:bg-white border border-transparent focus:border-brand-200 rounded-full text-sm text-stone-700 outline-none transition-all shadow-inner focus:shadow-md"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Credit System */}
        <div className="hidden xl:flex flex-col items-end mr-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-1">
            <Zap className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span>{user.credits.total - user.credits.used} Credits</span>
          </div>
          <div className="w-24 h-1.5 bg-stone-200/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full shadow-[0_0_10px_rgba(230,96,0,0.5)]"
              style={{ width: `${100 - creditPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Brand Selector Dropdown */}
        <div className="relative" ref={brandMenuRef}>
          <button 
            onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/50 hover:bg-white border border-stone-200/50 hover:border-brand-300 rounded-lg transition-all text-sm font-medium text-stone-700 shadow-sm backdrop-blur-sm"
          >
            {brandsLoading ? (
              <span className="text-stone-400 text-xs">Loading...</span>
            ) : currentBrand ? (
              <>
                {currentBrand.logoUrl ? (
                  <img src={currentBrand.logoUrl} alt="Logo" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <Briefcase className="w-4 h-4 text-brand-600" />
                )}
                <span className="max-w-[100px] truncate">{currentBrand.name}</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span className="max-w-[100px] truncate">Select brand</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {isBrandMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-black/5">
              <div className="px-4 py-2 border-b border-stone-100/50">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Switch Brand</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      onBrandSelect(brand);
                      setIsBrandMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-stone-50/50 flex items-center justify-between group ${currentBrand?.id === brand.id ? 'bg-brand-50/50 text-brand-700 font-medium' : 'text-stone-600'}`}
                  >
                    <div className="flex items-center gap-3">
                        <img 
                            src={brand.logoUrl || "/your-logo.png"} 
                            alt={brand.name} 
                            className="w-6 h-6 rounded-full object-cover border border-stone-200 group-hover:border-brand-300" 
                        />
                        <span>{brand.name}</span>
                    </div>
                    {currentBrand?.id === brand.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(230,96,0,0.6)]"></div>}
                  </button>
                ))}
              </div>
              <div className="border-t border-stone-100/50 mt-1 pt-1">
                <button 
                   onClick={() => {
                     onNavigate('brands-list');
                     setIsBrandMenuOpen(false);
                   }}
                   className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50/50 hover:text-brand-600 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Manage All Brands
                </button>
                <button 
                   onClick={() => {
                     onNavigate('brands-list');
                     setIsBrandMenuOpen(false);
                   }}
                   className="w-full text-left px-4 py-3 text-sm text-brand-600 hover:bg-brand-50/50 font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Brand
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-stone-200/50 mx-1 hidden sm:block"></div>

        {/* Notifications (left of avatar) — badge shows unread count */}
        {onOpenNotifications && (
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title={unreadNotificationCount > 0 ? `${unreadNotificationCount} unread notification(s)` : 'Notifications'}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] flex items-center justify-center rounded-full bg-brand-500 text-white text-[10px] font-bold px-1">
                {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
              </span>
            )}
          </button>
        )}
        
        {/* User Profile Avatar (same as Account Settings; from profile DB) */}
        <button 
          onClick={() => onNavigate('settings')}
          className="relative group p-0.5 rounded-full border-2 border-transparent hover:border-brand-200 transition-all"
        >
          <img 
            key={profileAvatarUrl ?? 'default'}
            src={profileAvatarUrl ?? user.avatarUrl ?? DEFAULT_AVATAR} 
            alt="User" 
            className="w-9 h-9 rounded-full object-cover shadow-sm group-hover:shadow-md transition-shadow"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
        </button>
      </div>
    </header>
  );
};

export default Header;