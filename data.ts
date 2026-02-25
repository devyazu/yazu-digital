import { Category, Tool, UserProfile, Brand, FAQItem, ForumTopic } from './types';

export const MOCK_USER: UserProfile = {
  id: "u-1",
  name: "Growth Manager",
  email: "admin@salesmind.ai",
  role: 'admin',
  tier: 'premium', 
  credits: {
    total: 25000,
    used: 4500
  },
  maxBrands: 10, 
  avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&q=80",
  joinedDate: "2023-10-15"
};

export const MOCK_USERS_LIST: UserProfile[] = [
  MOCK_USER,
  {
    id: "u-2", name: "Sarah Connor", email: "sarah@sky.net", role: 'user', tier: 'basic',
    credits: { total: 5000, used: 4800 }, maxBrands: 1, joinedDate: "2024-01-10"
  },
  {
    id: "u-3", name: "John Doe", email: "john@doe.com", role: 'user', tier: 'pro',
    credits: { total: 15000, used: 2000 }, maxBrands: 3, joinedDate: "2024-02-15"
  }
];

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-1',
    name: 'Urban Sneakers Co.',
    website: 'urbansneakers.demo',
    logoUrl: '/yazu.svg',
    salesAgentConfig: {
      isActive: true,
      name: "Alex (Sales Guide)",
      tone: 'friendly',
      goal: 'direct_sale',
      knowledgeBase: ['Returns Policy', 'Size Guide', 'Fall Collection'],
      customInstructions: "Always try to upsell the shoe cleaner kit when someone asks about white sneakers.",
      colorHex: "#FF7B1A",
      stats: {
        conversations: 1240,
        conversions: 85,
        revenueGenerated: 12500,
        avgResponseTime: 1.2
      }
    },
    integrations: [
      { id: 'google-analytics', name: 'Google Analytics 4', type: 'analytics', iconName: 'BarChart2', isConnected: true, lastSync: '2 mins ago' },
      { id: 'shopify', name: 'Shopify Store', type: 'store', iconName: 'ShoppingBag', isConnected: true, lastSync: '10 mins ago' },
      { id: 'meta-ads', name: 'Meta Ads Manager', type: 'ads', iconName: 'Facebook', isConnected: false },
      { id: 'google-ads', name: 'Google Ads', type: 'ads', iconName: 'Search', isConnected: true, lastSync: '1 hour ago' },
    ]
  },
  {
    id: 'brand-2',
    name: 'Cosmic Coffee',
    website: 'cosmic.coffee',
    logoUrl: '/yazu.svg',
    salesAgentConfig: {
      isActive: false,
      name: "Barista Bot",
      tone: 'consultative',
      goal: 'capture_lead',
      knowledgeBase: [],
      customInstructions: "",
      colorHex: "#4B3621",
      stats: {
        conversations: 0,
        conversions: 0,
        revenueGenerated: 0,
        avgResponseTime: 0
      }
    },
    integrations: [
      { id: 'shopify', name: 'Shopify Store', type: 'store', iconName: 'ShoppingBag', isConnected: false },
    ]
  }
];

export const FAQS: FAQItem[] = [
  { id: '1', category: 'Billing', question: 'How do credits roll over?', answer: 'Unused credits do not roll over to the next month on Basic plans. Pro and Premium plans allow up to 50% rollover.' },
  { id: '2', category: 'Technical', question: 'How do I install the Sales Pixel?', answer: 'Go to the Sales Agent tab, click "Installation", and copy the JS snippet into your website <head> tag.' },
  { id: '3', category: 'Account', question: 'Can I add team members?', answer: 'Yes, team seats are available on the Pro plan ($5/user/mo).' },
];

export const FORUM_TOPICS: ForumTopic[] = [
  { id: '1', title: 'Best practices for Black Friday ads?', author: 'MarketingGuru99', replies: 45, views: 1200, isPinned: true, tags: ['Strategy', 'Ads'] },
  { id: '2', title: 'My Sales Agent increased conversion by 15%!', author: 'EcomMaster', replies: 12, views: 450, tags: ['Success Story', 'Agent'] },
  { id: '3', title: 'Feature Request: TikTok Shop Integration', author: 'GenZSeller', replies: 8, views: 200, tags: ['Feedback'] },
];

// --------------------------------------------------------
// UPDATED CATEGORIES & TOOLS FROM CSV
// --------------------------------------------------------

