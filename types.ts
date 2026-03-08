
export interface ToolExample {
  title: string;
  input: string;
  output: string;
}

/** Tool access level (which tier can use this tool). */
export type ToolAccessLevel = 'basic' | 'pro' | 'premium';

/** User subscription / plan tier. Determines credits, max brands, and which tools they can use. */
export type UserTier = 'free' | 'basic' | 'pro' | 'premium' | 'enterprise';

export type UserRole = 'user' | 'admin';

/** @deprecated Use UserTier for user profile, ToolAccessLevel for tool.accessLevel. */
export type AccessLevel = ToolAccessLevel;

export interface Tool {
  id: string;
  name: string;
  description: string;
  instruction: string;
  systemPrompt: string;
  examples: ToolExample[];
  iconName: string;
  accessLevel: ToolAccessLevel;
  costPerUse: number;
  requiresDataConnection?: boolean;
  type?: 'sales' | 'hype'; 
  categoryId?: string; // Link to category
  usageCount?: number; // For analytics
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  tools: Tool[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  credits: {
    total: number;
    used: number;
  };
  avatarUrl?: string;
  maxBrands: number;
  joinedDate: string;
}

/** Default credits and max_brands per tier (for new users or admin reference). */
export const TIER_DEFAULTS: Record<UserTier, { creditsTotal: number; maxBrands: number }> = {
  free: { creditsTotal: 1000, maxBrands: 1 },
  basic: { creditsTotal: 5000, maxBrands: 1 },
  pro: { creditsTotal: 15000, maxBrands: 3 },
  premium: { creditsTotal: 25000, maxBrands: 10 },
  enterprise: { creditsTotal: 100000, maxBrands: 50 },
};

const TIER_ORDER: Record<string, number> = { free: 0, basic: 1, pro: 2, premium: 3, enterprise: 4 };

/** Returns true if userTier is allowed to use a tool with the given access level. */
export function userTierCanAccessTool(userTier: UserTier, toolLevel: ToolAccessLevel): boolean {
  if (userTier === 'enterprise' || userTier === 'premium') return true;
  if (userTier === 'pro' && toolLevel !== 'premium') return true;
  if (userTier === 'basic' && toolLevel === 'basic') return true;
  if (userTier === 'free' && toolLevel === 'basic') return true;
  return false;
}

export interface HistoryItem {
  id: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: number;
}

export type IntegrationType = 'analytics' | 'store' | 'ads' | 'email' | 'social';

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  iconName: string;
  isConnected: boolean;
  lastSync?: string;
}

export interface Brand {
  id: string;
  name: string;
  website: string;
  logoUrl?: string; 
  integrations: Integration[];
  salesAgentConfig?: SalesAgentConfig; // New: Link agent to brand
}

// Sales Agent Specific Types
export interface SalesAgentConfig {
  isActive: boolean;
  name: string;
  tone: 'aggressive' | 'consultative' | 'friendly' | 'luxury';
  goal: 'capture_lead' | 'direct_sale' | 'support_upsell';
  knowledgeBase: string[]; // URLs or Text
  customInstructions: string;
  colorHex: string;
  stats: {
    conversations: number;
    conversions: number;
    revenueGenerated: number;
    avgResponseTime: number; // seconds
  };
}

// Support System Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  isPinned?: boolean;
  tags: string[];
}

// Admin Specific Types
export interface AdminStats {
  totalUsers: number;
  activeSubs: number;
  totalRevenue: number;
  totalGenerations: number;
  mrr: number; // Monthly Recurring Revenue
  churnRate: number;
  avgLTV: number; // Lifetime Value
  tokenUsage: number;
}
