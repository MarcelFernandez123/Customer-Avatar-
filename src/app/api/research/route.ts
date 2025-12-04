import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { BusinessInfo, ResearchData, CompetitorInsight, MarketInsight } from '@/types/avatar';

// Web scraping function
async function scrapeWebsite(url: string): Promise<{ title: string; description: string; content: string; headings: string[] }> {
  try {
    // Use ScrapingBee if available, otherwise direct fetch
    const scrapingBeeKey = process.env.SCRAPINGBEE_API_KEY;

    let html: string;

    if (scrapingBeeKey) {
      const response = await fetch(
        `https://app.scrapingbee.com/api/v1/?api_key=${scrapingBeeKey}&url=${encodeURIComponent(url)}&render_js=false`
      );
      html = await response.text();
    } else {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000)
      });
      html = await response.text();
    }

    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, footer, header').remove();

    const title = $('title').text() || $('h1').first().text() || '';
    const description = $('meta[name="description"]').attr('content') ||
                       $('meta[property="og:description"]').attr('content') || '';

    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    // Get main content
    const content = $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 5000);

    return { title, description, content, headings };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return { title: '', description: '', content: '', headings: [] };
  }
}

// Analyze competitor from scraped data
function analyzeCompetitor(url: string, scraped: { title: string; description: string; content: string; headings: string[] }): CompetitorInsight {
  const content = scraped.content.toLowerCase();

  // Extract value propositions from headings
  const uniqueValueProps = scraped.headings
    .filter(h => h.length > 10 && h.length < 100)
    .slice(0, 5);

  // Extract messaging themes
  const messaging = scraped.headings
    .filter(h => /free|save|best|top|#1|exclusive|limited|guarantee/i.test(h))
    .slice(0, 3);

  // Detect target audience hints from content
  let targetAudience = 'General audience';
  if (content.includes('business') || content.includes('enterprise') || content.includes('team')) {
    targetAudience = 'B2B / Business professionals';
  } else if (content.includes('women') || content.includes('her') || content.includes('she')) {
    targetAudience = 'Women';
  } else if (content.includes('men') || content.includes('him') || content.includes('his')) {
    targetAudience = 'Men';
  } else if (content.includes('parent') || content.includes('family') || content.includes('kid')) {
    targetAudience = 'Parents / Families';
  }

  return {
    name: scraped.title || new URL(url).hostname,
    url,
    targetAudience,
    messaging: messaging.length ? messaging : ['Value-focused messaging'],
    uniqueValueProps: uniqueValueProps.length ? uniqueValueProps : ['Quality products/services'],
    socialPresence: []
  };
}

// Generate market insights based on industry
function generateMarketInsights(businessInfo: BusinessInfo): MarketInsight[] {
  const insights: MarketInsight[] = [];
  const industry = businessInfo.industry.toLowerCase();

  // Industry-specific insights
  const industryInsights: Record<string, MarketInsight[]> = {
    'fashion': [
      { category: 'Market Size', dataPoint: 'Global fashion e-commerce market', value: '$759.5 billion (2024)', source: 'Industry Reports', confidence: 0.85 },
      { category: 'Growth Rate', dataPoint: 'Annual growth rate', value: '10.3% CAGR', source: 'Market Analysis', confidence: 0.8 },
      { category: 'Consumer Behavior', dataPoint: 'Mobile shopping preference', value: '73% of fashion purchases via mobile', source: 'Consumer Research', confidence: 0.75 },
    ],
    'saas': [
      { category: 'Market Size', dataPoint: 'Global SaaS market', value: '$232 billion (2024)', source: 'Industry Reports', confidence: 0.85 },
      { category: 'Growth Rate', dataPoint: 'Annual growth rate', value: '18% CAGR', source: 'Market Analysis', confidence: 0.8 },
      { category: 'Buyer Behavior', dataPoint: 'Average evaluation time', value: '3-6 months for enterprise', source: 'Sales Research', confidence: 0.7 },
    ],
    'health': [
      { category: 'Market Size', dataPoint: 'Digital health & fitness market', value: '$96.3 billion (2024)', source: 'Industry Reports', confidence: 0.85 },
      { category: 'Consumer Trend', dataPoint: 'Home workout preference', value: '48% prefer home workouts', source: 'Consumer Research', confidence: 0.75 },
      { category: 'Spending', dataPoint: 'Average annual fitness spending', value: '$155/month average', source: 'Market Analysis', confidence: 0.7 },
    ],
    'real estate': [
      { category: 'Market Trend', dataPoint: 'Online property search', value: '97% start search online', source: 'Industry Reports', confidence: 0.9 },
      { category: 'Buyer Behavior', dataPoint: 'Average search duration', value: '10 weeks average', source: 'Consumer Research', confidence: 0.75 },
      { category: 'Digital Adoption', dataPoint: 'Virtual tour preference', value: '63% prefer virtual tours first', source: 'Market Analysis', confidence: 0.7 },
    ],
    'education': [
      { category: 'Market Size', dataPoint: 'Online education market', value: '$185 billion (2024)', source: 'Industry Reports', confidence: 0.85 },
      { category: 'Growth Rate', dataPoint: 'Annual growth rate', value: '14% CAGR', source: 'Market Analysis', confidence: 0.8 },
      { category: 'Completion Rate', dataPoint: 'Average course completion', value: '15% for free, 60% for paid', source: 'Platform Data', confidence: 0.7 },
    ],
  };

  // Find matching industry insights
  for (const [key, industryData] of Object.entries(industryInsights)) {
    if (industry.includes(key)) {
      insights.push(...industryData);
      break;
    }
  }

  // Generic insights if no specific match
  if (insights.length === 0) {
    insights.push(
      { category: 'Digital Adoption', dataPoint: 'Online research before purchase', value: '81% of consumers', source: 'Consumer Research', confidence: 0.85 },
      { category: 'Social Influence', dataPoint: 'Trust peer reviews', value: '92% trust recommendations', source: 'Market Analysis', confidence: 0.8 },
      { category: 'Mobile Usage', dataPoint: 'Mobile commerce growth', value: '25% YoY increase', source: 'Industry Reports', confidence: 0.75 }
    );
  }

  // Add business type specific insights
  if (businessInfo.businessType === 'b2b') {
    insights.push(
      { category: 'B2B Behavior', dataPoint: 'Research before contact', value: '70% of journey before sales contact', source: 'B2B Research', confidence: 0.8 },
      { category: 'Decision Making', dataPoint: 'Average stakeholders involved', value: '6-10 people in buying committee', source: 'Sales Research', confidence: 0.75 }
    );
  }

  return insights;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessInfo, mode = 'comprehensive' } = body as { businessInfo: BusinessInfo; mode: 'quick' | 'comprehensive' };

    const researchData: ResearchData = {
      competitorAnalysis: [],
      marketData: [],
      socialInsights: [],
      industryTrends: []
    };

    // Analyze competitors if provided
    if (businessInfo.competitors && businessInfo.competitors.length > 0) {
      const competitorUrls = businessInfo.competitors
        .filter(c => c.startsWith('http'))
        .slice(0, mode === 'quick' ? 2 : 5);

      const scrapingPromises = competitorUrls.map(async (url) => {
        const scraped = await scrapeWebsite(url);
        return analyzeCompetitor(url, scraped);
      });

      researchData.competitorAnalysis = await Promise.all(scrapingPromises);
    }

    // Generate market insights
    researchData.marketData = generateMarketInsights(businessInfo);

    // Generate industry trends
    const trendKeywords = [
      'personalization', 'AI integration', 'sustainability',
      'mobile-first', 'social commerce', 'subscription models',
      'video content', 'influencer marketing', 'privacy-focused'
    ];

    researchData.industryTrends = trendKeywords
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(trend => `${businessInfo.industry}: ${trend} trend growing`);

    // Generate social insights based on business type
    const platforms = businessInfo.businessType === 'b2b'
      ? ['LinkedIn', 'Twitter', 'YouTube']
      : ['Facebook', 'Instagram', 'TikTok', 'Pinterest'];

    researchData.socialInsights = platforms.map(platform => ({
      platform,
      insight: `High engagement potential for ${businessInfo.niche} content`,
      relevance: 'high' as const
    }));

    return NextResponse.json({
      success: true,
      data: researchData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { success: false, error: 'Research failed' },
      { status: 500 }
    );
  }
}
