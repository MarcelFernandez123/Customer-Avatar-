// Core Avatar Types

export interface Demographics {
  ageRange: { min: number; max: number };
  gender: 'male' | 'female' | 'all' | 'other';
  locations: string[];
  incomeRange: { min: number; max: number; currency: string };
  education: string[];
  occupations: string[];
  maritalStatus: string[];
  hasChildren: boolean | null;
  confidence: number;
}

export interface Psychographics {
  values: string[];
  interests: string[];
  lifestyle: string[];
  personalityTraits: string[];
  attitudes: string[];
  confidence: number;
}

export interface PainPoint {
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: string;
  source: string;
}

export interface Goal {
  description: string;
  timeframe: 'immediate' | 'short-term' | 'long-term';
  priority: 'low' | 'medium' | 'high';
}

export interface OnlineBehavior {
  platforms: {
    name: string;
    usageFrequency: string;
    primaryUse: string;
  }[];
  contentTypes: string[];
  peakActivityTimes: string[];
  devicePreferences: string[];
  buyingHabits: {
    frequency: string;
    averageOrderValue: string;
    preferredPaymentMethods: string[];
    researchBehavior: string;
  };
  confidence: number;
}

export interface Objection {
  description: string;
  category: 'price' | 'trust' | 'timing' | 'need' | 'competition' | 'other';
  counterArgument: string;
}

export interface BuyingTrigger {
  trigger: string;
  emotionalDriver: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface CommunicationPreference {
  tone: string[];
  channels: string[];
  contentFormats: string[];
  messagingStyle: string;
}

export interface PlatformTargeting {
  facebook: FacebookTargeting;
  google: GoogleTargeting;
  linkedin: LinkedInTargeting;
  generic: GenericTargeting;
}

export interface FacebookTargeting {
  interests: { id: string; name: string; audienceSize?: number }[];
  behaviors: { id: string; name: string }[];
  demographics: {
    ageMin: number;
    ageMax: number;
    genders: number[];
    locales: string[];
    lifeEvents?: string[];
  };
  customAudiences: string[];
  lookalikes: string[];
  detailedTargetingExpansion: boolean;
}

export interface GoogleTargeting {
  keywords: { keyword: string; matchType: 'broad' | 'phrase' | 'exact'; volume?: number }[];
  affinityAudiences: string[];
  inMarketAudiences: string[];
  customIntentKeywords: string[];
  demographics: {
    ageRanges: string[];
    genders: string[];
    parentalStatus: string[];
    householdIncome: string[];
  };
  placements: string[];
}

export interface LinkedInTargeting {
  jobTitles: string[];
  jobFunctions: string[];
  industries: string[];
  companySizes: string[];
  seniorities: string[];
  skills: string[];
  groups: string[];
  interests: string[];
}

export interface GenericTargeting {
  primaryAudience: string;
  secondaryAudiences: string[];
  keyCharacteristics: string[];
  exclusions: string[];
}

export interface Avatar {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;

  // Input data
  businessInfo: BusinessInfo;

  // Generated avatar data
  narrative: string;
  demographics: Demographics;
  psychographics: Psychographics;
  painPoints: PainPoint[];
  goals: Goal[];
  onlineBehavior: OnlineBehavior;
  objections: Objection[];
  buyingTriggers: BuyingTrigger[];
  communicationPreference: CommunicationPreference;
  platformTargeting: PlatformTargeting;

  // Metadata
  sources: Source[];
  overallConfidence: number;
  generationMode: 'quick' | 'comprehensive';
  industry: string;
  tags: string[];
  isTemplate: boolean;
}

export interface BusinessInfo {
  industry: string;
  niche: string;
  productService: string;
  businessType: 'b2b' | 'b2c' | 'both';
  pricePoint: string;
  uniqueSellingProposition: string;
  competitors: string[];
  targetGeography: string[];
  existingCustomerDescription?: string;
}

export interface Source {
  type: 'web' | 'api' | 'database' | 'ai-inference';
  name: string;
  url?: string;
  reliability: 'high' | 'medium' | 'low';
  dataPoint: string;
}

export interface ResearchData {
  competitorAnalysis: CompetitorInsight[];
  marketData: MarketInsight[];
  socialInsights: SocialInsight[];
  industryTrends: string[];
}

export interface CompetitorInsight {
  name: string;
  url: string;
  targetAudience: string;
  messaging: string[];
  uniqueValueProps: string[];
  socialPresence: {
    platform: string;
    followers?: number;
    engagement?: string;
  }[];
}

export interface MarketInsight {
  category: string;
  dataPoint: string;
  value: string;
  source: string;
  confidence: number;
}

export interface SocialInsight {
  platform: string;
  insight: string;
  relevance: 'high' | 'medium' | 'low';
}

// Industry Template
export interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  defaultBusinessInfo: Partial<BusinessInfo>;
  suggestedInterests: string[];
  commonPainPoints: string[];
  typicalDemographics: Partial<Demographics>;
}

// Export formats
export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv';
  includeSections: {
    narrative: boolean;
    demographics: boolean;
    psychographics: boolean;
    painPoints: boolean;
    goals: boolean;
    onlineBehavior: boolean;
    objections: boolean;
    buyingTriggers: boolean;
    platformTargeting: boolean;
    sources: boolean;
  };
  platforms: ('facebook' | 'google' | 'linkedin' | 'generic')[];
}
