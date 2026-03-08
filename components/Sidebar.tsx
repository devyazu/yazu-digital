import React, { useState, useEffect, useRef } from 'react';
import { Category, Tool, UserProfile } from '../types';
import { getIcon, PanelLeft, History, Bot, LogOut, Star, Crown, Gem, ChevronDown, ChevronRight, Plus } from '../lib/safeIcons';

interface SidebarProps {
  categories: Category[];
  selectedTool: Tool | null;
  selectedCategory: Category | null;
  onSelectTool: (tool: Tool) => void;
  onSelectCategory: (category: Category) => void;
  onNavigate: (view: 'home' | 'tool' | 'history' | 'brands-list' | 'brand-connect' | 'settings' | 'sales-agent' | 'support') => void;
  activeView: string;
  isOpen: boolean;
  isDesktopOpen: boolean;
  onToggleDesktopSidebar?: () => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
  onReorderFavorites?: (newOrder: string[]) => void;
  user: UserProfile;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedTool,
  selectedCategory,
  onSelectTool,
  onSelectCategory,
  onNavigate,
  activeView,
  isOpen,
  isDesktopOpen,
  onToggleDesktopSidebar,
  favorites,
  onToggleFavorite,
  onReorderFavorites,
  user,
  onLogout,
}) => {
  // #region agent log
  fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'Sidebar.tsx:render',message:'Sidebar render',data:{favoritesLen:favorites?.length??0},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  // Default expanded categories
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(['cat-visual', 'cat-ugc', 'cat-copy']));
  // Pagination state
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const selectedCategoryRowRef = useRef<HTMLDivElement>(null);
  // Favorites drag-and-drop (inlined to avoid separate component minification issues)
  const [favDraggedId, setFavDraggedId] = useState<string | null>(null);
  const [favDragOverId, setFavDragOverId] = useState<string | null>(null);

  // When sidebar opens (desktop) with a selected category (e.g. from mini bar click), expand it and scroll so that category title is visible at top
  useEffect(() => {
    if (!isDesktopOpen || !selectedCategory) return;
    setExpandedCats(prev => new Set([...prev, selectedCategory.id]));
    const t = setTimeout(() => {
      selectedCategoryRowRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 350);
    return () => clearTimeout(t);
  }, [isDesktopOpen, selectedCategory?.id]);

  const toggleCategory = (catId: string) => {
    const newSet = new Set(expandedCats);
    if (newSet.has(catId)) {
      newSet.delete(catId);
    } else {
      newSet.add(catId);
    }
    setExpandedCats(newSet);
  };

  const handleCategoryClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    onSelectCategory(category);
    // REMOVED: toggleCategory(category.id); -> Only toggle on arrow click
  };

  const handleToggleClick = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    toggleCategory(catId);
  }

  const handleLoadMore = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    setVisibleCounts(prev => ({
      ...prev,
      [catId]: (prev[catId] || 4) + 4
    }));
  };

  const getFavoriteTools = (): Tool[] => {
    const allTools = (categories ?? []).flatMap((c) => (c.tools ?? []));
    const byId = new Map(allTools.map((t) => [t.id, t]));
    return (favorites ?? []).map((id) => byId.get(id)).filter((t): t is Tool => t != null);
  };

  // Mini sidebar: visible only on desktop when main sidebar is closed
  const miniSidebarClasses = `hidden ${!isDesktopOpen ? 'lg:flex' : 'lg:hidden'} flex-col w-14 flex-shrink-0 border-r border-stone-200/60 bg-white/80 backdrop-blur-xl h-[calc(100vh-64px)] py-4 items-center gap-1 z-20`;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
    transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
    lg:translate-x-0 lg:static lg:inset-auto lg:h-[calc(100vh-64px)] overflow-y-auto flex flex-col
    ${isDesktopOpen ? 'lg:w-72' : 'lg:w-0 lg:overflow-hidden lg:border-none lg:p-0'}
  `;

  // #region agent log
  fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'Sidebar.tsx:beforeReturn',message:'Sidebar about to return JSX',data:{favoritesLen:favorites?.length??0},timestamp:Date.now(),hypothesisId:'E2'})}).catch(()=>{});
  // #endregion
  return (
    <>
    {/* Mini icon bar when desktop sidebar is closed — scrollable, no scrollbar */}
    <aside className={miniSidebarClasses}>
      <button onClick={onToggleDesktopSidebar} className="p-2.5 shrink-0 text-stone-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Open sidebar" aria-label="Open sidebar">
        <PanelLeft className="w-5 h-5" />
      </button>
      <div
        className="flex-1 min-h-0 flex flex-col items-center gap-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button onClick={() => { onNavigate('history'); onToggleDesktopSidebar?.(); }} className="p-2.5 shrink-0 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700" title="Chat Archive" aria-label="Chat Archive">
          <History className="w-5 h-5" />
        </button>
        {categories.map((cat) => (
          <button key={`mini-${cat.id}`} onClick={() => { onSelectCategory(cat); onToggleDesktopSidebar?.(); }} className="p-2.5 shrink-0 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700" title={cat.name}>
            {getIcon(cat.iconName, 'w-5 h-5')}
          </button>
        ))}
        <button onClick={() => { onNavigate('sales-agent'); onToggleDesktopSidebar?.(); }} className="p-2.5 shrink-0 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700" title="AI Sales Agent" aria-label="AI Sales Agent">
          <Bot className="w-5 h-5" />
        </button>
      </div>
      <div className="border-t border-stone-100 pt-2 flex flex-col items-center gap-1 shrink-0">
        {onLogout && (
          <button onClick={onLogout} className="p-2.5 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600" title="Sign out" aria-label="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>

    <aside className={sidebarClasses}>
      
      {/* 1. History & Favorites Header */}
      <div className="px-4 py-6 space-y-4 border-b border-stone-100 min-w-[288px] lg:min-w-0">
        
        {/* History Button */}
        <button 
          onClick={() => onNavigate('history')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeView === 'history' ? 'bg-stone-800 text-white shadow-lg' : 'bg-white border border-stone-200 text-stone-600 hover:border-brand-300 hover:text-brand-600'}`}
        >
          <History className="w-4 h-4" />
          <span>Chat Archive</span>
        </button>

        {/* Favorites Section (draggable order, inlined to avoid minification issues) */}
        {favorites.length > 0 && (() => {
          // #region agent log
          fetch('http://127.0.0.1:7491/ingest/d0db9da5-030c-4ef0-a8bf-f9f6a978cafd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb67aa'},body:JSON.stringify({sessionId:'cb67aa',location:'Sidebar.tsx:favIIFE',message:'Sidebar favorites IIFE start',data:{},timestamp:Date.now(),hypothesisId:'E2'})}).catch(()=>{});
          // #endregion
          const favTools = getFavoriteTools();
          const canReorder = Boolean(onReorderFavorites && favorites.length > 1);
          const handleFavDragStart = (e: React.DragEvent, toolId: string) => {
            setFavDraggedId(toolId);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', toolId);
            e.dataTransfer.setData('application/x-tool-id', toolId);
          };
          const handleFavDragOver = (e: React.DragEvent, toolId: string) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (favDraggedId && favDraggedId !== toolId) setFavDragOverId(toolId);
          };
          const handleFavDrop = (e: React.DragEvent, dropTargetId: string) => {
            e.preventDefault();
            setFavDragOverId(null);
            setFavDraggedId(null);
            const fromId = e.dataTransfer.getData('application/x-tool-id') || e.dataTransfer.getData('text/plain');
            if (!fromId || fromId === dropTargetId || !onReorderFavorites) return;
            const idx = favorites.indexOf(fromId);
            const dropIdx = favorites.indexOf(dropTargetId);
            if (idx === -1 || dropIdx === -1) return;
            const next = [...favorites];
            next.splice(idx, 1);
            next.splice(dropIdx, 0, fromId);
            onReorderFavorites(next);
          };
          return (
            <div className="animate-in fade-in slide-in-from-top-2">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-2 mb-2 px-2">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                Favorites
              </h2>
              <div className="space-y-1">
                {favTools.map((tool) => (
                  <div
                    key={`fav-${tool.id}`}
                    onDragOver={(e) => canReorder && handleFavDragOver(e, tool.id)}
                    onDragLeave={() => setFavDragOverId(null)}
                    onDrop={(e) => handleFavDrop(e, tool.id)}
                    className={`flex items-center gap-2 rounded-lg transition-all ${favDraggedId === tool.id ? 'opacity-50' : ''} ${favDragOverId === tool.id ? 'ring-1 ring-brand-400 bg-brand-50/50' : ''}`}
                  >
                    {canReorder && (
                      <div
                        draggable
                        onDragStart={(e) => handleFavDragStart(e, tool.id)}
                        onDragEnd={() => { setFavDraggedId(null); setFavDragOverId(null); }}
                        className="shrink-0 cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600 touch-none p-0.5 -m-0.5 rounded text-lg leading-none select-none"
                        title="Drag to reorder"
                        aria-hidden
                      >
                        &#8942;&#8942;
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectTool(tool)}
                      className={`flex-1 min-w-0 text-left flex items-center gap-2 px-2 py-1.5 text-[13px] rounded-lg transition-all ${selectedTool?.id === tool.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      <span className="truncate">{tool.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(tool.id); }}
                      className="shrink-0 p-1 hover:bg-stone-200 rounded-full cursor-pointer"
                      title="Remove from favorites"
                      aria-label="Remove from favorites"
                    >
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
      
      {/* 2. Tool Categories */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-1 pt-4 min-w-[288px] lg:min-w-0">
        <div className="px-6 mb-2">
           <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Platform Tools</h2>
        </div>

        {categories.map((category) => {
          const isExpanded = expandedCats.has(category.id);
          const isActiveCategory = (selectedTool && category.tools.find(t => t.id === selectedTool.id)) || selectedCategory?.id === category.id;
          const currentLimit = visibleCounts[category.id] || 5;
          const displayTools = category.tools.slice(0, currentLimit);
          const hasMore = category.tools.length > currentLimit;
          
          return (
            <div key={category.id} ref={selectedCategory?.id === category.id ? selectedCategoryRowRef : undefined} className="px-3">
              <div 
                className={`
                  w-full flex items-center justify-between p-2 rounded-xl transition-all duration-200 cursor-pointer
                  ${isActiveCategory ? 'bg-white shadow-sm ring-1 ring-stone-100' : 'hover:bg-white/50 hover:shadow-sm'}
                `}
                onClick={(e) => handleCategoryClick(e, category)}
              >
                {/* Clickable Area for Navigation */}
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className={`p-1.5 rounded-lg ${isActiveCategory ? 'bg-brand-50 text-brand-600' : 'bg-stone-100 text-stone-500'}`}>
                    {getIcon(category.iconName)}
                  </div>
                  <span className={`text-sm font-semibold ${isActiveCategory ? 'text-stone-800' : 'text-stone-600'}`}>
                    {category.name}
                  </span>
                </div>

                {/* Toggle Icon - SEPARATE BUTTON */}
                <div 
                    className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-200 rounded-md transition-colors"
                    onClick={(e) => handleToggleClick(e, category.id)}
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* Tools List */}
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isExpanded ? 'max-h-[800px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="pl-3 relative ml-4 border-l border-stone-200/60 space-y-0.5 py-1">
                  {displayTools.map((tool) => {
                    const isFav = favorites.includes(tool.id);
                    return (
                      <div
                        key={tool.id}
                        className={`group flex items-center gap-1 pr-2 rounded-lg transition-all min-w-0 ${
                          selectedTool?.id === tool.id
                            ? 'bg-brand-50/80'
                            : 'hover:bg-stone-100/50'
                        }`}
                      >
                        <button
                          onClick={() => onSelectTool(tool)}
                          className={`flex-1 min-w-0 text-left flex items-center gap-2 pl-4 py-2 text-[13px] ${
                            selectedTool?.id === tool.id
                              ? 'text-brand-700 font-medium'
                              : 'text-stone-500 group-hover:text-stone-800'
                          }`}
                        >
                          <div className="shrink-0 opacity-70">{getIcon(tool.iconName, "w-3 h-3")}</div>
                          <span className="truncate min-w-0">{tool.name}</span>
                          {/* Access Level Badge - always visible */}
                          {tool.accessLevel !== 'basic' && (
                             <span className="shrink-0" title={tool.accessLevel === 'premium' ? 'Premium Tool' : 'Pro Tool'}>
                               {tool.accessLevel === 'premium' ? (
                                 <Gem size={12} className="text-purple-600 fill-purple-100" />
                               ) : (
                                 <Crown size={12} className="text-brand-600 fill-brand-100" />
                               )}
                             </span>
                          )}
                        </button>
                        {/* Favorite star: fixed width so it never gets pushed off */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(tool.id);
                          }}
                          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all text-[12px] ${isFav ? 'opacity-100 text-yellow-500' : 'opacity-0 group-hover:opacity-100 text-stone-300 hover:text-yellow-500'}`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Load More Button */}
                  {hasMore && (
                    <button 
                      onClick={(e) => handleLoadMore(e, category.id)}
                      className="w-full text-left flex items-center gap-1 pl-4 py-2 text-[11px] font-medium text-brand-600 hover:underline hover:text-brand-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Load more
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Logout, Toggle, Help (icon only) */}
      <div className="p-4 border-t border-stone-200 space-y-2 min-w-[288px] lg:min-w-0">
         {/* Sales Agent Button */}
         <button 
          onClick={() => onNavigate('sales-agent')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-all border mb-2 ${activeView === 'sales-agent' ? 'bg-gradient-to-r from-brand-600 to-orange-500 text-white border-transparent shadow-lg' : 'bg-white border-brand-200 text-brand-700 hover:bg-brand-50'}`}
         >
          <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span>AI Sales Agent</span>
          </div>
          {activeView !== 'sales-agent' && <span className="bg-brand-100 text-brand-700 text-[9px] px-1.5 py-0.5 rounded uppercase">New</span>}
         </button>

         {/* Logout (left), Sidebar toggle — Help & Support moved to Account Settings */}
         <div className="flex items-center gap-1">
           {onLogout && (
             <button onClick={onLogout} className="flex items-center justify-center gap-2 flex-1 py-2.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all" title="Sign out" aria-label="Sign out">
               <LogOut className="w-4 h-4" />
             </button>
           )}
           {onToggleDesktopSidebar && (
             <button onClick={onToggleDesktopSidebar} className="flex items-center justify-center gap-2 flex-1 py-2.5 text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-lg text-sm font-medium transition-all" title="Close sidebar" aria-label="Close sidebar">
               <PanelLeft className="w-4 h-4" />
             </button>
           )}
         </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;