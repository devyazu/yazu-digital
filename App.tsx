import React, { useState, useMemo } from 'react';
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
import AdminView from './components/AdminView';
import SupportView from './components/SupportView';
import SalesAgentView from './components/SalesAgentView';
import LoginPage from './components/LoginPage';
import ChatArchiveView from './components/ChatArchiveView';
import { CATEGORIES as INITIAL_CATEGORIES, MOCK_USER, MOCK_BRANDS } from './data';
import { Tool, Brand, Category, SalesAgentConfig } from './types';

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
  const [view, setView] = useState<'home' | 'tool' | 'category' | 'history' | 'brands-list' | 'brand-connect' | 'settings' | 'admin' | 'sales-agent' | 'support'>('home');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Brand State
  const [currentBrand, setCurrentBrand] = useState<Brand>(MOCK_BRANDS[0]);
  const [brands, setBrands] = useState<Brand[]>(MOCK_BRANDS);
  const [managingBrand, setManagingBrand] = useState<Brand | null>(null);

  // User State
  const [favorites, setFavorites] = useState<string[]>([]);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true); // Desktop
  
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetUpgradeTier, setTargetUpgradeTier] = useState<'pro' | 'premium'>('premium');

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
    const userTier = MOCK_USER.tier;
    const toolLevel = tool.accessLevel;
    let hasAccess = false;

    if (userTier === 'premium') hasAccess = true;
    else if (userTier === 'pro' && toolLevel !== 'premium') hasAccess = true;
    else if (userTier === 'basic' && toolLevel === 'basic') hasAccess = true;

    if (!hasAccess) {
      setTargetUpgradeTier(toolLevel === 'premium' ? 'premium' : 'pro');
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

  const handleAddNewBrand = () => {
    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name: 'New Brand',
      website: '',
      logoUrl: 'https://images.unsplash.com/photo-1620641788427-b11e64228af2?w=100&h=100&fit=crop',
      integrations: []
    };
    setBrands([...brands, newBrand]);
    setManagingBrand(newBrand);
    setView('brand-connect');
  };

  // Update Sales Agent Config
  const handleUpdateSalesAgent = (config: SalesAgentConfig) => {
    const updatedBrand = { ...currentBrand, salesAgentConfig: config };
    // Update local state for brands list and current brand
    setCurrentBrand(updatedBrand);
    setBrands(brands.map(b => b.id === updatedBrand.id ? updatedBrand : b));
  };

  const filteredCategories = useMemo(
    () => filterCategoriesBySearch(categories, searchQuery),
    [categories, searchQuery]
  );

  // If Admin View is active
  if (view === 'admin') {
    return (
      <AdminView 
        categories={categories}
        setCategories={setCategories}
        onExit={() => setView('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0] flex flex-col font-sans text-stone-800 relative selection:bg-brand-200 selection:text-brand-900">
      
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-orange-100/40 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      <Header 
        onToggleSidebar={handleToggleSidebar} 
        onToggleDesktopSidebar={handleToggleDesktopSidebar}
        user={MOCK_USER}
        brands={brands}
        currentBrand={currentBrand}
        onBrandSelect={handleBrandSelect}
        onNavigate={handleNavigate}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        authEmail={authUser.email}
        onLogout={onLogout}
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
          onSelectTool={handleSelectTool}
          onSelectCategory={handleSelectCategory}
          onNavigate={handleNavigate}
          activeView={view}
          isOpen={isSidebarOpen}
          isDesktopOpen={isDesktopSidebarOpen}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          user={MOCK_USER}
        />
        
        {view === 'home' && (
          <Dashboard 
            categories={filteredCategories} 
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            userTier={MOCK_USER.tier}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {view === 'category' && selectedCategory && (
          <CategoryView 
            category={selectedCategory}
            onSelectTool={handleSelectTool}
            userTier={MOCK_USER.tier}
          />
        )}

        {view === 'brands-list' && (
          <BrandsView 
            brands={brands} 
            user={MOCK_USER}
            onSelectBrand={handleBrandSelect}
            onManageBrand={handleManageBrand}
            onAddNew={handleAddNewBrand}
          />
        )}

        {view === 'brand-connect' && managingBrand && (
          <BrandConnectView 
            brand={managingBrand} 
            onBack={() => setView('brands-list')}
          />
        )}

        {view === 'sales-agent' && (
          <SalesAgentView 
            brand={currentBrand}
            onUpdateConfig={handleUpdateSalesAgent}
          />
        )}

        {view === 'support' && (
          <SupportView />
        )}

        {view === 'settings' && (
          <SettingsView user={MOCK_USER} />
        )}

        {view === 'tool' && selectedTool && (
          <>
            <ToolWorkspace 
              tool={selectedTool} 
              brand={currentBrand} 
              onBack={() => handleNavigate('home')}
            />
            <ExamplesPanel tool={selectedTool} />
          </>
        )}
        
        {view === 'history' && (
          <ChatArchiveView userId={authUser.id} />
        )}
      </div>

      {isUpgradeModalOpen && (
        <UpgradeModal 
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          targetTier={targetUpgradeTier}
          currentTier={MOCK_USER.tier}
        />
      )}
    </div>
  );
}

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;