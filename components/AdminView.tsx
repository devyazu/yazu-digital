import React, { useState, useEffect } from 'react';
import { Category, Tool, UserProfile, AdminStats } from '../types';
import { 
  LayoutDashboard, Users, Wrench, FolderOpen, 
  Search, Plus, Edit, Trash2, CheckCircle, XCircle, 
  BarChart3, DollarSign, Zap, Play, Settings, TrendingUp,
  Activity, ArrowUpRight, Globe, Loader2
} from 'lucide-react';
import { MOCK_USERS_LIST } from '../data';
import { useAuth } from '../context/AuthContext';

export interface AdminUserRow {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

interface AdminViewProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onExit: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ categories, setCategories, onExit }) => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tools' | 'categories' | 'analytics'>('tools');
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS_LIST);
  const [realUsers, setRealUsers] = useState<AdminUserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersSearch, setUsersSearch] = useState('');
  
  // Tool Editor State
  const [isEditingTool, setIsEditingTool] = useState(false);
  const [editingTool, setEditingTool] = useState<Partial<Tool>>({});
  
  useEffect(() => {
    if (activeTab !== 'users' || !session?.access_token) return;
    setUsersLoading(true);
    setUsersError(null);
    fetch('/api/list-users', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          const msg = data?.error || `Hata ${r.status}`;
          if (r.status === 401) throw new Error('Oturum geçersiz. Çıkış yapıp tekrar giriş yapın.');
          if (r.status === 403) throw new Error('Admin yetkisi gerekli.');
          if (r.status === 503) throw new Error('Sunucu ayarları eksik. Vercel\'de SUPABASE_ANON_KEY ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı.');
          throw new Error(msg);
        }
        return data;
      })
      .then((data) => {
        setRealUsers(data.users || []);
      })
      .catch((err) => {
        setRealUsers([]);
        setUsersError(err?.message || 'Kullanıcılar yüklenemedi.');
      })
      .finally(() => setUsersLoading(false));
  }, [activeTab, session?.access_token]);

  // Mock Stats (tools/categories için mock users kullanılıyor; analytics sayısı realUsers ile güncellenebilir)
  const stats: AdminStats = {
    totalUsers: realUsers.length || users.length,
    activeSubs: users.filter(u => u.tier !== 'basic').length,
    totalRevenue: 12540,
    totalGenerations: 45200,
    mrr: 4500,
    churnRate: 2.4,
    avgLTV: 450,
    tokenUsage: 12500000
  };

  const flattenTools = () => {
    const allTools: (Tool & { categoryName: string })[] = [];
    categories.forEach(cat => {
      cat.tools.forEach(tool => {
        allTools.push({ ...tool, categoryName: cat.name });
      });
    });
    return allTools;
  };

  const handleSaveTool = () => {
    if (!editingTool.name || !editingTool.categoryId) return;

    setCategories(prev => {
      const newCategories = [...prev];
      const categoryIndex = newCategories.findIndex(c => c.id === editingTool.categoryId);
      
      if (categoryIndex === -1) return prev;

      // Create full tool object
      const toolData = {
        id: editingTool.id || `tool-${Date.now()}`,
        name: editingTool.name || 'New Tool',
        description: editingTool.description || '',
        instruction: editingTool.instruction || '',
        systemPrompt: editingTool.systemPrompt || '',
        examples: editingTool.examples || [],
        iconName: editingTool.iconName || 'Zap',
        accessLevel: editingTool.accessLevel || 'pro',
        costPerUse: editingTool.costPerUse || 10,
        type: editingTool.type || 'sales',
        categoryId: editingTool.categoryId,
        usageCount: editingTool.usageCount || 0
      } as Tool;

      const category = { ...newCategories[categoryIndex] };
      
      if (editingTool.id) {
        // Edit existing
        const toolIndex = category.tools.findIndex(t => t.id === editingTool.id);
        if (toolIndex > -1) {
          category.tools[toolIndex] = toolData;
        } else {
            // Moved category? Simple push to new category (simplified logic)
            category.tools.push(toolData);
        }
      } else {
        // Add new
        category.tools.push(toolData);
      }

      newCategories[categoryIndex] = category;
      return newCategories;
    });

    setIsEditingTool(false);
    setEditingTool({});
  };

  const handleDeleteTool = (toolId: string, catId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === catId) {
        return { ...cat, tools: cat.tools.filter(t => t.id !== toolId) };
      }
      return cat;
    }));
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  // --- ANALYTICS VIEW ---
  const renderDeepAnalytics = () => (
    <div className="space-y-8 animate-in fade-in">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">MRR (Monthly)</p>
                        <h3 className="text-2xl font-bold text-stone-800">${stats.mrr.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <ArrowUpRight className="w-3 h-3" /> +14.5% vs last month
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Churn Rate</p>
                        <h3 className="text-2xl font-bold text-stone-800">{stats.churnRate}%</h3>
                    </div>
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Activity className="w-5 h-5" /></div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-red-500">
                    <ArrowUpRight className="w-3 h-3" /> +0.2% (Needs Attention)
                </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Token Usage (Cost)</p>
                        <h3 className="text-2xl font-bold text-stone-800">{(stats.tokenUsage / 1000000).toFixed(1)}M</h3>
                    </div>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Zap className="w-5 h-5" /></div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-stone-500">
                    Est. Cost: ${((stats.tokenUsage / 1000000) * 0.15).toFixed(2)}
                </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Avg. LTV</p>
                        <h3 className="text-2xl font-bold text-stone-800">${stats.avgLTV}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <ArrowUpRight className="w-3 h-3" /> +5% this quarter
                </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
        </div>

        {/* Charts & Graphs Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Growth Chart (Mock Visual) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-600" /> Revenue Growth (Last 6 Months)
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-l border-stone-100">
                    {[35, 42, 45, 58, 62, 75].map((h, i) => (
                        <div key={i} className="w-full relative group">
                            <div 
                                className="bg-brand-500 rounded-t-sm hover:bg-brand-600 transition-all mx-auto w-3/4" 
                                style={{ height: `${h}%` }}
                            ></div>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                ${h}k
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-stone-400 font-medium px-4">
                    <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                </div>
            </div>

            {/* User Demographics / Plan Split */}
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-6">Plan Distribution</h3>
                <div className="flex items-center justify-center mb-8 relative">
                    {/* Donut Chart Mock */}
                    <div className="w-40 h-40 rounded-full border-[16px] border-stone-100 relative">
                        <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 32 32">
                             <circle r="16" cx="16" cy="16" fill="transparent" stroke="#FF7B1A" strokeWidth="32" strokeDasharray="60 40" /> {/* 60% */}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-stone-800">2.4k</span>
                            <span className="text-xs text-stone-400">Total</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-stone-300"></div>
                            <span>Basic</span>
                        </div>
                        <span className="font-bold">40%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-500"></div>
                            <span>Pro</span>
                        </div>
                        <span className="font-bold">45%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                            <span>Premium</span>
                        </div>
                        <span className="font-bold">15%</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Global Activity Map (Mock) */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
             <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-stone-400" /> Live Activity Feed
             </h3>
             <div className="space-y-0">
                {[1,2,3,4,5].map((i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0 hover:bg-stone-50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-stone-600">User from <span className="font-bold text-stone-800">Berlin, Germany</span> generated a <span className="text-brand-600">TikTok Ad Script</span></span>
                        </div>
                        <span className="text-xs text-stone-400">{i * 2} mins ago</span>
                    </div>
                ))}
             </div>
        </div>
    </div>
  );

  // --- USERS MANAGEMENT VIEW (Supabase gerçek kullanıcılar) ---
  const filteredRealUsers = usersSearch.trim()
    ? realUsers.filter((u) => u.email.toLowerCase().includes(usersSearch.trim().toLowerCase()))
    : realUsers;

  const renderUsers = () => (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in">
      <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
        <h3 className="font-bold text-stone-800">Kullanıcı Yönetimi</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="E-posta ile ara..."
            value={usersSearch}
            onChange={(e) => setUsersSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>
      {usersLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : usersError ? (
        <div className="p-8 text-center">
          <p className="text-red-600 font-medium mb-2">{usersError}</p>
          <p className="text-sm text-stone-500">Vercel ortam değişkenlerinde SUPABASE_ANON_KEY ve SUPABASE_SERVICE_ROLE_KEY tanımlı olduğundan emin olun.</p>
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-500 font-medium">
            <tr>
              <th className="px-6 py-3">E-posta</th>
              <th className="px-6 py-3">Kayıt tarihi</th>
              <th className="px-6 py-3">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredRealUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-stone-400">
                  {realUsers.length === 0 && !usersLoading ? 'Henüz kullanıcı yok.' : 'Eşleşen kullanıcı yok.'}
                </td>
              </tr>
            ) : (
              filteredRealUsers.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-800">{user.email}</div>
                    <div className="text-xs text-stone-400 font-mono">{user.id.slice(0, 8)}…</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${user.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  // --- TOOL MANAGEMENT VIEW ---
  const renderTools = () => {
    if (isEditingTool) {
      return (
        <div className="bg-white p-8 rounded-xl border border-stone-200 animate-in slide-in-from-right-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold text-stone-800">{editingTool.id ? 'Edit Tool' : 'Create New Tool'}</h3>
             <button onClick={() => setIsEditingTool(false)} className="text-stone-400 hover:text-stone-600"><XCircle /></button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-2">
                 <label className="block text-sm font-bold text-stone-700 mb-1">Tool Name</label>
                 <input 
                   type="text" 
                   value={editingTool.name || ''} 
                   onChange={e => setEditingTool({...editingTool, name: e.target.value})}
                   className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
                   placeholder="e.g. Viral TikTok Hook Generator"
                 />
              </div>
              
              <div className="col-span-2">
                 <label className="block text-sm font-bold text-stone-700 mb-1">Category</label>
                 <select 
                    value={editingTool.categoryId || ''}
                    onChange={e => setEditingTool({...editingTool, categoryId: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none"
                 >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                 <label className="block text-sm font-bold text-stone-700 mb-1">Access Tier</label>
                 <select 
                    value={editingTool.accessLevel || 'basic'}
                    onChange={e => setEditingTool({...editingTool, accessLevel: e.target.value as any})}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none"
                 >
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="premium">Premium</option>
                 </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                 <label className="block text-sm font-bold text-stone-700 mb-1">Cost (Credits)</label>
                 <input 
                   type="number" 
                   value={editingTool.costPerUse || 0} 
                   onChange={e => setEditingTool({...editingTool, costPerUse: parseInt(e.target.value)})}
                   className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none" 
                 />
              </div>

              <div className="col-span-2">
                 <label className="block text-sm font-bold text-stone-700 mb-1">Description (Frontend)</label>
                 <input 
                   type="text" 
                   value={editingTool.description || ''} 
                   onChange={e => setEditingTool({...editingTool, description: e.target.value})}
                   className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none" 
                   placeholder="Short description for card..."
                 />
              </div>
              
              <div className="col-span-2">
                 <label className="block text-sm font-bold text-stone-700 mb-1">User Instruction (Placeholder)</label>
                 <input 
                   type="text" 
                   value={editingTool.instruction || ''} 
                   onChange={e => setEditingTool({...editingTool, instruction: e.target.value})}
                   className="w-full px-4 py-2 border border-stone-200 rounded-lg outline-none" 
                   placeholder="e.g. Enter product name..."
                 />
              </div>

              <div className="col-span-2">
                 <label className="block text-sm font-bold text-brand-600 mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> System Prompt (Backend)
                 </label>
                 <textarea 
                   rows={6}
                   value={editingTool.systemPrompt || ''} 
                   onChange={e => setEditingTool({...editingTool, systemPrompt: e.target.value})}
                   className="w-full px-4 py-3 border border-brand-200 bg-brand-50/20 rounded-lg outline-none font-mono text-sm" 
                   placeholder="You are an expert marketer. Your goal is to..."
                 />
                 <div className="mt-2 flex justify-end">
                    <button className="text-xs flex items-center gap-1 bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-700">
                       <Play className="w-3 h-3" /> Test Prompt in Sandbox
                    </button>
                 </div>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
              <button onClick={() => setIsEditingTool(false)} className="px-6 py-2 border border-stone-200 rounded-lg font-medium text-stone-600 hover:bg-stone-50">Cancel</button>
              <button onClick={handleSaveTool} className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md">Save Tool</button>
           </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in">
         <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
            <h3 className="font-bold text-stone-800">Tool Library</h3>
            <div className="flex gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="text" placeholder="Search tools..." className="pl-9 pr-4 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-brand-500" />
               </div>
               <button 
                 onClick={() => { setEditingTool({}); setIsEditingTool(true); }}
                 className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-lg hover:bg-stone-800"
               >
                 <Plus className="w-4 h-4" /> Add Tool
               </button>
            </div>
         </div>
         <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-stone-100 text-stone-500 font-medium sticky top-0 z-10">
                  <tr>
                     <th className="px-6 py-3">Category</th>
                     <th className="px-6 py-3">Tool Name</th>
                     <th className="px-6 py-3 w-1/3">Description</th>
                     <th className="px-6 py-3">Tier / Cost</th>
                     <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-stone-100">
                  {flattenTools().map((tool) => (
                     <tr key={tool.id} className="hover:bg-stone-50 group">
                        <td className="px-6 py-4">
                            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded">{tool.categoryName}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-stone-800">{tool.name}</td>
                        <td className="px-6 py-4 text-stone-500 text-xs leading-relaxed">{tool.description}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                               <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded w-fit ${tool.accessLevel === 'basic' ? 'bg-stone-200 text-stone-600' : tool.accessLevel === 'pro' ? 'bg-brand-100 text-brand-600' : 'bg-purple-100 text-purple-600'}`}>
                                  {tool.accessLevel}
                               </span>
                               <span className="text-xs text-stone-400">{tool.costPerUse} cr</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingTool(tool); setIsEditingTool(true); }} className="p-1.5 hover:bg-stone-200 rounded text-stone-600"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteTool(tool.id, tool.categoryId!)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    );
  };

  const renderCategories = () => (
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
             <h3 className="font-bold text-stone-800">Category Management</h3>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-stone-200 text-stone-700 text-xs font-bold rounded hover:bg-stone-300">
                <Plus className="w-3 h-3" /> New Category
             </button>
          </div>
          <div className="p-0">
              <table className="w-full text-left text-sm">
                 <thead className="bg-stone-100 text-stone-500 font-medium">
                    <tr>
                       <th className="px-6 py-3">Category Name</th>
                       <th className="px-6 py-3">ID</th>
                       <th className="px-6 py-3">Tool Count</th>
                       <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                    {categories.map(cat => (
                        <tr key={cat.id} className="hover:bg-stone-50">
                           <td className="px-6 py-4 font-bold text-stone-800 flex items-center gap-2">
                               <FolderOpen className="w-4 h-4 text-stone-400" />
                               {cat.name}
                           </td>
                           <td className="px-6 py-4 text-xs font-mono text-stone-400">{cat.id}</td>
                           <td className="px-6 py-4">
                               <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-xs font-bold">{cat.tools.length} tools</span>
                           </td>
                           <td className="px-6 py-4 text-right text-stone-400 hover:text-stone-600 cursor-pointer">
                               <Edit className="w-4 h-4 inline" />
                           </td>
                        </tr>
                    ))}
                 </tbody>
              </table>
          </div>
      </div>
  );

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-[#F2F2F0]">
      {/* Admin Header */}
      <div className="h-16 bg-brand-600 text-white flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-3">
           <div className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin Mode</div>
           <h2 className="font-bold text-lg">YAZU Command Center</h2>
        </div>
        <button onClick={onExit} className="text-sm text-stone-400 hover:text-white flex items-center gap-2">
           Exit to App <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Admin Sidebar */}
         <div className="w-64 bg-white border-r border-stone-200 flex flex-col">
            <nav className="p-4 space-y-1">
               <button 
                 onClick={() => setActiveTab('analytics')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'}`}
               >
                 <BarChart3 className="w-4 h-4" /> Deep Analytics
               </button>
               <button 
                 onClick={() => setActiveTab('users')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'}`}
               >
                 <Users className="w-4 h-4" /> Users
               </button>
               <button 
                 onClick={() => setActiveTab('tools')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'tools' ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'}`}
               >
                 <Wrench className="w-4 h-4" /> Tool Management
               </button>
               <button 
                 onClick={() => setActiveTab('categories')}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100'}`}
               >
                 <FolderOpen className="w-4 h-4" /> Categories
               </button>
            </nav>
            <div className="mt-auto p-6 border-t border-stone-200">
               <div className="text-xs text-stone-400 font-mono">v2.5.0 (Build 9001)</div>
               <div className="text-xs text-stone-400 mt-1">Server: AWS-EU-WEST</div>
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-8">
            <h1 className="text-2xl font-bold text-stone-800 mb-6 capitalize">{activeTab} Overview</h1>
            {activeTab === 'analytics' && renderDeepAnalytics()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'tools' && renderTools()}
            {activeTab === 'categories' && renderCategories()}
         </div>
      </div>
    </div>
  );
};

export default AdminView;
