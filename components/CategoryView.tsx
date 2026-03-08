import React from 'react';
import { Category, Tool, UserTier, ToolAccessLevel, userTierCanAccessTool } from '../types';
import { 
  Search, Zap, Lock, ArrowRight, Sparkles, Target, Crown, Gem, PlayCircle, BarChart3,
  ChevronDown, ChevronRight, LayoutGrid, BrainCircuit, MousePointerClick, TrendingUp, 
  TrendingDown, DollarSign, Eye, ShoppingCart, Palette, Box, Swords, ShoppingBag, Mail, Globe, PenTool, Plus,
  Video, Image, Users, Repeat, Megaphone, Shield, Heart, Star, History, Code, Tag, Truck, Store, ShieldCheck,
  Bot, LifeBuoy, MapPin, Gamepad2, Briefcase, Facebook, Music, Camera, Shirt, Disc, Film, Edit3, Lock as LockIcon, MessageSquare,
  Gift, Book, Clipboard, Hash, Layers, GitMerge, Grid, Map, Bell, Sticker, Layout
} from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  onSelectTool: (tool: Tool) => void;
  userTier: UserTier;
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

const CategoryView: React.FC<CategoryViewProps> = ({ category, onSelectTool, userTier }) => {
  
  const hasAccess = (toolLevel: ToolAccessLevel) => userTierCanAccessTool(userTier, toolLevel);

  const getTierColor = (level: ToolAccessLevel) => {
    switch (level) {
      case 'premium': return 'bg-purple-600/90 shadow-purple-200';
      case 'pro': return 'bg-brand-600/90 shadow-brand-200';
      default: return 'bg-stone-400';
    }
  };

  const getCategoryIcon = (iconName: string) => {
     return getIcon(iconName, "w-8 h-8 text-white");
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

  const getGradient = (catId: string) => {
      if (catId.includes('ugc')) return "from-purple-600 via-purple-500 to-pink-500";
      if (catId.includes('visual')) return "from-orange-500 via-amber-500 to-yellow-400";
      if (catId.includes('copy')) return "from-blue-600 via-indigo-500 to-cyan-500";
      if (catId.includes('comp')) return "from-slate-800 via-stone-700 to-zinc-600";
      if (catId.includes('cro')) return "from-emerald-600 via-teal-500 to-green-400";
      if (catId.includes('retention')) return "from-rose-500 via-red-500 to-orange-400";
      if (catId.includes('b2b')) return "from-indigo-600 via-blue-600 to-sky-500";
      if (catId.includes('video')) return "from-red-600 via-red-500 to-orange-500";
      if (catId.includes('branding')) return "from-pink-600 via-pink-500 to-rose-400";
      if (catId.includes('local')) return "from-green-600 via-green-500 to-emerald-400";
      if (catId.includes('game')) return "from-violet-600 via-purple-500 to-fuchsia-400";
      if (catId.includes('pr')) return "from-cyan-600 via-cyan-500 to-blue-400";
      if (catId.includes('comm')) return "from-yellow-500 via-orange-400 to-red-400";
      return "from-stone-700 to-stone-500";
  };

  // Sort tools: Basic -> Pro -> Premium
  const sortedTools = [...category.tools].sort((a, b) => {
    const tierOrder: Record<ToolAccessLevel, number> = {
      basic: 0,
      pro: 1,
      premium: 2,
    };
    return tierOrder[a.accessLevel] - tierOrder[b.accessLevel];
  });

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
      
      {/* Category Header Banner */}
      <div className={`rounded-3xl p-8 lg:p-12 mb-10 shadow-xl relative overflow-hidden bg-gradient-to-r ${getGradient(category.id)}`}>
         {/* Background Patterns */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>

         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                  {getCategoryIcon(category.iconName)}
               </div>
               <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">{category.name}</h1>
                  <p className="text-white/80 font-light text-lg">Specialized agents for this workflow</p>
               </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" /> {category.tools.length} AI Agents
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" /> Goal Oriented
                </div>
            </div>
         </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-800">Available Tools</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={`Search ${category.name}...`}
                  className="pl-9 pr-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 focus:bg-white text-sm w-64 shadow-sm focus:outline-none focus:border-brand-300 transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => renderToolCard(tool))}
        </div>
      </div>

    </div>
  );
};

export default CategoryView;
