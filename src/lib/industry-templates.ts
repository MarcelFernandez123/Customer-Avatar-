import { IndustryTemplate } from '@/types/avatar';

export const industryTemplates: IndustryTemplate[] = [
  {
    id: 'ecommerce-fashion',
    name: 'E-commerce - Fashion & Apparel',
    industry: 'Fashion & Apparel',
    description: 'Online clothing and fashion retailers targeting style-conscious consumers',
    defaultBusinessInfo: {
      industry: 'Fashion & Apparel',
      niche: 'Online Fashion Retail',
      businessType: 'b2c',
      pricePoint: '$50-200 per item',
    },
    suggestedInterests: [
      'Fashion', 'Online Shopping', 'Style', 'Beauty', 'Instagram',
      'Fashion Magazines', 'Influencer Marketing', 'Sustainable Fashion'
    ],
    commonPainPoints: [
      'Finding clothes that fit well online',
      'Quality uncertainty when buying online',
      'High return rates due to sizing issues',
      'Keeping up with trends affordably',
      'Finding unique pieces that stand out'
    ],
    typicalDemographics: {
      ageRange: { min: 18, max: 45 },
      gender: 'all',
      incomeRange: { min: 35000, max: 100000, currency: 'USD' },
    }
  },
  {
    id: 'saas-b2b',
    name: 'SaaS - B2B Software',
    industry: 'Software & Technology',
    description: 'Business software solutions for companies and teams',
    defaultBusinessInfo: {
      industry: 'Software & Technology',
      niche: 'B2B SaaS',
      businessType: 'b2b',
      pricePoint: '$50-500/month subscription',
    },
    suggestedInterests: [
      'Business Software', 'Productivity', 'Project Management',
      'Automation', 'Cloud Computing', 'Digital Transformation',
      'Remote Work', 'Team Collaboration'
    ],
    commonPainPoints: [
      'Inefficient manual processes',
      'Poor team collaboration',
      'Data silos across departments',
      'Difficulty scaling operations',
      'Integration with existing tools',
      'Training employees on new software'
    ],
    typicalDemographics: {
      ageRange: { min: 25, max: 55 },
      education: ['Bachelor\'s degree', 'Master\'s degree'],
      occupations: ['Manager', 'Director', 'VP', 'C-Suite', 'IT Professional'],
    }
  },
  {
    id: 'local-services-home',
    name: 'Local Services - Home Improvement',
    industry: 'Home Services',
    description: 'Local contractors, renovation, and home improvement services',
    defaultBusinessInfo: {
      industry: 'Home Services',
      niche: 'Home Improvement & Renovation',
      businessType: 'b2c',
      pricePoint: '$500-50000 per project',
    },
    suggestedInterests: [
      'Home Improvement', 'DIY', 'Interior Design', 'Real Estate',
      'Homeownership', 'Gardening', 'HGTV', 'Home Renovation Shows'
    ],
    commonPainPoints: [
      'Finding reliable contractors',
      'Getting accurate quotes',
      'Project delays and cost overruns',
      'Quality concerns with finished work',
      'Difficulty visualizing end results',
      'Coordinating multiple contractors'
    ],
    typicalDemographics: {
      ageRange: { min: 30, max: 65 },
      incomeRange: { min: 60000, max: 200000, currency: 'USD' },
      maritalStatus: ['Married', 'Domestic Partnership'],
      hasChildren: true,
    }
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    industry: 'Health & Wellness',
    description: 'Fitness programs, gyms, and wellness products',
    defaultBusinessInfo: {
      industry: 'Health & Wellness',
      niche: 'Fitness & Personal Training',
      businessType: 'b2c',
      pricePoint: '$30-200/month or $500-2000 programs',
    },
    suggestedInterests: [
      'Fitness', 'Gym', 'Weight Loss', 'Nutrition', 'Yoga',
      'Running', 'CrossFit', 'Wellness', 'Healthy Eating', 'Self-Improvement'
    ],
    commonPainPoints: [
      'Lack of motivation to exercise',
      'Not seeing results',
      'Confusion about proper nutrition',
      'Time constraints for workouts',
      'Previous failed diet attempts',
      'Injury concerns'
    ],
    typicalDemographics: {
      ageRange: { min: 20, max: 55 },
      incomeRange: { min: 40000, max: 150000, currency: 'USD' },
    }
  },
  {
    id: 'education-online',
    name: 'Online Education & Courses',
    industry: 'Education',
    description: 'Online courses, coaching, and educational content',
    defaultBusinessInfo: {
      industry: 'Education',
      niche: 'Online Learning & Courses',
      businessType: 'b2c',
      pricePoint: '$50-2000 per course',
    },
    suggestedInterests: [
      'Online Learning', 'Self-Improvement', 'Career Development',
      'Professional Skills', 'Udemy', 'Coursera', 'LinkedIn Learning',
      'Entrepreneurship', 'Side Hustles'
    ],
    commonPainPoints: [
      'Career stagnation',
      'Skills becoming outdated',
      'Not enough time for traditional education',
      'High cost of formal education',
      'Lack of practical, applicable knowledge',
      'Information overload from free content'
    ],
    typicalDemographics: {
      ageRange: { min: 22, max: 50 },
      education: ['High School', 'Some College', 'Bachelor\'s degree'],
      occupations: ['Professional', 'Career Changer', 'Entrepreneur'],
    }
  },
  {
    id: 'finance-personal',
    name: 'Personal Finance & Investing',
    industry: 'Financial Services',
    description: 'Financial planning, investing apps, and money management',
    defaultBusinessInfo: {
      industry: 'Financial Services',
      niche: 'Personal Finance',
      businessType: 'b2c',
      pricePoint: '$10-100/month or % of AUM',
    },
    suggestedInterests: [
      'Investing', 'Personal Finance', 'Stock Market', 'Cryptocurrency',
      'Financial Independence', 'Retirement Planning', 'Real Estate Investing',
      'Budgeting', 'Passive Income'
    ],
    commonPainPoints: [
      'Not saving enough for retirement',
      'Confusion about where to invest',
      'Fear of making wrong financial decisions',
      'Living paycheck to paycheck',
      'Debt management struggles',
      'Not understanding investment options'
    ],
    typicalDemographics: {
      ageRange: { min: 25, max: 60 },
      incomeRange: { min: 50000, max: 250000, currency: 'USD' },
      education: ['Bachelor\'s degree', 'Master\'s degree'],
    }
  },
  {
    id: 'beauty-skincare',
    name: 'Beauty & Skincare',
    industry: 'Beauty & Personal Care',
    description: 'Skincare products, cosmetics, and beauty treatments',
    defaultBusinessInfo: {
      industry: 'Beauty & Personal Care',
      niche: 'Skincare & Cosmetics',
      businessType: 'b2c',
      pricePoint: '$20-150 per product',
    },
    suggestedInterests: [
      'Skincare', 'Beauty', 'Cosmetics', 'Anti-Aging', 'Natural Beauty',
      'Beauty Influencers', 'Self-Care', 'Dermatology', 'K-Beauty'
    ],
    commonPainPoints: [
      'Skin concerns (acne, aging, sensitivity)',
      'Finding products that actually work',
      'Overwhelmed by too many options',
      'Concerns about ingredients/chemicals',
      'High cost of premium products',
      'Inconsistent results from products'
    ],
    typicalDemographics: {
      ageRange: { min: 18, max: 55 },
      gender: 'female',
      incomeRange: { min: 35000, max: 120000, currency: 'USD' },
    }
  },
  {
    id: 'b2b-marketing',
    name: 'B2B Marketing Services',
    industry: 'Marketing & Advertising',
    description: 'Marketing agencies and marketing technology for businesses',
    defaultBusinessInfo: {
      industry: 'Marketing & Advertising',
      niche: 'B2B Marketing Services',
      businessType: 'b2b',
      pricePoint: '$2000-20000/month retainer',
    },
    suggestedInterests: [
      'Digital Marketing', 'Lead Generation', 'Content Marketing',
      'Marketing Automation', 'HubSpot', 'Salesforce', 'LinkedIn',
      'B2B Sales', 'Growth Marketing'
    ],
    commonPainPoints: [
      'Not generating enough qualified leads',
      'Poor marketing ROI visibility',
      'Ineffective content strategy',
      'Difficulty reaching decision-makers',
      'Long sales cycles',
      'Marketing and sales misalignment'
    ],
    typicalDemographics: {
      ageRange: { min: 28, max: 55 },
      occupations: ['Marketing Manager', 'CMO', 'VP Marketing', 'Business Owner'],
      education: ['Bachelor\'s degree', 'MBA'],
    }
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    industry: 'Real Estate',
    description: 'Real estate agents, property listings, and real estate services',
    defaultBusinessInfo: {
      industry: 'Real Estate',
      niche: 'Residential Real Estate',
      businessType: 'b2c',
      pricePoint: 'Commission-based (2-6% of sale)',
    },
    suggestedInterests: [
      'Real Estate', 'Home Buying', 'Home Selling', 'Mortgages',
      'Property Investment', 'Interior Design', 'Moving', 'First-Time Homebuyers'
    ],
    commonPainPoints: [
      'Finding the right property',
      'Understanding market conditions',
      'Navigating the buying/selling process',
      'Getting financing approved',
      'Negotiating the best price',
      'Trust issues with agents'
    ],
    typicalDemographics: {
      ageRange: { min: 28, max: 65 },
      incomeRange: { min: 60000, max: 300000, currency: 'USD' },
      maritalStatus: ['Married', 'Single', 'Domestic Partnership'],
    }
  },
  {
    id: 'food-restaurant',
    name: 'Food & Restaurant',
    industry: 'Food & Beverage',
    description: 'Restaurants, food delivery, and food products',
    defaultBusinessInfo: {
      industry: 'Food & Beverage',
      niche: 'Restaurant & Food Delivery',
      businessType: 'b2c',
      pricePoint: '$15-50 per order',
    },
    suggestedInterests: [
      'Food', 'Restaurants', 'Cooking', 'Food Delivery', 'Foodies',
      'Healthy Eating', 'Local Dining', 'Food Photography', 'Yelp'
    ],
    commonPainPoints: [
      'Finding good restaurants nearby',
      'Waiting times and convenience',
      'Dietary restrictions and options',
      'Value for money',
      'Consistent food quality',
      'Delivery fees and minimums'
    ],
    typicalDemographics: {
      ageRange: { min: 18, max: 55 },
      incomeRange: { min: 30000, max: 150000, currency: 'USD' },
    }
  },
  {
    id: 'pet-products',
    name: 'Pet Products & Services',
    industry: 'Pet Care',
    description: 'Pet food, supplies, and pet care services',
    defaultBusinessInfo: {
      industry: 'Pet Care',
      niche: 'Pet Products & Supplies',
      businessType: 'b2c',
      pricePoint: '$20-100 per purchase',
    },
    suggestedInterests: [
      'Pets', 'Dogs', 'Cats', 'Pet Care', 'Pet Owners',
      'Animal Lovers', 'Pet Health', 'Pet Adoption', 'Pet Supplies'
    ],
    commonPainPoints: [
      'Finding quality pet food',
      'Pet health concerns',
      'Affordable pet care',
      'Pet behavior issues',
      'Finding reliable pet services',
      'Travel with pets'
    ],
    typicalDemographics: {
      ageRange: { min: 25, max: 65 },
      incomeRange: { min: 40000, max: 150000, currency: 'USD' },
    }
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    industry: 'Travel',
    description: 'Travel agencies, booking platforms, and tourism services',
    defaultBusinessInfo: {
      industry: 'Travel',
      niche: 'Travel & Vacation Planning',
      businessType: 'b2c',
      pricePoint: '$500-5000 per trip',
    },
    suggestedInterests: [
      'Travel', 'Vacation', 'Adventure', 'Luxury Travel', 'Budget Travel',
      'Family Travel', 'Solo Travel', 'Beach Destinations', 'Cultural Travel'
    ],
    commonPainPoints: [
      'Planning complex itineraries',
      'Finding good deals',
      'Hidden fees and costs',
      'Booking confidence and flexibility',
      'Travel safety concerns',
      'Coordinating group travel'
    ],
    typicalDemographics: {
      ageRange: { min: 25, max: 65 },
      incomeRange: { min: 50000, max: 200000, currency: 'USD' },
    }
  },
];

export function getTemplateById(id: string): IndustryTemplate | undefined {
  return industryTemplates.find(t => t.id === id);
}

export function getTemplatesByIndustry(industry: string): IndustryTemplate[] {
  return industryTemplates.filter(t =>
    t.industry.toLowerCase().includes(industry.toLowerCase()) ||
    t.name.toLowerCase().includes(industry.toLowerCase())
  );
}

export function getAllIndustries(): string[] {
  return [...new Set(industryTemplates.map(t => t.industry))];
}