export const CATEGORIES: Category[] = [
  {
    id: 'cat-visual',
    name: 'Visual Studio',
    iconName: 'Image',
    tools: [
      {
        id: 'vis-1', categoryId: 'cat-visual', name: 'AI Virtual Try-On / Product Dresser', 
        description: 'Tool for visualizing products (apparel/accessories) on diverse human models.', 
        instruction: 'User uploads a product photo and selects a model type; AI renders a high-quality lifestyle image with the product worn naturally.', 
        systemPrompt: 'Render a high-quality lifestyle image with the product worn naturally on the selected model.', 
        examples: [], iconName: 'Shirt', accessLevel: 'premium', costPerUse: 50, type: 'sales'
      },
      {
        id: 'vis-2', categoryId: 'cat-visual', name: 'Them vs. Us Visualizer', 
        description: 'Tool to create "Compare & Contrast" graphics showing product advantages over competitors.', 
        instruction: 'User inputs unique selling points and competitor flaws; AI generates a split-screen visual optimized for social media ads.', 
        systemPrompt: 'Create a split-screen visual optimized for social media ads showing product advantages.', 
        examples: [], iconName: 'Swords', accessLevel: 'pro', costPerUse: 25, type: 'hype'
      },
      {
        id: 'vis-3', categoryId: 'cat-visual', name: 'Instant Studio Background', 
        description: 'Tool that places raw product photos into professional, high-end studio or outdoor settings.', 
        instruction: 'User uploads a basic product photo; AI removes the background and generates a realistic, aesthetically pleasing environment.', 
        systemPrompt: 'Remove the background and generate a realistic, aesthetically pleasing environment.', 
        examples: [], iconName: 'Image', accessLevel: 'basic', costPerUse: 15, type: 'sales'
      },
      {
        id: 'vis-4', categoryId: 'cat-visual', name: 'UGC Style Ad Generator', 
        description: 'Tool that transforms professional product shots into "User Generated Content" style authentic photos.', 
        instruction: 'Upload professional product shot. AI adds filters, hand-held camera effects, and domestic settings to make products look like they were photographed by real customers.', 
        systemPrompt: 'Add filters, hand-held camera effects, and domestic settings to make products look like they were photographed by real customers.', 
        examples: [], iconName: 'Camera', accessLevel: 'pro', costPerUse: 30, type: 'hype'
      },
      {
        id: 'vis-5', categoryId: 'cat-visual', name: 'Dynamic Seasonal Rebrander', 
        description: 'Tool that automatically updates product visuals for specific holidays or seasons (Christmas, Eid, Summer).', 
        instruction: 'User selects a theme (e.g., Winter); AI adjusts lighting, adds seasonal props (snow, leaves, etc.), and updates the color palette.', 
        systemPrompt: 'Adjust lighting, add seasonal props (snow, leaves, etc.), and update the color palette.', 
        examples: [], iconName: 'Palette', accessLevel: 'pro', costPerUse: 25, type: 'sales'
      },
      {
        id: 'vis-6', categoryId: 'cat-visual', name: 'Social Proof Overlay Creator', 
        description: 'Tool that overlays dynamic social proof (star ratings, reviews) onto high-quality product images.', 
        instruction: 'User connects store reviews; AI selects top testimonials and aesthetically integrates them into marketing visuals.', 
        systemPrompt: 'Select top testimonials and aesthetically integrate them into marketing visuals.', 
        examples: [], iconName: 'Star', accessLevel: 'basic', costPerUse: 10, type: 'sales'
      },
      {
        id: 'vis-7', categoryId: 'cat-visual', name: 'Flat Lay Stylist', 
        description: 'Tool that generates "top-down" flat lay compositions for product bundles or lifestyle sets.', 
        instruction: 'User lists items in a bundle; AI creates an organized, aesthetically pleasing top-down visual with matching textures and colors.', 
        systemPrompt: 'Create an organized, aesthetically pleasing top-down visual with matching textures and colors.', 
        examples: [], iconName: 'Layout', accessLevel: 'pro', costPerUse: 30, type: 'sales'
      }
    ]
  },
  {
    id: 'cat-ugc',
    name: 'UGC & Avatar AI',
    iconName: 'Video',
    tools: [
      {
        id: 'ugc-1', categoryId: 'cat-ugc', name: 'AI Talking Head Influencer', 
        description: 'Creates videos of realistic digital humans speaking directly to the camera like a real influencer.', 
        instruction: 'User inputs a script; AI selects a lifelike avatar and synthesizes natural speech with matching lip-sync and facial expressions.', 
        systemPrompt: 'Select a lifelike avatar and synthesize natural speech with matching lip-sync and facial expressions.', 
        examples: [], iconName: 'Users', accessLevel: 'premium', costPerUse: 100, type: 'hype'
      },
      {
        id: 'ugc-2', categoryId: 'cat-ugc', name: 'Virtual Unboxing Simulator', 
        description: 'Generates videos showing a product being unboxed and handled by human hands in a domestic setting.', 
        instruction: 'User uploads product 3D model or photos; AI renders a sequence of "first look" movements, including opening the box and holding the product.', 
        systemPrompt: 'Render a sequence of "first look" movements, including opening the box and holding the product.', 
        examples: [], iconName: 'Box', accessLevel: 'premium', costPerUse: 120, type: 'hype'
      },
      {
        id: 'ugc-3', categoryId: 'cat-ugc', name: 'Global Voice & Lip Re-molder', 
        description: 'Localizes existing UGC videos by changing the speaker\'s language and adjusting their lip movements.', 
        instruction: 'Upload video and select target language. AI analyzes the original video, translates the audio, and re-animates the speaker’s mouth to match the new language perfectly.', 
        systemPrompt: 'Analyze the original video, translate the audio, and re-animate the speaker’s mouth to match the new language perfectly.', 
        examples: [], iconName: 'Globe', accessLevel: 'premium', costPerUse: 80, type: 'sales'
      },
      {
        id: 'ugc-4', categoryId: 'cat-ugc', name: 'B-Roll Scene Synthesizer', 
        description: 'Generates lifestyle "background" clips of people using products in real-world scenarios (kitchen, gym, office).', 
        instruction: 'User describes a scenario (e.g., "drinking coffee in a sunny kitchen"); AI generates short, high-quality video clips to be used as background visuals.', 
        systemPrompt: 'Generate short, high-quality video clips to be used as background visuals.', 
        examples: [], iconName: 'Film', accessLevel: 'pro', costPerUse: 50, type: 'hype'
      },
      {
        id: 'ugc-5', categoryId: 'cat-ugc', name: 'Review-to-Video Animator', 
        description: 'Converts written customer reviews into "testimonial style" videos with voiceovers and dynamic captions.', 
        instruction: 'User imports a text review; AI creates a video featuring a narrator, product shots, and kinetic typography that highlights key emotional words.', 
        systemPrompt: 'Create a video featuring a narrator, product shots, and kinetic typography that highlights key emotional words.', 
        examples: [], iconName: 'Star', accessLevel: 'pro', costPerUse: 40, type: 'sales'
      },
      {
        id: 'ugc-6', categoryId: 'cat-ugc', name: 'AI Reaction Generator', 
        description: 'Produces side-by-side "reaction" videos where a person reacts emotionally to a product demo or result.', 
        instruction: 'User provides a product demo video; AI creates a secondary video of a person showing surprise/joy and combines them in a split-screen format.', 
        systemPrompt: 'Create a secondary video of a person showing surprise/joy and combines them in a split-screen format.', 
        examples: [], iconName: 'Smile', accessLevel: 'pro', costPerUse: 45, type: 'hype'
      },
      {
        id: 'ugc-7', categoryId: 'cat-ugc', name: 'Product-in-Motion Storyteller', 
        description: 'Transforms static product images into cinematic, hand-held style motion videos for social media stories.', 
        instruction: 'User uploads 1-2 photos; AI adds camera shake, depth of field, and subtle object movements to make it look like a real smartphone recording.', 
        systemPrompt: 'Add camera shake, depth of field, and subtle object movements to make it look like a real smartphone recording.', 
        examples: [], iconName: 'Zap', accessLevel: 'basic', costPerUse: 20, type: 'hype'
      }
    ]
  },
  {
    id: 'cat-video',
    name: 'Video Ads',
    iconName: 'PlayCircle',
    tools: [
      { id: 'vid-1', categoryId: 'cat-video', name: 'URL-to-Video Ad Maker', description: 'Tool that instantly transforms a product or landing page URL into a high-converting video ad.', instruction: 'User pastes a product link; AI scrapes images and benefits, writes a script, and assembles a video with music and voiceover.', systemPrompt: 'Scrape images and benefits, write a script, and assemble a video with music.', examples: [], iconName: 'Link', accessLevel: 'premium', costPerUse: 80, type: 'sales' },
      { id: 'vid-2', categoryId: 'cat-video', name: 'Long-to-Short Viral Clipper', description: 'Tool that identifies the most engaging parts of long videos (podcasts, webinars) and creates viral clips.', instruction: 'Upload video. AI analyzes the full video for "hooks" and emotional peaks, then automatically crops and adds captions for TikTok/Reels.', systemPrompt: 'Analyze for hooks, crop, and add captions for TikTok/Reels.', examples: [], iconName: 'Scissors', accessLevel: 'pro', costPerUse: 40, type: 'hype' },
      { id: 'vid-3', categoryId: 'cat-video', name: 'Personalized Video Scaler', description: 'Tool for creating thousands of personalized video messages for sales outreach from a single recording.', instruction: 'User records one base video; AI dynamically swaps the recipient\'s name, company, or website screenshot in each version.', systemPrompt: 'Dynamically swap recipient name/company in video.', examples: [], iconName: 'UserPlus', accessLevel: 'premium', costPerUse: 60, type: 'sales' },
      { id: 'vid-4', categoryId: 'cat-video', name: 'AI Lip-Sync Global Dubber', description: 'Tool that translates video content into 30+ languages while perfectly matching the speaker\'s lip movements.', instruction: 'User uploads a video; AI translates the speech, clones the original voice, and re-animates the speaker’s mouth for the new language.', systemPrompt: 'Translate speech, clone voice, and re-animate mouth.', examples: [], iconName: 'Globe', accessLevel: 'premium', costPerUse: 90, type: 'sales' },
      { id: 'vid-5', categoryId: 'cat-video', name: 'Cinematic Text-to-B-Roll', description: 'Tool that generates high-end cinematic scenery or product b-roll clips from simple text prompts.', instruction: 'User describes a scene (e.g., "coffee steam in morning light"); AI generates a hyper-realistic 4K video clip to enhance ad quality.', systemPrompt: 'Generate hyper-realistic 4K video clip.', examples: [], iconName: 'Film', accessLevel: 'pro', costPerUse: 50, type: 'hype' },
      { id: 'vid-6', categoryId: 'cat-video', name: 'Interactive Shoppable Overlay', description: 'Tool that adds AI-driven interactive elements and "Buy Now" buttons directly onto video content.', instruction: 'Upload video. AI detects products within the video frame and overlays clickable hotspots that lead directly to the checkout page.', systemPrompt: 'Detect products and overlay clickable hotspots.', examples: [], iconName: 'ShoppingBag', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'vid-7', categoryId: 'cat-video', name: 'AI Video Performance Predictor', description: 'Tool that analyzes video creative before launch to predict engagement and conversion rates.', instruction: 'User uploads multiple video versions; AI compares them against millions of successful ads to suggest the best hook and visual style.', systemPrompt: 'Compare against successful ads and suggest best hook.', examples: [], iconName: 'TrendingUp', accessLevel: 'premium', costPerUse: 40, type: 'sales' }
    ]
  },
  {
    id: 'cat-copy',
    name: 'Copywriting',
    iconName: 'PenTool',
    tools: [
      { id: 'copy-1', categoryId: 'cat-copy', name: 'Viral Hook & Script Engine', description: 'Tool that creates attention-grabbing openings and scripts for TikTok, Reels, and Shorts.', instruction: 'Input product details. AI analyzes trending psychological triggers and user-provided product details to generate high-retention video scripts.', systemPrompt: 'Analyze trending triggers to generate high-retention scripts.', examples: [], iconName: 'Zap', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'copy-2', categoryId: 'cat-copy', name: 'Semantic SEO Content Strategist', description: 'Generates long-form articles optimized for search intent and Google’s latest "Helpful Content" algorithms.', instruction: 'Input topic. AI researches top competitors and LSI keywords in real-time, then drafts a structured, human-like article with internal linking suggestions.', systemPrompt: 'Research LSI keywords and draft human-like article.', examples: [], iconName: 'Search', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'copy-3', categoryId: 'cat-copy', name: 'Multi-Channel Ad Copy Suite', description: 'Tool that generates tailored ad variations for Meta, Google, and LinkedIn from a single product brief.', instruction: 'Input product brief. User inputs a product description; AI automatically adapts the tone and character limits to fit each specific advertising platform.', systemPrompt: 'Adapt tone/limits for each platform.', examples: [], iconName: 'Layers', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'copy-4', categoryId: 'cat-copy', name: 'High-Conversion Landing Page Architect', description: 'Writes persuasive sales copy for landing pages using conversion frameworks like AIDA or PAS.', instruction: 'Input product info. AI structures the copy by identifying pain points, offering solutions, and creating urgency to maximize the "Add to Cart" rate.', systemPrompt: 'Structure copy using AIDA/PAS frameworks.', examples: [], iconName: 'Layout', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'copy-5', categoryId: 'cat-copy', name: 'AI Brand Voice Cloner', description: 'Learns and replicates a company’s unique writing style to ensure consistency across all marketing assets.', instruction: 'Upload brand content. User uploads previous brand content; AI identifies the tone (e.g., witty, professional, bold) and applies it to all future text generation.', systemPrompt: 'Identify tone and apply to future generation.', examples: [], iconName: 'Mic', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'copy-6', categoryId: 'cat-copy', name: 'Hyper-Personalized Outreach AI', description: 'Drafts unique B2B cold emails or LinkedIn messages by scanning the recipient’s public profile or website.', instruction: 'Scan recipient profile. AI finds a "common ground" or a specific recent achievement of the lead to write a message that feels genuinely personal and human.', systemPrompt: 'Find common ground to write personal message.', examples: [], iconName: 'Send', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'copy-7', categoryId: 'cat-copy', name: 'Review & Feedback Empathy Manager', description: 'Generates strategic and brand-aligned responses to customer reviews and social media comments.', instruction: 'Input review. AI analyzes the sentiment (positive/negative) and drafts a response that resolves issues or amplifies positive PR while maintaining the brand persona.', systemPrompt: 'Analyze sentiment and draft brand-aligned response.', examples: [], iconName: 'Heart', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-competitor',
    name: 'Competitor Intel',
    iconName: 'Target',
    tools: [
      { id: 'comp-1', categoryId: 'cat-competitor', name: 'AI Ad Creative Spy & Analyzer', description: 'Tool that monitors and breaks down competitors\' active ads across Meta, TikTok, and Google.', instruction: 'Input competitor. AI scrapes ad libraries, identifies the highest-performing visual hooks, and predicts their estimated ad spend based on duration.', systemPrompt: 'Scrape ad libraries and analyze visual hooks.', examples: [], iconName: 'Eye', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'comp-2', categoryId: 'cat-competitor', name: 'Semantic Keyword Gap Finder', description: 'Identifies the specific keywords and topics that competitors rank for but you are missing.', instruction: 'Compare two domains. AI compares two domains, analyzes content clusters, and highlights high-traffic search queries you should target to win market share.', systemPrompt: 'Analyze content clusters and highlight opportunities.', examples: [], iconName: 'Search', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'comp-3', categoryId: 'cat-competitor', name: 'Real-Time Price & Promo Tracker', description: 'Monitors competitor websites for instant price changes, stock updates, or new promotional campaigns.', instruction: 'Input competitor URL. AI agents "crawl" competitor product pages daily and send alerts when a price drop or a new discount code is detected.', systemPrompt: 'Crawl pages and alert on price/promo changes.', examples: [], iconName: 'DollarSign', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'comp-4', categoryId: 'cat-competitor', name: 'Sentiment & Voice Share Monitor', description: 'Analyzes what customers are saying about competitors across social media and review sites.', instruction: 'Scan mentions. AI scans millions of mentions, categorizes them as positive/negative, and identifies the competitor’s weakest points (e.g., poor shipping).', systemPrompt: 'Categorize sentiment and identify weak points.', examples: [], iconName: 'BarChart2', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'comp-5', categoryId: 'cat-competitor', name: 'Landing Page & Funnel Reverse-Engineer', description: 'Analyzes the conversion journey and landing page structures of top competitors.', instruction: 'Input URL. AI takes screenshots of competitor funnels, identifies their CTA strategies, and suggests ways to optimize your pages for better conversion.', systemPrompt: 'Identify CTA strategies and suggest optimizations.', examples: [], iconName: 'GitMerge', accessLevel: 'premium', costPerUse: 40, type: 'sales' },
      { id: 'comp-6', categoryId: 'cat-competitor', name: 'AI SWOT Automator', description: 'Generates a dynamic SWOT analysis by scanning news, financial reports, and customer feedback of competitors.', instruction: 'Scan news/reports. AI integrates data from diverse web sources to provide a real-time Strengths, Weaknesses, Opportunities, and Threats report.', systemPrompt: 'Integrate data into SWOT report.', examples: [], iconName: 'Grid', accessLevel: 'pro', costPerUse: 35, type: 'sales' },
      { id: 'comp-7', categoryId: 'cat-competitor', name: 'Competitor Content Cluster Map', description: 'Visualizes the entire content strategy of a competitor to reveal their primary focus areas.', instruction: 'Analyze competitor content. AI categorizes all blog posts and social media content of a competitor into a visual map, showing which topics they dominate.', systemPrompt: 'Categorize posts into visual map.', examples: [], iconName: 'Map', accessLevel: 'pro', costPerUse: 30, type: 'sales' }
    ]
  },
  {
    id: 'cat-conversion',
    name: 'Conversion (CRO)',
    iconName: 'TrendingUp',
    tools: [
      { id: 'cro-1', categoryId: 'cat-conversion', name: 'Visual Checkout Auditor', description: 'AI tool that analyzes checkout page screenshots to identify friction points and leakages.', instruction: 'User uploads a screenshot; AI highlights UX flaws, missing trust signals, and suggests specific layout changes to reduce cart abandonment.', systemPrompt: 'Highlight UX flaws and suggest fixes.', examples: [], iconName: 'Eye', accessLevel: 'premium', costPerUse: 50, type: 'sales' },
      { id: 'cro-2', categoryId: 'cat-conversion', name: 'Killer Hook & Headline Generator', description: 'Tool that creates high-retention opening lines and "Hero Section" headlines.', instruction: 'Input benefits. User inputs product benefits; AI generates 10+ emotional and curiosity-driven headlines designed to stop the scroll and increase CTR.', systemPrompt: 'Generate emotional/curiosity-driven headlines.', examples: [], iconName: 'Type', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'cro-3', categoryId: 'cat-conversion', name: 'Benefit-to-Bullet Transformer', description: 'Tool that turns dry product features into conversion-optimized, persuasive bullet points.', instruction: 'Paste features. User pastes raw features; AI applies copywriting frameworks (like PAS or FAB) to output benefits that trigger the "buy" impulse.', systemPrompt: 'Apply PAS/FAB frameworks to output benefits.', examples: [], iconName: 'List', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'cro-4', categoryId: 'cat-conversion', name: 'CTA Micro-Copy Lab', description: 'Generates high-converting button text and surrounding "click-trigger" phrases.', instruction: 'Input goal. User inputs the goal (e.g., Lead Gen); AI provides 5 variants of button text and a "de-risking" sentence to put under the button.', systemPrompt: 'Provide 5 variants of button text.', examples: [], iconName: 'MousePointer', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'cro-5', categoryId: 'cat-conversion', name: 'Customer Objection Crusher', description: 'Generates a specific FAQ or "Why Us" section by predicting customer doubts.', instruction: 'Provide product link. User provides a product link; AI scans the niche, predicts potential objections (e.g., "Too expensive"), and writes persuasive counter-arguments.', systemPrompt: 'Predict objections and write counter-arguments.', examples: [], iconName: 'Shield', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'cro-6', categoryId: 'cat-conversion', name: 'Social Proof Scripter', description: 'Creates structured templates and prompts to get high-quality testimonials from customers.', instruction: 'Input category. User inputs the product category; AI generates 3 specific questions to ask customers that will yield the most persuasive, conversion-boosting reviews.', systemPrompt: 'Generate questions to ask customers.', examples: [], iconName: 'MessageSquare', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'cro-7', categoryId: 'cat-conversion', name: 'Above-the-Fold Architect', description: 'Analyzes the top section of a landing page and gives a direct "fix-list" for clarity.', instruction: 'Submit URL/screenshot. User submits a URL or screenshot; AI checks if the "Value Proposition" is clear in 3 seconds and provides a rewritten version for better clarity.', systemPrompt: 'Check value prop and rewrite for clarity.', examples: [], iconName: 'Layout', accessLevel: 'pro', costPerUse: 25, type: 'sales' }
    ]
  },
  {
    id: 'cat-mail',
    name: 'Email & SMS',
    iconName: 'Mail',
    tools: [
      { id: 'mail-1', categoryId: 'cat-mail', name: 'Open-Rate Alchemist', description: 'Generates high-curiosity subject lines and preview texts (preheaders) that demand a click.', instruction: 'Enter topic. User enters the email\'s main topic; AI provides 10 subject lines based on psychological triggers (FOMO, Curiosity, Self-interest).', systemPrompt: 'Provide 10 subject lines based on triggers.', examples: [], iconName: 'Zap', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'mail-2', categoryId: 'cat-mail', name: 'Abandoned Cart Emotionalist', description: 'Drafts a 3-step email sequence to recover lost sales by addressing specific customer hesitations.', instruction: 'Provide link/price. User provides product link and price; AI writes three distinct emails: one logic-based, one emotion-based, and one scarcity-based.', systemPrompt: 'Write 3 emails: logic, emotion, scarcity.', examples: [], iconName: 'ShoppingCart', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'mail-3', categoryId: 'cat-mail', name: 'Spam Trigger Auditor', description: 'Analyzes your email draft and flags words or formatting that will likely land you in the "Promotions" or "Spam" folder.', instruction: 'Paste email body. User pastes the email body; AI highlights "risky" words and suggests safer, high-converting alternatives to ensure inbox delivery.', systemPrompt: 'Highlight risky words and suggest alternatives.', examples: [], iconName: 'AlertTriangle', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'mail-4', categoryId: 'cat-mail', name: 'Cold Outreach Icebreaker', description: 'Generates a hyper-personalized opening sentence for B2B emails by scanning a LinkedIn profile or website.', instruction: 'Input LinkedIn URL. User inputs a LinkedIn URL; AI finds a recent post, achievement, or skill and writes a natural, non-creepy "icebreaker" to start the email.', systemPrompt: 'Write natural icebreaker from profile info.', examples: [], iconName: 'User', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'mail-5', categoryId: 'cat-mail', name: 'Article-to-Newsletter Shaper', description: 'Transforms long blog posts or YouTube transcripts into a punchy, readable email newsletter format.', instruction: 'Paste link/text. User pastes a link or text; AI distills the key value points and formats them into a "TL;DR" (Too Long; Didn\'t Read) style engaging newsletter.', systemPrompt: 'Format key points into TL;DR style.', examples: [], iconName: 'FileText', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'mail-6', categoryId: 'cat-mail', name: 'Win-Back Campaign Strategist', description: 'Creates a "last-chance" offer and copy for dormant subscribers who haven\'t opened emails in months.', instruction: 'Input brand details. User inputs the "last seen" average and brand tone; AI generates a compelling "We Miss You" sequence with a strategic discount or update.', systemPrompt: 'Generate "We Miss You" sequence.', examples: [], iconName: 'RefreshCw', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'mail-7', categoryId: 'cat-mail', name: 'Email Flow Logic Architect', description: 'Provides a visual roadmap and specific copy for automated flows (Welcome, Post-Purchase, etc.) based on user behavior.', instruction: 'Select goal. User selects the goal (e.g., "Upsell after first purchase"); AI suggests exactly how many days to wait and what each email should say.', systemPrompt: 'Suggest timing and copy for flows.', examples: [], iconName: 'GitBranch', accessLevel: 'pro', costPerUse: 25, type: 'sales' }
    ]
  },
  {
    id: 'cat-wordpress',
    name: 'WordPress',
    iconName: 'Code',
    tools: [
      { id: 'wp-1', categoryId: 'cat-wordpress', name: 'Instant SEO Article Architect', description: 'Generates a fully formatted, SEO-optimized blog post ready to publish on WordPress.', instruction: 'Input keyword. User inputs a focus keyword; AI researches top SERP results and outputs a post with H1-H3 tags, meta description, and focus keywords.', systemPrompt: 'Research SERP and output formatted post.', examples: [], iconName: 'FileText', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'wp-2', categoryId: 'cat-wordpress', name: 'Natural Language Form Creator', description: 'Tool that builds complex WordPress forms (surveys, quotes, etc.) from a simple text description.', instruction: 'Describe form. User describes the form (e.g., "I need a 5-step insurance quote form"); AI outputs the form structure, fields, and logic instantly.', systemPrompt: 'Output form structure/logic.', examples: [], iconName: 'List', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'wp-3', categoryId: 'cat-wordpress', name: 'Internal Link Strategy Mapper', description: 'Analyzes a new post and provides a direct list of internal links to existing WordPress content.', instruction: 'Paste new article. User pastes the new article; AI scans the site’s database and outputs specific anchor texts and URLs to link for better SEO authority.', systemPrompt: 'Scan site and output links.', examples: [], iconName: 'Link', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'wp-4', categoryId: 'cat-wordpress', name: 'Visual Alt-Text & SEO Optimizer', description: 'Generates SEO-friendly Alt tags and captions for all images in the WordPress media library.', instruction: 'Select images. User selects images or a gallery; AI analyzes the visual content and outputs descriptive, keyword-rich Alt text to boost Image Search rankings.', systemPrompt: 'Output descriptive keyword-rich Alt text.', examples: [], iconName: 'Image', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'wp-5', categoryId: 'cat-wordpress', name: 'WooCommerce Product Wizard', description: 'Transforms raw product data or images into persuasive, high-converting product descriptions.', instruction: 'Upload photo/name. User uploads a product photo or name; AI outputs a catchy title, a short description, and benefit-driven bullet points for the shop page.', systemPrompt: 'Output title, description, and bullets.', examples: [], iconName: 'ShoppingBag', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'wp-6', categoryId: 'cat-wordpress', name: 'PageSpeed Fix Recommender', description: 'Analyzes a WordPress URL and provides a direct "action list" of code and image optimizations.', instruction: 'Provide link. User provides a link; AI audits the site health and outputs specific instructions (e.g., "Resize this image to 800px", "Minify this CSS file").', systemPrompt: 'Audit site and output action list.', examples: [], iconName: 'Zap', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'wp-7', categoryId: 'cat-wordpress', name: 'WP Sidebar Widget Generator', description: 'Creates custom sidebar or footer content (ads, newsletters, CTAs) tailored to specific post categories.', instruction: 'Select category. User selects a category (e.g., "Tech"); AI generates a matching CTA text and layout recommendation to increase sidebar engagement.', systemPrompt: 'Generate CTA text/layout.', examples: [], iconName: 'Layout', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-shopify',
    name: 'Shopify',
    iconName: 'Store',
    tools: [
      { id: 'shop-1', categoryId: 'cat-shopify', name: 'AOV Bundle Architect', description: 'AI tool that suggests high-converting "Frequently Bought Together" bundles for Shopify.', instruction: 'Select product. User selects a core product; AI analyzes sales data and global trends to output 3 specific bundle offers with a combined discount price.', systemPrompt: 'Analyze trends and suggest bundles.', examples: [], iconName: 'Package', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'shop-2', categoryId: 'cat-shopify', name: 'Review-to-Badge Summarizer', description: 'Distills hundreds of customer reviews into 3-5 persuasive "Trust Badges" or bullet points.', instruction: 'Paste reviews. User pastes review text or a link; AI outputs punchy badges like "Fits True to Size" or "Luxurious Texture" for the product page.', systemPrompt: 'Output punchy badges.', examples: [], iconName: 'Award', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'shop-3', categoryId: 'cat-shopify', name: 'Smart Price-Optimizer Output', description: 'Suggests the "Sweet Spot" price for a product by analyzing competitors and perceived value.', instruction: 'Input competitor info. User inputs a competitor URL and cost; AI outputs a recommended price and a "Profit Margin" projection to maximize sales and ROI.', systemPrompt: 'Output recommended price/margin.', examples: [], iconName: 'DollarSign', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'shop-4', categoryId: 'cat-shopify', name: 'Shopify Magic SEO Writer', description: 'Generates SEO-rich product titles, descriptions, and meta tags directly ready for Shopify import.', instruction: 'Upload photo. User uploads a product photo or brief info; AI outputs an SEO-friendly title, a persuasive description, and ready-to-use Alt-tags.', systemPrompt: 'Output SEO-friendly content.', examples: [], iconName: 'Search', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'shop-5', categoryId: 'cat-shopify', name: 'Zero-Stock Alternative Engine', description: 'Generates specific "Out of Stock" marketing messages and cross-sell alternatives for sold-out items.', instruction: 'Detect 0-stock. AI detects a 0-stock product; it outputs a specialized "Don\'t Miss Out" alert and a list of 3 similar products to prevent bounce.', systemPrompt: 'Output "Don\'t Miss Out" alert and alternatives.', examples: [], iconName: 'AlertCircle', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'shop-6', categoryId: 'cat-shopify', name: 'Influencer Outreach Personalizer', description: 'Creates tailored collaboration pitches for Shopify brands to send to niche-specific influencers.', instruction: 'Input profiles. User inputs a product and an influencer profile; AI drafts a unique message that highlights why the product fits that influencer\'s audience.', systemPrompt: 'Draft unique message.', examples: [], iconName: 'Users', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'shop-7', categoryId: 'cat-shopify', name: 'Cart Abandonment Recovery AI', description: 'Generates a 3-part SMS/Email series with dynamic discount codes for abandoned checkouts.', instruction: 'Analyze cart. AI analyzes cart value and item type; it outputs a time-sensitive sequence starting with a "Gentle Nudge" and ending with a "Final Offer."', systemPrompt: 'Output SMS/Email sequence.', examples: [], iconName: 'RefreshCw', accessLevel: 'pro', costPerUse: 15, type: 'sales' }
    ]
  },
  {
    id: 'cat-amazon',
    name: 'Amazon',
    iconName: 'Truck',
    tools: [
      { id: 'amz-1', categoryId: 'cat-amazon', name: 'A10 SEO Listing Architect', description: 'Generates fully optimized Amazon titles, bullet points, and descriptions that maximize A10 ranking.', instruction: 'Enter keywords. User enters main keywords; AI structures the title with high-volume terms and writes 5 benefit-driven bullets using the "Problem-Solution" framework.', systemPrompt: 'Structure title/bullets for A10 ranking.', examples: [], iconName: 'FileText', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'amz-2', categoryId: 'cat-amazon', name: 'Backend Search Term Optimizer', description: 'Creates the "hidden" 249 bytes of backend keywords to ensure maximum indexing without redundancy.', instruction: 'Input keyword list. AI filters out stop words and duplicates from a keyword list and outputs a perfectly formatted string ready for Amazon Seller Central.', systemPrompt: 'Format string for Seller Central.', examples: [], iconName: 'Key', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'amz-3', categoryId: 'cat-amazon', name: 'Review-to-Marketing Insight Extractor', description: 'Analyzes competitor reviews to output a "Battle Plan" for your product\'s marketing copy.', instruction: 'Provide ASIN. User provides a competitor ASIN; AI identifies top customer complaints and praises, then writes copy that highlights how your product solves those specific issues.', systemPrompt: 'Identify complaints/praises for copy.', examples: [], iconName: 'Search', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'amz-4', categoryId: 'cat-amazon', name: 'A+ Content (EBC) Storyboarder', description: 'Provides a layout plan and copywriting for each module of Amazon\'s Enhanced Brand Content (A+).', instruction: 'Upload features. User uploads product features; AI suggests which A+ modules to use (e.g., comparison table, image with text) and writes the copy for each section.', systemPrompt: 'Suggest modules and copy.', examples: [], iconName: 'Layout', accessLevel: 'premium', costPerUse: 40, type: 'sales' },
      { id: 'amz-5', categoryId: 'cat-amazon', name: 'Sponsored Brand Headline Crafter', description: 'Generates high-CTR headlines specifically for Amazon Sponsored Brands and Display ads.', instruction: 'Analyze niche. AI analyzes the product niche and generates 10+ short, punchy headlines designed to fit Amazon’s character limits and trigger a click.', systemPrompt: 'Generate high-CTR headlines.', examples: [], iconName: 'Type', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'amz-6', categoryId: 'cat-amazon', name: 'Main Image Compliance Auditor', description: 'Analyzes your main product image against Amazon\'s TOS and provides a "Clickability" score.', instruction: 'Upload image. User uploads an image; AI checks for pure white background (RGB 255), size requirements, and suggests visual tweaks to stand out in search results.', systemPrompt: 'Check against TOS and suggest tweaks.', examples: [], iconName: 'CheckCircle', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'amz-7', categoryId: 'cat-amazon', name: 'Customer Q&A Persona Generator', description: 'Drafts helpful, natural-sounding answers for the "Customer Questions & Answers" section.', instruction: 'Input queries. User inputs common product queries; AI writes professional yet human-like responses that address doubts while subtly weaving in top keywords.', systemPrompt: 'Write natural responses with keywords.', examples: [], iconName: 'MessageCircle', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-etsy',
    name: 'Etsy',
    iconName: 'Tag',
    tools: [
      { id: 'etsy-1', categoryId: 'cat-etsy', name: 'Etsy Tag & SEO Optimizer', description: 'Generates 13 high-volume, low-competition tags specifically for Etsy\'s search algorithm.', instruction: 'Input product info. User inputs product name and category; AI outputs a list of 13 comma-separated tags optimized for current Etsy search trends.', systemPrompt: 'Output 13 tags for Etsy search.', examples: [], iconName: 'Tag', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'etsy-2', categoryId: 'cat-etsy', name: 'Handcrafted Storyteller', description: 'Writes "About Me" and "Product Story" copy that emphasizes craftsmanship and brand soul.', instruction: 'Provide details. User provides raw details about the making process; AI generates a warm, human-like narrative that connects emotionally with Etsy buyers.', systemPrompt: 'Generate warm narrative.', examples: [], iconName: 'PenTool', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'etsy-3', categoryId: 'cat-etsy', name: 'Aesthetic Lifestyle Backgrounder', description: 'Transforms a basic product photo into a "Boho", "Minimalist" or "Rustic" lifestyle shot.', instruction: 'Upload photo. User uploads a clean product photo; AI generates a contextually appropriate, aesthetic background (e.g., wooden table, linen cloth) typical for Etsy.', systemPrompt: 'Generate aesthetic background.', examples: [], iconName: 'Image', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'etsy-4', categoryId: 'cat-etsy', name: 'Etsy Message Automator', description: 'Drafts personalized "Thank You" and "Shipping Update" messages that encourage positive reviews.', instruction: 'Enter order details. User enters order details; AI generates a friendly, personalized message that feels like it was handwritten by the maker.', systemPrompt: 'Generate personalized messages.', examples: [], iconName: 'Mail', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'etsy-5', categoryId: 'cat-etsy', name: 'Seasonal Gift Guide Crafter', description: 'Creates "Gift for Her/Him" or Holiday-specific titles and descriptions to capture seasonal traffic.', instruction: 'Input product. User inputs the product; AI outputs a special version of the listing optimized for gift-giving holidays (Mother\'s Day, Christmas, etc.).', systemPrompt: 'Optimize for holidays.', examples: [], iconName: 'Gift', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'etsy-6', categoryId: 'cat-etsy', name: 'Etsy Ad Budget Strategist', description: 'Analyzes listing performance data and suggests the daily budget for Etsy Ads to maximize ROI.', instruction: 'Provide stats. User provides view and conversion stats; AI outputs a recommended daily spend and highlights which listings are "Ad-Ready."', systemPrompt: 'Output budget recommendation.', examples: [], iconName: 'DollarSign', accessLevel: 'pro', costPerUse: 15, type: 'sales' },
      { id: 'etsy-7', categoryId: 'cat-etsy', name: 'Review-to-Social Content Creator', description: 'Turns positive customer reviews into aesthetic social media posts (Pinterest/Instagram) to drive traffic.', instruction: 'Paste review. User pastes a 5-star review; AI generates a beautifully designed graphic featuring the review text and product photo.', systemPrompt: 'Generate graphic.', examples: [], iconName: 'Instagram', accessLevel: 'pro', costPerUse: 20, type: 'hype' }
    ]
  },
  {
    id: 'cat-google',
    name: 'Google Ads',
    iconName: 'Search',
    tools: [
      { id: 'goog-1', categoryId: 'cat-google', name: 'RSA Headline & Description Architect', description: 'Generates 15 headlines and 4 descriptions for Responsive Search Ads (RSA) with "Excellent" ad strength.', instruction: 'Input URL. User inputs a landing page URL; AI outputs 15 unique headlines (30 chars) and 4 descriptions (90 chars) that maximize CTR and Ad Strength.', systemPrompt: 'Output headlines/descriptions.', examples: [], iconName: 'Type', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'goog-2', categoryId: 'cat-google', name: 'Negative Keyword "Leak" Finder', description: 'Analyzes search term data to output a "Ready-to-Paste" negative keyword list to stop wasted spend.', instruction: 'Upload report. User uploads a Search Term Report; AI identifies irrelevant or non-converting queries and generates a clean negative list to be applied immediately.', systemPrompt: 'Identify irrelevant queries.', examples: [], iconName: 'Filter', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'goog-3', categoryId: 'cat-google', name: 'Quality Score "Gap" Aligner', description: 'Analyzes the mismatch between Ad Copy and Landing Page to output specific fixes for a higher Quality Score.', instruction: 'Input Ad/URL. User inputs Ad Copy and URL; AI highlights missing keywords on the page and outputs rewritten text to ensure 100% alignment for lower CPC.', systemPrompt: 'Highlight missing keywords/rewrite.', examples: [], iconName: 'BarChart2', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'goog-4', categoryId: 'cat-google', name: 'PMax Asset Group Generator', description: 'Creates a complete set of assets (headlines, long headlines, image prompts) for Performance Max campaigns.', instruction: 'Input guidelines. User inputs brand guidelines and a product; AI outputs 5-15 headlines, 5 long headlines, and detailed prompts for the PMax AI Image Editor.', systemPrompt: 'Output headlines/prompts.', examples: [], iconName: 'Layers', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'goog-5', categoryId: 'cat-google', name: '"AI Mode" Conversational Scripting', description: 'Drafts ad copy specifically designed for Google’s 2025 AI Overviews and conversational search results.', instruction: 'Provide topic. User provides a product topic; AI generates natural, conversational ad scripts that match the context of AI-generated answers in Search.', systemPrompt: 'Generate conversational scripts.', examples: [], iconName: 'MessageSquare', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'goog-6', categoryId: 'cat-google', name: 'Sitelink & Asset Extension Lab', description: 'Generates titles and descriptions for Sitelinks, Callouts, and Structured Snippets to increase ad real estate.', instruction: 'Input pages. User inputs 4 target pages; AI outputs 25-character Sitelink titles and 35-character descriptions that maximize CTR and visual prominence.', systemPrompt: 'Output sitelink titles/descriptions.', examples: [], iconName: 'Link', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'goog-7', categoryId: 'cat-google', name: 'Competitor "Auction Insight" Strategist', description: 'Interprets Google’s Auction Insights data to output a direct bid strategy recommendation.', instruction: 'Paste Insights. User pastes a screenshot of Auction Insights; AI analyzes which competitors are outranking and outputs a strategy (e.g., "Increase Target ROAS by 10%").', systemPrompt: 'Analyze and output strategy.', examples: [], iconName: 'TrendingUp', accessLevel: 'premium', costPerUse: 40, type: 'sales' }
    ]
  },
  {
    id: 'cat-meta',
    name: 'Meta Ads',
    iconName: 'Facebook',
    tools: [
      { id: 'meta-1', categoryId: 'cat-meta', name: 'Meta Ad Copy Bundle (Primary + Headlines)', description: 'Generates high-converting Primary Text, Headlines, and Descriptions within Meta\'s character limits.', instruction: 'Enter URL/persona. User enters product URL and target persona; AI outputs 5 Primary Text variations and 10 punchy Headlines (40 chars) ready to copy.', systemPrompt: 'Output primary text/headlines.', examples: [], iconName: 'Copy', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'meta-2', categoryId: 'cat-meta', name: 'Reels Viral Script & Visual Cues', description: 'Creates 15-30 second Reels scripts including visual hook suggestions and text-overlay prompts.', instruction: 'Describe offer. User describes the offer; AI outputs a split-screen script: what the speaker says (audio) and what should happen on screen (visual cues).', systemPrompt: 'Output split-screen script.', examples: [], iconName: 'Video', accessLevel: 'pro', costPerUse: 20, type: 'hype' },
      { id: 'meta-3', categoryId: 'cat-meta', name: 'Visual "Stop-Scroll" Auditor', description: 'Analyzes a Meta ad screenshot and provides a score based on visual attention and contrast.', instruction: 'Upload creative. User uploads an ad creative; AI highlights where the user\'s eye goes first and outputs 3 direct fixes (e.g., "Add more contrast to the CTA button").', systemPrompt: 'Score attention and suggest fixes.', examples: [], iconName: 'Eye', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'meta-4', categoryId: 'cat-meta', name: 'Advantage+ Audience Architect', description: 'Suggests a list of specific interests and behaviors to plug into Advantage+ Audience targeting.', instruction: 'Input niche. User inputs product niche; AI outputs a curated list of interests and "Lookalike" suggestions to help Meta\'s AI find the right buyers faster.', systemPrompt: 'Output interests/lookalikes.', examples: [], iconName: 'Users', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'meta-5', categoryId: 'cat-meta', name: 'Click-to-WhatsApp Sales Script', description: 'Generates an automated sales conversation flow for ads that lead customers directly to WhatsApp/Messenger.', instruction: 'Provide goal. User provides the product goal; AI outputs the initial greeting, FAQ answers, and a persuasive closing script for the chat assistant.', systemPrompt: 'Output conversation flow.', examples: [], iconName: 'MessageCircle', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'meta-6', categoryId: 'cat-meta', name: 'UGC Stylizer Prompt Generator', description: 'Creates specific prompts to turn professional product photos into "authentic-looking" UGC visuals.', instruction: 'Upload photo. User uploads a studio photo; AI generates a detailed "Midjourney" or "DALL-E" prompt to recreate that product in a natural, handheld camera style.', systemPrompt: 'Generate Midjourney/DALL-E prompt.', examples: [], iconName: 'Image', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'meta-7', categoryId: 'cat-meta', name: 'Dynamic Sticker & CTA Architect', description: 'Designs interactive sticker-style CTA concepts for Stories and Reels to boost engagement.', instruction: 'Select objective. User selects an objective (e.g., Quiz, Shop); AI outputs the text and design layout for interactive stickers that Meta\'s algorithm prioritizes.', systemPrompt: 'Output text/layout.', examples: [], iconName: 'Sticker', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-tiktok',
    name: 'TikTok Ads',
    iconName: 'Music',
    tools: [
      { id: 'tik-1', categoryId: 'cat-tiktok', name: 'Viral 3-Sec Hook Master', description: 'Generates high-retention opening lines (text and speech) to prevent users from scrolling.', instruction: 'Input offer. User inputs the product/offer; AI outputs 10+ "scroll-stopper" hooks categorized by emotion (curiosity, fear, joy).', systemPrompt: 'Output scroll-stopper hooks.', examples: [], iconName: 'Zap', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'tik-2', categoryId: 'cat-tiktok', name: 'Trend-Bridge Architect', description: 'Maps your product to current viral TikTok trends, sounds, and challenges.', instruction: 'Scan trends. AI scans real-time TikTok trends; it outputs a specific "How-to" guide to adapt your product to a trending sound or vibe.', systemPrompt: 'Output guide to adapt product.', examples: [], iconName: 'TrendingUp', accessLevel: 'pro', costPerUse: 20, type: 'hype' },
      { id: 'tik-3', categoryId: 'cat-tiktok', name: 'Scene-by-Scene Script Writer', description: 'Creates a full TikTok script including visual directions for cuts, transitions, and text overlays.', instruction: 'Enter goal. User enters the ad goal; AI outputs a structured script with two columns: "What is said" and "What happens on screen" (Visual Cues).', systemPrompt: 'Output script with visual cues.', examples: [], iconName: 'FileText', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'tik-4', categoryId: 'cat-tiktok', name: 'TikTok SEO & Caption Engine', description: 'Generates keyword-rich captions and hashtag sets optimized for the "For You" page algorithm.', instruction: 'Describe content. User describes the video content; AI outputs a search-optimized caption and a strategic mix of broad and niche hashtags.', systemPrompt: 'Output optimized caption/hashtags.', examples: [], iconName: 'Hash', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'tik-5', categoryId: 'cat-tiktok', name: 'UGC Influencer Brief Maker', description: 'Generates professional and clear instruction sheets for content creators/influencers to follow.', instruction: 'Input KPIs. User inputs campaign KPIs; AI outputs a "Creator Brief" with specific do\'s/dont\'s, required hooks, and the desired call-to-action.', systemPrompt: 'Output Creator Brief.', examples: [], iconName: 'Clipboard', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'tik-6', categoryId: 'cat-tiktok', name: 'Spark Ads Performance Scouter', description: 'Analyzes organic TikTok posts to identify which ones have the highest potential to be boosted as Spark Ads.', instruction: 'Provide links. User provides links to 5 organic posts; AI analyzes engagement patterns and outputs a "Success Score" with a specific ad targeting recommendation.', systemPrompt: 'Analyze and recommend for boosting.', examples: [], iconName: 'BarChart2', accessLevel: 'premium', costPerUse: 30, type: 'sales' },
      { id: 'tik-7', categoryId: 'cat-tiktok', name: 'Interactive Add-on Planner', description: 'Suggests specific TikTok interactive elements like Gift Codes, Voting Stickers, or Display Cards.', instruction: 'Select goal. User selects the conversion goal; AI outputs the exact text and visual placement for interactive stickers that boost click-through rates.', systemPrompt: 'Output text/placement.', examples: [], iconName: 'MousePointer', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-branding',
    name: 'Branding',
    iconName: 'Gem',
    tools: [
      { id: 'brand-1', categoryId: 'cat-branding', name: 'Brand Name Alchemist', description: 'Generates 10+ unique and meaningful brand names based on industry, values, and keywords.', instruction: 'Enter industry/values. User enters their industry and 3 core values; AI outputs creative names along with the "meaning/story" behind each name.', systemPrompt: 'Output creative names and meanings.', examples: [], iconName: 'Type', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'brand-2', categoryId: 'cat-branding', name: 'Logo Concept Architect', description: 'Provides detailed visual prompts and symbolic concepts for professional logo designs.', instruction: 'Enter name/vibe. User enters brand name and vibe (e.g., Minimalist, Bold); AI outputs 3-5 specific Midjourney/DALL-E prompts and explains the symbolism used.', systemPrompt: 'Output visual prompts and symbolism.', examples: [], iconName: 'Image', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'brand-3', categoryId: 'cat-branding', name: 'Brand Archetype Profiler', description: 'Identifies the brand\'s personality (e.g., The Hero, The Creator) and provides a tone-of-voice guide.', instruction: 'Describe goal. User describes the brand\'s ultimate goal; AI categorizes it into one of the 12 Jungian archetypes and outputs a specific communication guide.', systemPrompt: 'Categorize archetype and guide.', examples: [], iconName: 'User', accessLevel: 'pro', costPerUse: 25, type: 'hype' },
      { id: 'brand-4', categoryId: 'cat-branding', name: 'Slogan & Tagline Weaver', description: 'Generates catchy and memorable slogans that capture the brand’s essence and promise.', instruction: 'Enter USP. User enters their unique selling proposition (USP); AI outputs 10 slogans categorized by style (Emotional, Rhyming, Direct).', systemPrompt: 'Output memorable slogans.', examples: [], iconName: 'MessageSquare', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'brand-5', categoryId: 'cat-branding', name: 'Color Psychology Palette Gen', description: 'Suggests a professional color palette based on the emotional response the brand wants to trigger.', instruction: 'Select mood. User selects the desired brand mood (e.g., Luxury, Trust); AI outputs HEX codes and the psychological reason for choosing each color.', systemPrompt: 'Output palette and reasoning.', examples: [], iconName: 'Palette', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'brand-6', categoryId: 'cat-branding', name: 'Mission Statement Sculptor', description: 'Crafts a punchy, 1-sentence mission statement that defines the brand\'s purpose and target.', instruction: 'Enter details. User enters "What we do," "For whom," and "Why"; AI outputs a powerful, inspiring mission statement ready for the website.', systemPrompt: 'Output inspiring statement.', examples: [], iconName: 'Flag', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'brand-7', categoryId: 'cat-branding', name: 'Brand Voice DNA Stylizer', description: 'Analyzes a sample text and creates a "Writing Rules" document to ensure content consistency.', instruction: 'Upload content. User uploads 200 words of their best content; AI identifies the tone and outputs a set of rules (e.g., "Always use active voice", "Use emojis").', systemPrompt: 'Identify tone and rules.', examples: [], iconName: 'Mic', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'brand-8', categoryId: 'cat-branding', name: 'Brand Voice DNA Tuner', description: 'Defines the brand\'s unique personality, tone, and vocabulary to ensure consistent messaging.', instruction: 'Upload texts. User uploads 3 sample texts; AI outputs a "Brand Style Guide" with specific adjectives, banned words, and tone examples.', systemPrompt: 'Output style guide.', examples: [], iconName: 'Sliders', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'brand-9', categoryId: 'cat-branding', name: 'USP (Unique Selling Point) Extractor', description: 'Identifies and articulates the one reason why customers should choose you over everyone else.', instruction: 'Enter info. User enters product info and 3 competitors; AI outputs 5 distinct "Unfair Advantage" statements ready for the website header.', systemPrompt: 'Output Unfair Advantage statements.', examples: [], iconName: 'Star', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'brand-10', categoryId: 'cat-branding', name: 'Psychographic Persona Builder', description: 'Creates deep profiles of the ideal customer, including their fears, desires, and daily habits.', instruction: 'Describe product. User describes the product; AI outputs a detailed "Day in the Life" story of the ideal customer to guide marketing empathy.', systemPrompt: 'Output detailed customer story.', examples: [], iconName: 'Users', accessLevel: 'pro', costPerUse: 25, type: 'sales' }
    ]
  },
  {
    id: 'cat-b2b',
    name: 'B2B Sales',
    iconName: 'Briefcase',
    tools: [
      { id: 'b2b-1', categoryId: 'cat-b2b', name: 'B2B Value Prop Tuner', description: 'Tailors the product\'s value proposition for different stakeholders (e.g., CEO, CTO, CFO).', instruction: 'Input pitch. User inputs a general pitch; AI rewrites it for 3 specific personas: ROI-focused for CFO, Tech-focused for CTO, and Vision-focused for CEO.', systemPrompt: 'Rewrite for CEO/CTO/CFO.', examples: [], iconName: 'Target', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'b2b-2', categoryId: 'cat-b2b', name: 'LinkedIn Social Selling Optimizer', description: 'Rewrites LinkedIn "About" and "Headline" sections to turn a profile into a lead magnet.', instruction: 'Upload bio. User uploads their current bio; AI outputs a professional, benefit-driven headline and an "About" section that highlights social proof and expertise.', systemPrompt: 'Output headline and About section.', examples: [], iconName: 'Linkedin', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'b2b-3', categoryId: 'cat-b2b', name: 'High-Value Lead Magnet Architect', description: 'Generates a structured outline and key content for PDFs, Whitepapers, or E-books to capture B2B leads.', instruction: 'Enter niche. User enters a niche topic; AI outputs a catchy title, a 5-chapter table of contents, and an executive summary designed to collect emails.', systemPrompt: 'Output outline and key content.', examples: [], iconName: 'Magnet', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'b2b-4', categoryId: 'cat-b2b', name: 'Cold Outreach Personalizer', description: 'Creates a 1:1 personalized opening message for cold emails or LinkedIn by scanning a company\'s website.', instruction: 'Enter URL. User enters a company URL; AI identifies their latest news or pain points and writes a human-like, non-spammy opening sentence to start a talk.', systemPrompt: 'Write human-like opening.', examples: [], iconName: 'Mail', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'b2b-5', categoryId: 'cat-b2b', name: 'Case Study Storyteller', description: 'Transforms raw client results and data into a professional "Problem-Solution-Result" success story.', instruction: 'Input metrics. User inputs raw metrics and a brief project summary; AI outputs a structured Case Study document ready for the website or sales deck.', systemPrompt: 'Output structured Case Study.', examples: [], iconName: 'FileText', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'b2b-6', categoryId: 'cat-b2b', name: 'Authority Post Engine', description: 'Generates insightful, data-driven LinkedIn posts that position the user as an industry thought leader.', instruction: 'Provide link. User provides a link to an industry report; AI distills 3 unique "counter-intuitive" insights and formats them into engaging LinkedIn posts.', systemPrompt: 'Format insights into posts.', examples: [], iconName: 'Edit3', accessLevel: 'basic', costPerUse: 15, type: 'hype' },
      { id: 'b2b-7', categoryId: 'cat-b2b', name: 'B2B Objection Crusher', description: 'Generates a "Battle Card" with persuasive responses to common B2B sales objections like "Too expensive" or "No time."', instruction: 'Input pushbacks. User inputs the product and common pushbacks; AI outputs specific scripts for sales teams to handle these objections and keep the deal moving.', systemPrompt: 'Output scripts.', examples: [], iconName: 'Shield', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-retention',
    name: 'Retention',
    iconName: 'Heart',
    tools: [
      { id: 'ret-1', categoryId: 'cat-retention', name: 'Milestone Celebration Engine', description: 'Generates personalized "Thank You" messages for customer anniversaries or purchase milestones.', instruction: 'Input join date. User inputs customer join date; AI outputs a warm, brand-aligned message with a special "anniversary" reward or discount.', systemPrompt: 'Output message with reward.', examples: [], iconName: 'Gift', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'ret-2', categoryId: 'cat-retention', name: 'Win-Back Campaign Architect', description: 'Drafts a 3-part re-engagement email sequence for customers who haven\'t purchased in a while.', instruction: 'Input inactive days. User inputs the average "inactive days" and product niche; AI outputs three strategic emails (Helpful, Emotional, Last-Chance).', systemPrompt: 'Output 3 emails.', examples: [], iconName: 'RefreshCw', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'ret-3', categoryId: 'cat-retention', name: 'VIP Tier & Reward Designer', description: 'Creates a structured loyalty program with specific tier names and exclusive benefit ideas.', instruction: 'Input industry. User inputs brand industry and customer habits; AI outputs a 3-tier program structure (e.g., Bronze, Gold, VIP) with unique perks.', systemPrompt: 'Output 3-tier structure.', examples: [], iconName: 'Crown', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'ret-4', categoryId: 'cat-retention', name: 'Surprise & Delight Recommender', description: 'Suggests "random acts of kindness" or small gifts tailored to specific customer segments.', instruction: 'Describe segment. User describes their best customer segment; AI outputs 5 creative "surprise" ideas (e.g., handwritten note, exclusive beta access, free gift).', systemPrompt: 'Output 5 surprise ideas.', examples: [], iconName: 'Smile', accessLevel: 'basic', costPerUse: 10, type: 'hype' },
      { id: 'ret-5', categoryId: 'cat-retention', name: 'Post-Purchase Education Lab', description: 'Generates "How-to" content or tips to help customers get more value out of their recent purchase.', instruction: 'Input product. User inputs the purchased product; AI outputs a 3-part series of "Expert Tips" designed to increase product usage and satisfaction.', systemPrompt: 'Output 3-part tip series.', examples: [], iconName: 'Book', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'ret-6', categoryId: 'cat-retention', name: 'Referral Loop Strategist', description: 'Crafts the perfect "Invite a Friend" message and incentive structure to turn customers into advocates.', instruction: 'Input AOV. User inputs the average order value; AI outputs a persuasive referral script and a "Double-Sided" reward offer (e.g., Give $20, Get $20).', systemPrompt: 'Output script and reward offer.', examples: [], iconName: 'Users', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'ret-7', categoryId: 'cat-retention', name: 'Churn Intervention Scripter', description: 'Generates empathy-driven scripts for customer support or chat when a user tries to cancel or unsubscribe.', instruction: 'Input reason. User inputs the cancellation reason; AI outputs a "Downsell" offer and a persuasive script to address the specific pain point.', systemPrompt: 'Output downsell offer and script.', examples: [], iconName: 'LifeBuoy', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-local',
    name: 'Local Marketing',
    iconName: 'MapPin',
    tools: [
      { id: 'loc-1', categoryId: 'cat-local', name: 'GMB Post & Event Scheduler', description: 'Generates localized Google Business posts with "Near Me" keywords to boost map rankings.', instruction: 'Input offer. User inputs a weekly offer; AI creates 7 distinct GMB updates with geo-tagged keywords and call-to-actions like "Book Now."', systemPrompt: 'Create 7 geo-tagged posts.', examples: [], iconName: 'Calendar', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'loc-2', categoryId: 'cat-local', name: 'Review Response Localizer', description: 'Drafts review responses that subtly include local keywords (e.g., "Best Pizza in [City Name]").', instruction: 'Paste review. User pastes a customer review; AI generates a warm response that naturally weaves in the city or neighborhood name for Local SEO.', systemPrompt: 'Weave in local keywords.', examples: [], iconName: 'MessageSquare', accessLevel: 'basic', costPerUse: 5, type: 'sales' },
      { id: 'loc-3', categoryId: 'cat-local', name: 'Local Service Page Architect', description: 'Creates specific landing page copy for each service area/suburb a business serves.', instruction: 'Enter service/suburbs. User enters the main service and list of suburbs; AI generates unique, non-duplicate content for pages like "Plumber in [Suburb A]", "Plumber in [Suburb B]".', systemPrompt: 'Generate unique content for areas.', examples: [], iconName: 'Layout', accessLevel: 'pro', costPerUse: 25, type: 'sales' },
      { id: 'loc-4', categoryId: 'cat-local', name: 'Geofencing Ad Copywriter', description: 'Writes short, punchy notification text for ads triggering when a user enters a specific physical zone.', instruction: 'Select location. User selects a target location (e.g., a competitor\'s store); AI outputs a high-urgency notification text like "Turn left for a better deal!"', systemPrompt: 'Output high-urgency text.', examples: [], iconName: 'Bell', accessLevel: 'basic', costPerUse: 10, type: 'sales' }
    ]
  },
  {
    id: 'cat-pr',
    name: 'PR & Crisis',
    iconName: 'Megaphone',
    tools: [
      { id: 'pr-1', categoryId: 'cat-pr', name: 'Press Release Newsjacker', description: 'Generates a professional press release that ties your brand news to a current trending global event.', instruction: 'Input news. User inputs their news and a trending topic; AI connects the two stories and outputs a formatted press release journalists will actually read.', systemPrompt: 'Connect to trending topic.', examples: [], iconName: 'FileText', accessLevel: 'pro', costPerUse: 30, type: 'hype' },
      { id: 'pr-2', categoryId: 'cat-pr', name: 'Crisis Statement Generator', description: 'Instantly drafts a calm, transparent, and apologetic public statement during a PR crisis.', instruction: 'Describe incident. User describes the incident (e.g., "Site crash", "Bad product batch"); AI outputs a specific "Holding Statement" to calm the public immediately.', systemPrompt: 'Output calm holding statement.', examples: [], iconName: 'Shield', accessLevel: 'premium', costPerUse: 50, type: 'sales' },
      { id: 'pr-3', categoryId: 'cat-pr', name: 'Media Pitch Personalizer', description: 'Creates personalized email pitches to specific journalists or bloggers based on their past articles.', instruction: 'Input journalist. User inputs the journalist\'s name/outlet; AI scans their writing style and drafts a pitch explaining why this story fits their column perfectly.', systemPrompt: 'Draft personalized pitch.', examples: [], iconName: 'Mail', accessLevel: 'pro', costPerUse: 25, type: 'sales' }
    ]
  },
  {
    id: 'cat-game',
    name: 'Gamification',
    iconName: 'Gamepad2',
    tools: [
      { id: 'game-1', categoryId: 'cat-game', name: 'Dynamic "Spin-to-Win" Configurator', description: 'Generates probability logic and copy for a discount wheel based on margins.', instruction: 'Input margin. User inputs max discount margin; AI outputs the slice labels (e.g., "5% Off", "Free Gift") and the mathematical probability for each to protect profits.', systemPrompt: 'Output slice labels and probabilities.', examples: [], iconName: 'Disc', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'game-2', categoryId: 'cat-game', name: 'Cart Progress Bar Copywriter', description: 'Creates "nudge" messages for a checkout progress bar to increase Average Order Value (AOV).', instruction: 'Input threshold. User inputs shipping threshold; AI generates gamified levels (e.g., "Level 1: Unlocked Shipping", "Level 2: Mystery Gift") to encourage adding more items.', systemPrompt: 'Generate gamified levels.', examples: [], iconName: 'BarChart', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'game-3', categoryId: 'cat-game', name: 'Referral Leaderboard Architect', description: 'Designs a competitive referral contest structure with tiered rewards.', instruction: 'Define budget. User defines the budget; AI outputs the contest rules, leaderboard update emails, and specific prizes for the "Top 3" players to spike viral growth.', systemPrompt: 'Output rules and prizes.', examples: [], iconName: 'Award', accessLevel: 'pro', costPerUse: 25, type: 'hype' },
      { id: 'game-4', categoryId: 'cat-game', name: 'Streak & Habit Rewarder', description: 'Builds a logic for "Daily Login" or "Weekly Purchase" streaks to build habit-forming loyalty.', instruction: 'Input business. User inputs the business type (e.g., Coffee Shop); AI creates a "7-Day Streak" plan, defining what the user gets on Day 3, Day 5, and the Grand Prize on Day 7.', systemPrompt: 'Create streak plan.', examples: [], iconName: 'Repeat', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'game-5', categoryId: 'cat-game', name: 'Scarcity "Drop" Countdown', description: 'Generates hype scripts for limited-time product drops or "Flash Sale" events.', instruction: 'Input launch. User inputs the product launch time; AI outputs a sequence of "Level Up" notifications that unlock exclusive early access for fast actors.', systemPrompt: 'Output countdown sequence.', examples: [], iconName: 'Clock', accessLevel: 'basic', costPerUse: 10, type: 'hype' }
    ]
  },
  {
    id: 'cat-community',
    name: 'Community',
    iconName: 'Users',
    tools: [
      { id: 'comm-1', categoryId: 'cat-community', name: '"Pain-to-Product" Insight Miner', description: 'Analyzes community discussions to identify unmet needs and suggests profitable product features.', instruction: 'Upload thread. User uploads a thread export; AI identifies recurring complaints ("I wish this tool did X") and outputs a list of 3 high-demand features or info-products to sell.', systemPrompt: 'Identify needs and suggest features.', examples: [], iconName: 'Search', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'comm-2', categoryId: 'cat-community', name: 'The "Helpful Expert" Sales Replier', description: 'Generates helpful, value-first replies to member questions that subtly bridge to your product.', instruction: 'Paste question. User pastes a member\'s question and their product link; AI writes a detailed answer solving the problem and adds a soft, non-spammy "P.S." linking to the solution.', systemPrompt: 'Write answer with soft pitch.', examples: [], iconName: 'MessageSquare', accessLevel: 'basic', costPerUse: 10, type: 'sales' },
      { id: 'comm-3', categoryId: 'cat-community', name: 'Onboarding Journey Architect', description: 'Creates a 7-day automated message sequence to turn a new silent member into an active contributor.', instruction: 'Define vibe. User defines the community vibe; AI outputs a schedule: Day 1 "Welcome", Day 3 "Introduce Yourself Prompt", Day 7 "First Value Gift" to break the ice.', systemPrompt: 'Output 7-day schedule.', examples: [], iconName: 'Map', accessLevel: 'pro', costPerUse: 20, type: 'sales' },
      { id: 'comm-4', categoryId: 'cat-community', name: 'VIP/Ambassador Scout Script', description: 'Identifies potential "Super Users" and writes a personalized invitation to join a paid or VIP tier.', instruction: 'Input profile. User inputs a member\'s activity profile; AI drafts an exclusive message acknowledging their contributions and offering a special upgrade to the "Inner Circle."', systemPrompt: 'Draft exclusive invite.', examples: [], iconName: 'Star', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'comm-5', categoryId: 'cat-community', name: 'Ritual & Tradition Designer', description: 'Invents recurring weekly events or challenges to keep retention high and churn low.', instruction: 'Input niche. User inputs the niche (e.g., Fitness); AI outputs concepts like "Transformation Tuesday" or "Flex Friday" with specific prompt templates for each week.', systemPrompt: 'Output weekly concepts.', examples: [], iconName: 'Calendar', accessLevel: 'pro', costPerUse: 20, type: 'hype' },
      { id: 'comm-6', categoryId: 'cat-community', name: 'Conflict Resolution Mediator', description: 'Drafts diplomatic, de-escalating responses to heated arguments or rule violations in the group.', instruction: 'Paste conflict. User pastes the conflict text; AI analyzes the sentiment and writes a firm but fair moderation message that enforces rules without alienating members.', systemPrompt: 'Write de-escalating message.', examples: [], iconName: 'Shield', accessLevel: 'basic', costPerUse: 15, type: 'sales' },
      { id: 'comm-7', categoryId: 'cat-community', name: 'AMA & Live Event Monetizer', description: 'Creates a script for live "Ask Me Anything" sessions that includes strategic pitch moments.', instruction: 'Input topic. User inputs the event topic; AI structures the hour: 15 min value, 5 min pitch, 30 min Q&A, and provides the exact "transition scripts" to sell products smoothly.', systemPrompt: 'Structure hour and pitch.', examples: [], iconName: 'Mic', accessLevel: 'pro', costPerUse: 30, type: 'sales' },
      { id: 'comm-8', categoryId: 'cat-community', name: 'Community-Only Launch Teaser', description: 'Generates FOMO-inducing content specifically for community members before a public launch.', instruction: 'Input date. User inputs product launch date; AI writes "Behind the Scenes" posts and "Early Bird" offers that make community members feel privileged and ready to buy.', systemPrompt: 'Write behind-the-scenes posts.', examples: [], iconName: 'Lock', accessLevel: 'basic', costPerUse: 10, type: 'hype' }
    ]
  }
];
