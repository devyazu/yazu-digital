import React from 'react';
import { Category, Tool, AccessLevel } from '../types';
import { 
  Search, Lock, Zap, ArrowRight, Sparkles, PlayCircle, BarChart3, Target, Crown, Gem, Layout,
  ChevronDown, ChevronRight, LayoutGrid, BrainCircuit, MousePointerClick, TrendingUp, 
  TrendingDown, DollarSign, Eye, ShoppingCart, Palette, Box, Swords, ShoppingBag, Mail, Globe, PenTool, Plus,
  Video, Image, Users, Repeat, Megaphone, Shield, Heart, Star, History, Code, Tag, Truck, Store, ShieldCheck,
  Bot, LifeBuoy, MapPin, Gamepad2, Briefcase, Facebook, Music, Camera, Shirt, Disc, Film, Edit3, Lock as LockIcon, MessageSquare,
  Gift, Book, Clipboard, Hash, Layers, GitMerge, Grid, Map, Bell, Sticker
} from 'lucide-react';

interface DashboardProps {
  categories: Category[];
  onSelectTool: (tool: Tool) => void;
  onSelectCategory: (category: Category) => void;
  userTier: AccessLevel;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

const getIcon = (name: string, className?: string) => {
  const props = { className: className || "w-4 h-4" };
  switch (name) {
    case 'Zap': return <Zap {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'Box': return <Box {...props} />;
    case 'Swords': return <Swords {...props} />;
    case 'BrainCircuit': return <BrainCircuit {...props} />;
    case 'Target': return <Target {...props} />;
    case 'MousePointerClick': return <MousePointerClick {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'TrendingDown': return <TrendingDown {...props} />;
    case 'DollarSign': return <DollarSign {...props} />;
    case 'Eye': return <Eye {...props} />;
    case 'ShoppingCart': return <ShoppingCart {...props} />;
    case 'Mail': return <Mail {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Video': return <Video {...props} />;
    case 'Image': return <Image {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Repeat': return <Repeat {...props} />;
    case 'Megaphone': return <Megaphone {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Search': return <Search {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'PlayCircle': return <PlayCircle {...props} />;
    case 'Code': return <Code {...props} />; 
    case 'Store': return <Store {...props} />; 
    case 'Truck': return <Truck {...props} />; 
    case 'Tag': return <Tag {...props} />; 
    case 'MapPin': return <MapPin {...props} />; 
    case 'Gamepad2': return <Gamepad2 {...props} />; 
    case 'Briefcase': return <Briefcase {...props} />; 
    case 'Facebook': return <Facebook {...props} />; 
    case 'Music': return <Music {...props} />; 
    case 'Gem': return <Gem {...props} />; 
    case 'Camera': return <Camera {...props} />;
    case 'Shirt': return <Shirt {...props} />;
    case 'Disc': return <Disc {...props} />;
    case 'Film': return <Film {...props} />;
    case 'Edit3': return <Edit3 {...props} />;
    case 'Lock': return <LockIcon {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    case 'Gift': return <Gift {...props} />;
    case 'Book': return <Book {...props} />;
    case 'Clipboard': return <Clipboard {...props} />;
    case 'Hash': return <Hash {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'GitMerge': return <GitMerge {...props} />;
    case 'Grid': return <Grid {...props} />;
    case 'Map': return <Map {...props} />;
    case 'Bell': return <Bell {...props} />;
    case 'Sticker': return <Sticker {...props} />;
    case 'Layout': return <Layout {...props} />;
    default: return <LayoutGrid {...props} />;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ categories, onSelectTool, onSelectCategory, userTier, searchQuery, onSearchChange }) => {
  
  // Helper to check if user has access
  const hasAccess = (toolLevel: AccessLevel) => {
    if (userTier === 'premium') return true;
    if (userTier === 'pro' && toolLevel !== 'premium') return true;
    if (userTier === 'basic' && toolLevel === 'basic') return true;
    return false;
  };

  const getTierColor = (level: AccessLevel) => {
    switch (level) {
      case 'premium': return 'bg-purple-600/90 shadow-purple-200';
      case 'pro': return 'bg-brand-600/90 shadow-brand-200';
      default: return 'bg-stone-400';
    }
  };

  // Generate a distinct gradient for each tool/category based on ID
  const getToolGradient = (toolId: string) => {
    if (toolId.includes('viral') || toolId.includes('tik')) return "bg-gradient-to-br from-pink-500 to-rose-500";
    if (toolId.includes('visual') || toolId.includes('photo')) return "bg-gradient-to-br from-orange-400 to-amber-500";
    if (toolId.includes('ugc')) return "bg-gradient-to-br from-purple-500 to-indigo-500";
    if (toolId.includes('video')) return "bg-gradient-to-br from-red-500 to-pink-600";
    if (toolId.includes('copy')) return "bg-gradient-to-br from-blue-500 to-cyan-500";
    if (toolId.includes('comp')) return "bg-gradient-to-br from-slate-600 to-slate-800";
    if (toolId.includes('cro')) return "bg-gradient-to-br from-emerald-500 to-teal-600";
    if (toolId.includes('mail')) return "bg-gradient-to-br from-yellow-400 to-orange-500";
    if (toolId.includes('wp')) return "bg-gradient-to-br from-blue-600 to-indigo-700";
    if (toolId.includes('shop')) return "bg-gradient-to-br from-green-500 to-emerald-600";
    if (toolId.includes('amz')) return "bg-gradient-to-br from-orange-500 to-yellow-500";
    if (toolId.includes('etsy')) return "bg-gradient-to-br from-orange-600 to-red-500";
    if (toolId.includes('goog')) return "bg-gradient-to-br from-blue-500 to-blue-700";
    if (toolId.includes('meta')) return "bg-gradient-to-br from-blue-600 to-indigo-600";
    if (toolId.includes('brand')) return "bg-gradient-to-br from-fuchsia-500 to-purple-600";
    if (toolId.includes('b2b')) return "bg-gradient-to-br from-sky-500 to-blue-600";
    if (toolId.includes('ret')) return "bg-gradient-to-br from-rose-400 to-red-500";
    if (toolId.includes('loc')) return "bg-gradient-to-br from-green-400 to-teal-500";
    if (toolId.includes('pr')) return "bg-gradient-to-br from-cyan-500 to-blue-500";
    if (toolId.includes('game')) return "bg-gradient-to-br from-violet-500 to-purple-600";
    if (toolId.includes('comm')) return "bg-gradient-to-br from-yellow-500 to-orange-500";

    return "bg-gradient-to-br from-stone-400 to-stone-600"; 
  };

  const renderToolCard = (tool: Tool) => {
    const locked = !hasAccess(tool.accessLevel);
    
    return (
      <button 
        key={tool.id}
        onClick={() => !locked && onSelectTool(tool)}
        className={`
          group flex bg-white/60 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden h-48 text-left
          ${locked 
            ? 'border-stone-200 opacity-70 cursor-not-allowed' 
            : 'border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(230,96,0,0.15)] hover:border-brand-200/50 hover:-translate-y-1'}
        `}
      >
        {/* Left Content (60%) */}
        <div className="flex-[0.6] p-6 flex flex-col justify-between relative z-10">
          <div>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-md ${tool.type === 'hype' ? 'bg-purple-100/50 text-purple-600' : 'bg-green-100/50 text-green-600'}`}>
                  {tool.type === 'hype' ? <PlayCircle size={14} /> : <BarChart3 size={14} />}
                </div>
                {/* Access Badge */}
                {tool.accessLevel !== 'basic' && (
                  <span className={`${getTierColor(tool.accessLevel)} text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm`}>
                    {locked && <Lock className="w-2.5 h-2.5" />}
                    {tool.accessLevel}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-lg text-stone-800 leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                {tool.name}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
          </div>
          
          <div className={`flex items-center gap-1 text-xs font-bold transition-colors mt-2 ${locked ? 'text-stone-300' : 'text-stone-400 group-hover:text-brand-600'}`}>
            {locked ? 'Upgrade to Unlock' : 'Launch Tool'} <ArrowRight size={12} className={!locked ? "group-hover:translate-x-1 transition-transform" : ""} />
          </div>
        </div>

        {/* Right Gradient & Icon (40%) */}
        <div className={`flex-[0.4] relative overflow-hidden flex items-center justify-center ${getToolGradient(tool.id)} ${locked ? 'grayscale opacity-50' : ''}`}>
            
            {/* Large Transparent Icon */}
            <div className="text-white/20 transform group-hover:scale-110 transition-transform duration-500">
               {getIcon(tool.iconName, "w-16 h-16")}
            </div>

            {/* Glossy Overlay */}
            {!locked && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            )}
            
            {/* Shine Effect */}
            {!locked && (
              <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
            )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 lg:p-10 scroll-smooth">
      
      {/* Glossy Hero Section */}
      <div className="rounded-3xl p-8 lg:p-10 mb-12 shadow-2xl relative overflow-hidden group">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-500 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Updated Photo Grid Overlay (Fading from Right to Left) */}
        <div className="absolute right-0 top-0 w-2/3 h-full mix-blend-overlay opacity-30">
           <img 
             src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1500" 
             className="w-full h-full object-cover object-center"
             style={{ maskImage: 'linear-gradient(to right, transparent 5%, black 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 5%, black 100%)' }}
             alt="Tech Grid"
           />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:blur-[100px] transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full -ml-16 -mb-16 blur-[60px]"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight text-white drop-shadow-sm">What will you create today?</h1>
          <p className="text-brand-50 text-lg mb-8 font-light leading-relaxed opacity-90">Access 100+ AI-powered marketing tools to increase your sales performance.</p>
          
          <div className="relative max-w-lg group/search">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md transform group-hover/search:scale-105 transition-transform duration-300"></div>
            <input 
              type="text" 
              placeholder="'Viral TikTok', 'SEO', 'Reklam metni' ara..." 
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="relative w-full py-4 pl-12 pr-4 bg-white/90 backdrop-blur-md rounded-full text-stone-800 placeholder-stone-400 focus:outline-none focus:bg-white shadow-lg border border-white/40 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 z-20" />
          </div>
        </div>
      </div>

      {/* Arama sonucu bilgisi */}
      {searchQuery?.trim() && (
        <p className="text-sm text-stone-500 mb-6 px-1">
          <span className="font-medium text-stone-700">"{searchQuery}"</span> için {categories.reduce((acc, c) => acc + c.tools.length, 0)} araç bulundu.
        </p>
      )}

      {/* Categories Rows */}
      <div className="space-y-12">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Bu arama ile eşleşen araç yok.</p>
            <p className="text-sm mt-1">Farklı bir anahtar kelime deneyin.</p>
          </div>
        ) : categories.map((cat) => (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-3">
                 <h3 className="text-xl font-bold text-stone-800">{cat.name}</h3>
                 <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">{cat.tools.length} Tools</span>
              </div>
              <button 
                onClick={() => onSelectCategory(cat)}
                className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1 transition-all hover:gap-2 px-3 py-1 rounded-lg hover:bg-brand-50/50"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(searchQuery?.trim() ? cat.tools : cat.tools.slice(0, 4)).map((tool) => renderToolCard(tool))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
