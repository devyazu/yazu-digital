
export interface ToolExample {
  title: string;
  input: string;
  output: string;
}

export type AccessLevel = 'basic' | 'pro' | 'premium';
export type UserRole = 'user' | 'admin';

export interface Tool {
  id: string;
  name: string;
  description: string;
  instruction: string;
  systemPrompt: string;
  examples: ToolExample[];
  iconName: string;
  accessLevel: AccessLevel;
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
  tier: AccessLevel;
  credits: {
    total: number;
    used: number;
  };
  avatarUrl?: string;
  maxBrands: number;
  joinedDate: string;
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
