import React, { useState } from 'react';
import { Brand } from '../types';
import { 
  CheckCircle, XCircle, RefreshCw, Plus, 
  ShoppingBag, BarChart2, Facebook, Search, Mail, 
  Link, AlertCircle, ArrowLeft, Layers, Globe, MessageSquare, Video, Filter
} from 'lucide-react';

interface BrandConnectViewProps {
  brand: Brand;
  onBack: () => void;
  onSaveBrand: (brandId: string, payload: { name: string; website: string }) => Promise<{ ok: boolean; error?: string }>;
}

// Mock Categories of Tools
const CATEGORIES = [
    { id: 'all', name: 'All Apps' },
    { id: 'ads', name: 'Advertising' },
    { id: 'store', name: 'E-commerce' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'social', name: 'Social Media' },
    { id: 'email', name: 'Email & SMS' },
    { id: 'crm', name: 'CRM' },
];

// Extensive Mock Integration List
const ALL_INTEGRATIONS = [
    { id: 'meta', name: 'Meta Ads', category: 'ads', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png', desc: 'Sync campaigns & ROAS data.' },
    { id: 'google_ads', name: 'Google Ads', category: 'ads', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Ads_logo.svg/2560px-Google_Ads_logo.svg.png', desc: 'Search & Display performance.' },
    { id: 'tiktok', name: 'TikTok Ads', category: 'ads', icon: 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhtyvueh7nulog/tiktok-icon-2.png', desc: 'Video views & conversions.' },
    { id: 'shopify', name: 'Shopify', category: 'store', icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/shopify_logo_icon_169838.png', desc: 'Products, orders, and customer data.' },
    { id: 'woo', name: 'WooCommerce', category: 'store', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/WooCommerce_logo.svg/1200px-WooCommerce_logo.svg.png', desc: 'Sync store sales data.' },
    { id: 'ga4', name: 'Google Analytics 4', category: 'analytics', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Google_Analytics_Logo.svg/1200px-Google_Analytics_Logo.svg.png', desc: 'Traffic & behavior analysis.' },
    { id: 'triple', name: 'Triple Whale', category: 'analytics', icon: 'https://pbs.twimg.com/profile_images/1542967677840334850/D1x3d7e__400x400.jpg', desc: 'E-com attribution dashboard.' },
    { id: 'klaviyo', name: 'Klaviyo', category: 'email', icon: 'https://cdn.worldvectorlogo.com/logos/klaviyo.svg', desc: 'Email flows & segmentation.' },
    { id: 'mailchimp', name: 'Mailchimp', category: 'email', icon: 'https://eep.io/images/yzco4xsimv0y/1u3hha7FE0Q402e2qs0WeU/a2747e90632789a2202fcd9630325d5d/icon-mailchimp-black.svg', desc: 'Campaign performance.' },
    { id: 'hubspot', name: 'HubSpot', category: 'crm', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/HubSpot_Logo.svg/1200px-HubSpot_Logo.svg.png', desc: 'Customer relationship management.' },
    { id: 'salesforce', name: 'Salesforce', category: 'crm', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png', desc: 'Enterprise sales data.' },
    { id: 'instagram', name: 'Instagram', category: 'social', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png', desc: 'Organic engagement stats.' },
    { id: 'linkedin', name: 'LinkedIn', category: 'social', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png', desc: 'B2B engagement metrics.' },
    { id: 'slack', name: 'Slack', category: 'crm', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png', desc: 'Team alerts and notifications.' },
    { id: 'pinterest', name: 'Pinterest Ads', category: 'ads', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png', desc: 'Visual discovery ads.' },
];

const BrandConnectView: React.FC<BrandConnectViewProps> = ({ brand, onBack, onSaveBrand }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState(brand.name);
  const [website, setWebsite] = useState(brand.website);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  React.useEffect(() => {
    setName(brand.name);
    setWebsite(brand.website);
    setStatus(null);
  }, [brand.id, brand.name, brand.website]);

  // Determine connected status based on mock brand data (simplified matching)
  const isConnected = (id: string) => brand.integrations.some((i) => i.id === id && i.isConnected);

  const filteredApps = ALL_INTEGRATIONS.filter(app => {
      const matchesCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const handleSave = async () => {
    setStatus(null);
    setSaving(true);
    const result = await onSaveBrand(brand.id, { name, website });
    setSaving(false);
    if (!result.ok) {
      setStatus(result.error || 'Marka guncellenemedi.');
      return;
    }
    setStatus('Marka bilgileri kaydedildi.');
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto bg-[#FAFAF9] p-6 lg:p-10 scroll-smooth">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Brands
        </button>
        
        <div className="flex items-center gap-6 mb-8">
           <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
             <img src={brand.logoUrl || "/your-logo.png"} alt="Logo" className="w-full h-full object-cover" />
           </div>
           <div>
              <h1 className="text-3xl font-bold text-stone-800 mb-1">{brand.name} Operating System</h1>
              <p className="text-stone-500">Connect your marketing stack to enable <span className="font-semibold text-brand-600">Smart AI Agents</span>.</p>
           </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-stone-600">
              <span className="block mb-1 font-medium">Brand name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400"
                placeholder="Brand name"
              />
            </label>
            <label className="text-sm text-stone-600">
              <span className="block mb-1 font-medium">Website</span>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-400"
                placeholder="example.com"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save brand'}
            </button>
            {status && <p className="text-sm text-stone-600">{status}</p>}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-0 bg-[#FAFAF9]/95 backdrop-blur-sm z-20 py-4 border-b border-stone-200/50">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-stone-800 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Find an app..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-stone-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all shadow-sm"
                />
            </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApps.map(app => {
                const connected = isConnected(app.id);
                return (
                    <div key={app.id} className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-lg hover:border-brand-200 transition-all group flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-stone-50 p-2 border border-stone-100">
                                <img src={app.icon} alt={app.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            {connected ? (
                                <div className="bg-green-50 text-green-600 p-1 rounded-full">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            ) : (
                                <div className="bg-stone-50 text-stone-300 p-1 rounded-full group-hover:text-stone-400 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-stone-800 text-lg mb-1">{app.name}</h3>
                        <p className="text-xs text-stone-500 leading-relaxed mb-6 flex-1">{app.desc}</p>
                        
                        <button
                            type="button"
                            disabled
                            className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                                connected
                                ? 'bg-white border border-stone-200 text-stone-500'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                            title="Gercek entegrasyon baglantisi sonraki fazda acilacak"
                        >
                            {connected ? 'Connected' : 'Coming soon'}
                        </button>
                    </div>
                );
            })}
        </div>

        {/* Manual Data Entry Callout */}
        <div className="mt-12 bg-gradient-to-r from-brand-50 to-white border border-brand-100 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="bg-white p-4 rounded-full shadow-md">
             <AlertCircle className="w-8 h-8 text-brand-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-stone-900 mb-2">Can't find your tool?</h4>
            <p className="text-stone-600 mb-4 max-w-2xl">
              Don't worry. You can manually upload your CSV reports (Sales, Customer Lists, Ad Spend) to get the same level of AI insights.
            </p>
            <button className="px-6 py-3 bg-white border border-stone-200 text-stone-800 font-bold rounded-xl hover:bg-stone-50 hover:border-brand-300 transition-all shadow-sm">
              Upload CSV Data Manually
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrandConnectView;
