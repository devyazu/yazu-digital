import React, { useState, useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolWorkspace from './components/ToolWorkspace';
import ExamplesPanel from './components/ExamplesPanel';
import Dashboard from './components/Dashboard';
import BrandsView from './components/BrandsView';
import BrandConnectView from './components/BrandConnectView';
import SettingsView from './components/SettingsView';
import CategoryView from './components/CategoryView';
import UpgradeModal from './components/UpgradeModal';
import AdminGate from './components/AdminGate';
import EmailConfirmGate from './components/EmailConfirmGate';
import SalesAgentView from './components/SalesAgentView';
import LoginPage from './components/LoginPage';
import ChatArchiveView from './components/ChatArchiveView';
import NotificationsPanel from './components/NotificationsPanel';
import { CATEGORIES as INITIAL_CATEGORIES } from './data';
import { Tool, Brand, Category, SalesAgentConfig, UserProfile, userTierCanAccessTool, TIER_DEFAULTS } from './types';
import { getBrands, createBrand, uploadBrandLogo } from './services/brandService';
import { getProfile, type Profile } from './services/profileService';
import { getUnreadNotificationCount } from './services/notificationsService';

function filterCategoriesBySearch(categories: Category[], query: string): Category[] {
  const q = query.trim().toLowerCase();
  if (!q) return categories;
  return categories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.name.toLowerCase().includes(q) || cat.tools.length > 0);
}

function AppContent() {
  const { user: authUser, loading: authLoading, signIn, signUp, signOut, isConfigured } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F0] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }
  if (!authUser) {
    return (
      <LoginPage
        onSignIn={signIn}
        onSignUp={signUp}
        isConfigured={isConfigured}
      />
    );
  }
  return <MainApp authUser={authUser} onLogout={signOut} />;
}

