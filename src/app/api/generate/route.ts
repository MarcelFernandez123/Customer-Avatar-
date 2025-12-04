import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import {
  Avatar,
  BusinessInfo,
  ResearchData,
  Demographics,
  Psychographics,
  PainPoint,
  Goal,
  OnlineBehavior,
  Objection,
  BuyingTrigger,
  CommunicationPreference,
  PlatformTargeting,
  Source
} from '@/types/avatar';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerationRequest {
  businessInfo: BusinessInfo;
  researchData: ResearchData;
  mode: 'quick' | 'comprehensive';
}

async function generateWithClaude(prompt: string, systemPrompt: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('AI generation failed');
  }
}

function parseJSON<T>(jsonString: string): T | null {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleanJson = jsonMatch ? jsonMatch[1] : jsonString;
    return JSON.parse(cleanJson.trim());
  } catch {
    console.error('JSON parsing failed:', jsonString.slice(0, 200));
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { businessInfo, researchData, mode } = await request.json() as GenerationRequest;

    const systemPrompt = `You are an expert marketing strategist and customer research specialist.
Your task is to create highly accurate, data-driven customer avatars based on business and research data.
Always respond with valid JSON matching the exact structure requested.
Be specific, actionable, and base insights on the provided research data.
Focus on creating avatars that can be directly used for advertising targeting.`;

    const basePrompt = `
Business Information:
- Industry: ${businessInfo.industry}
- Niche: ${businessInfo.niche}
- Product/Service: ${businessInfo.productService}
- Business Type: ${businessInfo.businessType}
- Price Point: ${businessInfo.pricePoint}
- USP: ${businessInfo.uniqueSellingProposition}
- Target Geography: ${businessInfo.targetGeography.join(', ')}
${businessInfo.existingCustomerDescription ? `- Existing Customers: ${businessInfo.existingCustomerDescription}` : ''}

Research Data:
- Competitor Insights: ${JSON.stringify(researchData.competitorAnalysis.slice(0, 3))}
- Market Data: ${JSON.stringify(researchData.marketData)}
- Industry Trends: ${researchData.industryTrends.join(', ')}
`;

    // Generate narrative
    const narrativePrompt = `${basePrompt}

Create a compelling 2-3 paragraph customer avatar narrative that tells the story of the ideal customer.
Include their background, daily life, challenges, and what would motivate them to purchase this product/service.
Make it vivid and relatable. Return only the narrative text, no JSON.`;

    const narrative = await generateWithClaude(narrativePrompt, systemPrompt);

    // Generate demographics
    const demographicsPrompt = `${basePrompt}

Generate detailed demographics for this customer avatar. Return ONLY valid JSON in this exact format:
{
  "ageRange": { "min": 25, "max": 45 },
  "gender": "all",
  "locations": ["United States", "Canada"],
  "incomeRange": { "min": 50000, "max": 150000, "currency": "USD" },
  "education": ["Bachelor's degree", "Some college"],
  "occupations": ["Professional", "Manager"],
  "maritalStatus": ["Married", "Single"],
  "hasChildren": true,
  "confidence": 0.85
}`;

    const demographicsJson = await generateWithClaude(demographicsPrompt, systemPrompt);
    const demographics = parseJSON<Demographics>(demographicsJson) || {
      ageRange: { min: 25, max: 55 },
      gender: 'all',
      locations: businessInfo.targetGeography,
      incomeRange: { min: 40000, max: 120000, currency: 'USD' },
      education: ['High School', "Bachelor's degree"],
      occupations: ['Professional', 'Manager', 'Business Owner'],
      maritalStatus: ['Single', 'Married'],
      hasChildren: null,
      confidence: 0.7
    };

    // Generate psychographics
    const psychographicsPrompt = `${basePrompt}

Generate detailed psychographics for this customer avatar. Return ONLY valid JSON in this exact format:
{
  "values": ["Quality", "Convenience", "Value for money"],
  "interests": ["Technology", "Business", "Self-improvement"],
  "lifestyle": ["Busy professional", "Health-conscious"],
  "personalityTraits": ["Analytical", "Achievement-oriented"],
  "attitudes": ["Early adopter", "Research-driven"],
  "confidence": 0.8
}`;

    const psychographicsJson = await generateWithClaude(psychographicsPrompt, systemPrompt);
    const psychographics = parseJSON<Psychographics>(psychographicsJson) || {
      values: ['Quality', 'Convenience', 'Trust'],
      interests: [businessInfo.industry, 'Self-improvement', 'Technology'],
      lifestyle: ['Busy professional'],
      personalityTraits: ['Practical', 'Goal-oriented'],
      attitudes: ['Open to new solutions'],
      confidence: 0.7
    };

    // Generate pain points
    const painPointsPrompt = `${basePrompt}

Generate 5-7 specific pain points for this customer avatar. Return ONLY valid JSON as an array:
[
  {
    "description": "Specific pain point description",
    "severity": "high",
    "frequency": "Daily",
    "source": "Research/Inference"
  }
]
Severity options: low, medium, high, critical`;

    const painPointsJson = await generateWithClaude(painPointsPrompt, systemPrompt);
    const painPoints = parseJSON<PainPoint[]>(painPointsJson) || [
      { description: 'Difficulty finding reliable solutions', severity: 'high', frequency: 'Weekly', source: 'AI Inference' }
    ];

    // Generate goals
    const goalsPrompt = `${basePrompt}

Generate 4-6 goals and aspirations for this customer avatar. Return ONLY valid JSON as an array:
[
  {
    "description": "Goal description",
    "timeframe": "short-term",
    "priority": "high"
  }
]
Timeframe options: immediate, short-term, long-term
Priority options: low, medium, high`;

    const goalsJson = await generateWithClaude(goalsPrompt, systemPrompt);
    const goals = parseJSON<Goal[]>(goalsJson) || [
      { description: 'Improve efficiency and save time', timeframe: 'short-term', priority: 'high' }
    ];

    // Generate online behavior
    const onlineBehaviorPrompt = `${basePrompt}

Generate detailed online behavior profile. Return ONLY valid JSON:
{
  "platforms": [
    { "name": "Facebook", "usageFrequency": "Daily", "primaryUse": "News and entertainment" }
  ],
  "contentTypes": ["Video", "Articles", "Reviews"],
  "peakActivityTimes": ["Evening 7-10pm", "Weekend mornings"],
  "devicePreferences": ["Mobile", "Desktop"],
  "buyingHabits": {
    "frequency": "Monthly",
    "averageOrderValue": "$50-100",
    "preferredPaymentMethods": ["Credit card", "PayPal"],
    "researchBehavior": "Extensive research before purchase"
  },
  "confidence": 0.75
}`;

    const onlineBehaviorJson = await generateWithClaude(onlineBehaviorPrompt, systemPrompt);
    const onlineBehavior = parseJSON<OnlineBehavior>(onlineBehaviorJson) || {
      platforms: [{ name: 'Facebook', usageFrequency: 'Daily', primaryUse: 'Social networking' }],
      contentTypes: ['Video', 'Articles'],
      peakActivityTimes: ['Evening'],
      devicePreferences: ['Mobile', 'Desktop'],
      buyingHabits: {
        frequency: 'Monthly',
        averageOrderValue: '$50-150',
        preferredPaymentMethods: ['Credit card'],
        researchBehavior: 'Researches before buying'
      },
      confidence: 0.7
    };

    // Generate objections
    const objectionsPrompt = `${basePrompt}

Generate 4-6 common objections this customer might have. Return ONLY valid JSON as an array:
[
  {
    "description": "Objection description",
    "category": "price",
    "counterArgument": "How to address this objection"
  }
]
Category options: price, trust, timing, need, competition, other`;

    const objectionsJson = await generateWithClaude(objectionsPrompt, systemPrompt);
    const objections = parseJSON<Objection[]>(objectionsJson) || [
      { description: 'Is this worth the investment?', category: 'price', counterArgument: 'Emphasize ROI and value' }
    ];

    // Generate buying triggers
    const buyingTriggersPrompt = `${basePrompt}

Generate 4-6 buying triggers for this customer. Return ONLY valid JSON as an array:
[
  {
    "trigger": "What triggers the purchase decision",
    "emotionalDriver": "Underlying emotional motivation",
    "urgencyLevel": "high"
  }
]
Urgency options: low, medium, high`;

    const buyingTriggersJson = await generateWithClaude(buyingTriggersPrompt, systemPrompt);
    const buyingTriggers = parseJSON<BuyingTrigger[]>(buyingTriggersJson) || [
      { trigger: 'Problem becomes urgent', emotionalDriver: 'Fear of missing out', urgencyLevel: 'high' }
    ];

    // Generate communication preferences
    const communicationPrompt = `${basePrompt}

Generate communication preferences. Return ONLY valid JSON:
{
  "tone": ["Professional", "Friendly", "Direct"],
  "channels": ["Email", "Social media", "Video"],
  "contentFormats": ["Short videos", "Case studies", "How-to guides"],
  "messagingStyle": "Clear, benefit-focused messaging with social proof"
}`;

    const communicationJson = await generateWithClaude(communicationPrompt, systemPrompt);
    const communicationPreference = parseJSON<CommunicationPreference>(communicationJson) || {
      tone: ['Professional', 'Friendly'],
      channels: ['Email', 'Social media'],
      contentFormats: ['Video', 'Articles'],
      messagingStyle: 'Clear and benefit-focused'
    };

    // Generate platform-specific targeting
    const platformTargetingPrompt = `${basePrompt}

Current Avatar Profile:
- Demographics: ${JSON.stringify(demographics)}
- Psychographics: ${JSON.stringify(psychographics)}
- Online Behavior: ${JSON.stringify(onlineBehavior)}

Generate platform-specific targeting parameters. Return ONLY valid JSON:
{
  "facebook": {
    "interests": [
      { "id": "6003139266461", "name": "Business", "audienceSize": 500000000 }
    ],
    "behaviors": [
      { "id": "6002714895372", "name": "Online buyers" }
    ],
    "demographics": {
      "ageMin": 25,
      "ageMax": 55,
      "genders": [0],
      "locales": ["en_US"],
      "lifeEvents": ["Recently moved"]
    },
    "customAudiences": ["Website visitors", "Email list"],
    "lookalikes": ["1% lookalike of purchasers"],
    "detailedTargetingExpansion": true
  },
  "google": {
    "keywords": [
      { "keyword": "example keyword", "matchType": "phrase", "volume": 10000 }
    ],
    "affinityAudiences": ["Technology Enthusiasts", "Business Professionals"],
    "inMarketAudiences": ["Business Services"],
    "customIntentKeywords": ["buy product", "best solution"],
    "demographics": {
      "ageRanges": ["25-34", "35-44", "45-54"],
      "genders": ["All"],
      "parentalStatus": ["All"],
      "householdIncome": ["Top 30%"]
    },
    "placements": ["youtube.com", "industry-specific sites"]
  },
  "linkedin": {
    "jobTitles": ["Marketing Manager", "Director of Marketing"],
    "jobFunctions": ["Marketing", "Sales"],
    "industries": ["Technology", "Professional Services"],
    "companySizes": ["51-200", "201-500", "501-1000"],
    "seniorities": ["Manager", "Director", "VP"],
    "skills": ["Digital Marketing", "Lead Generation"],
    "groups": ["Digital Marketing Professionals"],
    "interests": ["Marketing Technology"]
  },
  "generic": {
    "primaryAudience": "Description of primary target audience",
    "secondaryAudiences": ["Secondary audience 1", "Secondary audience 2"],
    "keyCharacteristics": ["Key trait 1", "Key trait 2"],
    "exclusions": ["Who to exclude from targeting"]
  }
}`;

    const platformTargetingJson = await generateWithClaude(platformTargetingPrompt, systemPrompt);
    const platformTargeting = parseJSON<PlatformTargeting>(platformTargetingJson) || getDefaultPlatformTargeting(businessInfo, demographics);

    // Compile sources
    const sources: Source[] = [
      { type: 'ai-inference', name: 'Claude Analysis', reliability: 'medium', dataPoint: 'Avatar generation' },
      ...researchData.competitorAnalysis.map(c => ({
        type: 'web' as const,
        name: c.name,
        url: c.url,
        reliability: 'medium' as const,
        dataPoint: 'Competitor analysis'
      })),
      ...researchData.marketData.map(m => ({
        type: 'database' as const,
        name: m.source,
        reliability: m.confidence > 0.8 ? 'high' as const : 'medium' as const,
        dataPoint: m.dataPoint
      }))
    ];

    // Calculate overall confidence
    const confidenceScores = [
      demographics.confidence,
      psychographics.confidence,
      onlineBehavior.confidence,
      researchData.marketData.reduce((acc, m) => acc + m.confidence, 0) / Math.max(researchData.marketData.length, 1)
    ];
    const overallConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;

    // Assemble avatar
    const avatar: Avatar = {
      id: uuidv4(),
      name: `${businessInfo.niche} Avatar - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      businessInfo,
      narrative,
      demographics,
      psychographics,
      painPoints,
      goals,
      onlineBehavior,
      objections,
      buyingTriggers,
      communicationPreference,
      platformTargeting,
      sources,
      overallConfidence: Math.round(overallConfidence * 100) / 100,
      generationMode: mode,
      industry: businessInfo.industry,
      tags: [businessInfo.industry, businessInfo.businessType, businessInfo.niche],
      isTemplate: false
    };

    return NextResponse.json({
      success: true,
      avatar,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Avatar generation failed' },
      { status: 500 }
    );
  }
}

function getDefaultPlatformTargeting(businessInfo: BusinessInfo, demographics: Demographics): PlatformTargeting {
  return {
    facebook: {
      interests: [
        { id: '6003139266461', name: businessInfo.industry, audienceSize: 50000000 }
      ],
      behaviors: [
        { id: '6002714895372', name: 'Engaged Shoppers' }
      ],
      demographics: {
        ageMin: demographics.ageRange.min,
        ageMax: demographics.ageRange.max,
        genders: demographics.gender === 'all' ? [0] : demographics.gender === 'male' ? [1] : [2],
        locales: ['en_US'],
        lifeEvents: []
      },
      customAudiences: ['Website visitors'],
      lookalikes: ['1% Lookalike of customers'],
      detailedTargetingExpansion: true
    },
    google: {
      keywords: [
        { keyword: businessInfo.productService, matchType: 'phrase', volume: 10000 },
        { keyword: `best ${businessInfo.niche}`, matchType: 'broad', volume: 5000 }
      ],
      affinityAudiences: ['Technology Enthusiasts'],
      inMarketAudiences: [businessInfo.industry],
      customIntentKeywords: [`buy ${businessInfo.productService}`, `${businessInfo.niche} reviews`],
      demographics: {
        ageRanges: ['25-34', '35-44', '45-54'],
        genders: ['All'],
        parentalStatus: ['All'],
        householdIncome: ['Top 50%']
      },
      placements: []
    },
    linkedin: {
      jobTitles: demographics.occupations,
      jobFunctions: ['Marketing', 'Sales', 'Operations'],
      industries: [businessInfo.industry],
      companySizes: ['11-50', '51-200', '201-500'],
      seniorities: ['Manager', 'Director', 'VP'],
      skills: [],
      groups: [],
      interests: [businessInfo.industry]
    },
    generic: {
      primaryAudience: `${demographics.ageRange.min}-${demographics.ageRange.max} year old ${businessInfo.businessType === 'b2b' ? 'professionals' : 'consumers'} interested in ${businessInfo.niche}`,
      secondaryAudiences: ['Early adopters', 'Value seekers'],
      keyCharacteristics: ['Research-driven', 'Quality-focused'],
      exclusions: ['Existing customers', 'Competitors']
    }
  };
}