function MainApp({ authUser, onLogout }: { authUser: { id: string; email?: string }; onLogout: () => void }) {
  // Global Data State
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Search (araç ve kategori filtreleme)
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation State
  const [view, setView] = useState<'home' | 'tool' | 'category' | 'history' | 'brands-list' | 'brand-connect' | 'settings' | 'sales-agent' | 'support'>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Brand State (veritabanından yüklenir)
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [managingBrand, setManagingBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (!authUser) return;
    setBrandsLoading(true);
    getBrands(authUser.id).then(({ data, error }) => {
      setBrandsLoading(false);
      if (error) return;
      setBrands(data);
      setCurrentBrand(data[0] ?? null);
    });
  }, [authUser?.id]);

  // Profile (avatar sync: Header + Settings, persists on refresh)
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!authUser) return;
    getProfile(authUser.id).then(({ profile: p }) => setProfile(p ?? null));
  }, [authUser?.id]);

  const userProfile: UserProfile | null = useMemo(() => {
    if (!authUser) return null;
    const p = profile;
    const tier = (p?.tier as UserProfile['tier']) ?? 'free';
    const def = TIER_DEFAULTS[tier];
    return {
      id: authUser.id,
      name: (p?.full_name || [p?.first_name, p?.last_name].filter(Boolean).join(' ')).trim() || authUser.email || 'User',
      email: authUser.email ?? '',
      role: 'user',
      tier,
      credits: { total: p?.credits_total ?? def.creditsTotal, used: p?.credits_used ?? 0 },
      maxBrands: p?.max_brands ?? def.maxBrands,
      avatarUrl: p?.avatar_url ?? undefined,
      joinedDate: p?.created_at ? p.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
    };
  }, [authUser, profile]);

  const DEFAULT_USER_PROFILE: UserProfile = useMemo(() => ({
    id: authUser?.id ?? '',
    name: 'User',
    email: authUser?.email ?? '',
    role: 'user',
    tier: 'free',
    credits: { total: TIER_DEFAULTS.free.creditsTotal, used: 0 },
    maxBrands: 1,
    joinedDate: new Date().toISOString().slice(0, 10),
  }), [authUser?.id, authUser?.email]);

  // User State
  const [favorites, setFavorites] = useState<string[]>([]);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // Desktop
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetUpgradeTier, setTargetUpgradeTier] = useState<'pro' | 'premium'>('premium');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const fetchUnreadNotificationCount = () => {
    getUnreadNotificationCount().then(({ count, error }) => {
      if (!error) setUnreadNotificationCount(count);
    });
  };

  useEffect(() => {
    if (!authUser) return;
    fetchUnreadNotificationCount();
  }, [authUser?.id]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSelectTool = (tool: Tool) => {
    const userTier = userProfile?.tier ?? 'free';
    const hasAccess = userTierCanAccessTool(userTier, tool.accessLevel);
    if (!hasAccess) {
      setTargetUpgradeTier(tool.accessLevel === 'premium' ? 'premium' : 'pro');
      setIsUpgradeModalOpen(true);
      return;
    }

    setSelectedTool(tool);
    setView('tool');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('category');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleNavigate = (newView: typeof view) => {
    if (newView !== 'tool') {
      setSelectedTool(null);
    }
    setView(newView);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleBrandSelect = (brand: Brand) => {
    setCurrentBrand(brand);
  };

  const handleManageBrand = (brand: Brand) => {
    setManagingBrand(brand);
    setView('brand-connect');
  };

  const handleUpdateBrandLogo = async (brand: Brand, file: File) => {
    if (!authUser) return;
    const { url, error } = await uploadBrandLogo(brand.id, authUser.id, file);
    if (error || !url) return;
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, logoUrl: url } : b))
    );
    if (currentBrand?.id === brand.id) {
      setCurrentBrand((prev) => (prev ? { ...prev, logoUrl: url } : null));
    }
  };

  const handleAddNewBrand = async () => {
    if (!authUser) return;
    const { data: newBrand, error } = await createBrand(authUser.id, { name: 'New Brand', website: '' });
    if (error || !newBrand) return;
    setBrands((prev) => [...prev, newBrand]);
    setCurrentBrand(newBrand);
    setManagingBrand(newBrand);
    setView('brand-connect');
  };

  // Update Sales Agent Config
  const handleUpdateSalesAgent = (config: SalesAgentConfig) => {
    if (!currentBrand) return;
    const updatedBrand = { ...currentBrand, salesAgentConfig: config };
    setCurrentBrand(updatedBrand);
    setBrands((prev) => prev.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)));
  };

  const filteredCategories = useMemo(
    () => filterCategoriesBySearch(categories, searchQuery),
    [categories, searchQuery]
  );

  return (
    <EmailConfirmGate userId={authUser.id} onSignOut={onLogout}>
    <div className="min-h-screen bg-[#F2F2F0] flex flex-col font-sans text-stone-800 relative selection:bg-brand-200 selection:text-brand-900">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-orange-100/40 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      <Header 
        onToggleSidebar={handleToggleSidebar} 
        onToggleDesktopSidebar={handleToggleDesktopSidebar}
        user={userProfile ?? DEFAULT_USER_PROFILE}
        profileAvatarUrl={profile?.avatar_url ?? undefined}
        brands={brands}
        currentBrand={currentBrand}
        brandsLoading={brandsLoading}
        onBrandSelect={handleBrandSelect}
        onNavigate={handleNavigate}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        authEmail={authUser.email}
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadNotificationCount={unreadNotificationCount}
      />
      
      <div className="flex flex-1 relative overflow-hidden z-10">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Sidebar 
          categories={categories} 
          selectedTool={selectedTool} 
          selectedCategory={selectedCategory}
          onSelectTool={handleSelectTool}
          onSelectCategory={handleSelectCategory}
          onNavigate={handleNavigate}
          activeView={view}
          isOpen={isSidebarOpen}
          isDesktopOpen={isDesktopSidebarOpen}
          onToggleDesktopSidebar={handleToggleDesktopSidebar}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          user={userProfile ?? DEFAULT_USER_PROFILE}
          onLogout={onLogout}
        />
        
        {view === 'home' && (
          <Dashboard 
            categories={filteredCategories} 
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            userTier={(userProfile ?? DEFAULT_USER_PROFILE).tier}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {view === 'category' && selectedCategory && (
          <CategoryView 
            category={selectedCategory}
            onSelectTool={handleSelectTool}
            userTier={(userProfile ?? DEFAULT_USER_PROFILE).tier}
          />
        )}

        {view === 'brands-list' && (
          <BrandsView 
            brands={brands} 
            user={userProfile ?? DEFAULT_USER_PROFILE}
            onSelectBrand={handleBrandSelect}
            onManageBrand={handleManageBrand}
            onAddNew={handleAddNewBrand}
            onUpdateBrandLogo={handleUpdateBrandLogo}
          />
        )}

        {view === 'brand-connect' && managingBrand && (
          <BrandConnectView 
            brand={managingBrand} 
            onBack={() => setView('brands-list')}
          />
        )}

        {view === 'sales-agent' && currentBrand && (
          <SalesAgentView 
            brand={currentBrand}
            onUpdateConfig={handleUpdateSalesAgent}
          />
        )}
        {view === 'sales-agent' && !currentBrand && (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-center text-stone-500">
              <p className="font-medium mb-2">Select a brand first</p>
              <button onClick={() => handleNavigate('brands-list')} className="text-brand-600 hover:underline">My Brands</button>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <SettingsView 
            authUser={authUser} 
            user={userProfile ?? DEFAULT_USER_PROFILE} 
            profile={profile}
            onProfileUpdate={setProfile}
          />
        )}

        {view === 'tool' && selectedTool && currentBrand && (
          <>
            <ToolWorkspace 
              tool={selectedTool} 
              brand={currentBrand} 
              onBack={() => handleNavigate('home')}
            />
            <ExamplesPanel tool={selectedTool} />
          </>
        )}
        {view === 'tool' && selectedTool && !currentBrand && (
          <div className="flex-1 flex items-center justify-center p-10">
            <div className="text-center text-stone-500">
              <p className="font-medium mb-2">Select a brand to use tools</p>
              <button onClick={() => handleNavigate('brands-list')} className="text-brand-600 hover:underline">My Brands</button>
            </div>
          </div>
        )}
        
        {view === 'history' && (
          <ChatArchiveView userId={authUser.id} />
        )}
      </div>

      {notificationsOpen && (
        <NotificationsPanel
          onClose={() => {
            setNotificationsOpen(false);
            fetchUnreadNotificationCount();
          }}
          onMarkAllRead={fetchUnreadNotificationCount}
        />
      )}

      {isUpgradeModalOpen && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          targetTier={targetUpgradeTier}
          currentTier={(userProfile ?? DEFAULT_USER_PROFILE).tier}
        />
      )}
    </div>
    </EmailConfirmGate>
  );
}

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return pathname;
}

const MAIN_APP_URL = import.meta.env.VITE_APP_URL || 'https://app.yazu.digital';
const ADMIN_DOMAIN = import.meta.env.VITE_ADMIN_DOMAIN || 'admin.yazu.digital';

function useIsAdminApp() {
  const pathname = usePathname();
  const isAdminByPath = pathname === '/admin';
  const isAdminByHost = typeof window !== 'undefined' && window.location.hostname === ADMIN_DOMAIN;
  return isAdminByHost || isAdminByPath;
}

const App: React.FC = () => {
  const isAdminApp = useIsAdminApp();
  const isAdminDomain = typeof window !== 'undefined' && window.location.hostname === ADMIN_DOMAIN;
  const mainAppUrl = isAdminDomain ? MAIN_APP_URL : '/';
  if (isAdminApp) {
    return (
      <AuthProvider>
        <AdminGate mainAppUrl={mainAppUrl} />
      </AuthProvider>
    );
  }
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;