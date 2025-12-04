# AvatarGen - Marketing Target Avatar Research & Generator Tool

A production-ready web application that helps performance marketers quickly research and generate accurate, data-driven customer avatars for marketing campaigns.

## Features

### Core Functionality

- **Avatar Research Module**: Automated market research, competitor analysis, and trend identification
- **AI-Powered Generation**: Creates comprehensive customer avatars using GPT-4
- **Platform-Specific Targeting**: Ready-to-use targeting parameters for Facebook, Google, and LinkedIn
- **Industry Templates**: Pre-configured templates for 12+ common industries
- **Quick & Comprehensive Modes**: Balance speed vs. depth based on your needs

### Avatar Components

Each generated avatar includes:

- **Demographics**: Age, gender, location, income, education, occupation
- **Psychographics**: Values, interests, lifestyle, personality traits
- **Pain Points**: Identified challenges with severity ratings
- **Goals & Aspirations**: Short and long-term objectives
- **Online Behavior**: Platform usage, content preferences, buying habits
- **Objections & Counter-arguments**: Common concerns and how to address them
- **Buying Triggers**: What motivates purchase decisions
- **Communication Preferences**: Tone, channels, and content formats

### Platform Targeting Output

- **Facebook/Meta Ads**: Interest targeting, behaviors, demographics, custom audience suggestions
- **Google Ads**: Keywords with match types, affinity audiences, in-market audiences
- **LinkedIn Ads**: Job titles, industries, company sizes, seniorities

### Management Features

- Save and manage multiple avatars
- Search and filter saved avatars
- Compare up to 3 avatars side-by-side
- Duplicate avatars for variations
- Export as JSON or CSV

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persistence
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude (Claude Sonnet 4)
- **Web Scraping**: Cheerio (with optional ScrapingBee integration)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for Claude)
- Supabase account (optional for persistence)

### Installation

1. Clone the repository:
```bash
cd avatar-generator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
```env
# Required
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional - for database persistence
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional - for enhanced web scraping
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key_here

# Optional - for Meta Ads API integration
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
META_ACCESS_TOKEN=your_meta_access_token_here
```

4. Set up Supabase database (optional):
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/supabase.ts` in the SQL editor

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Usage Guide

### Creating an Avatar

1. Click "New Avatar" from the dashboard
2. Select an industry template (optional)
3. Fill in your business information:
   - Industry and niche
   - Product/service description
   - Business type (B2B/B2C)
   - Price point
   - Unique selling proposition
   - Target geography
   - Competitor URLs (optional)

4. Choose generation mode:
   - **Quick Generate**: 2-3 minutes, basic research
   - **Comprehensive**: 5-10 minutes, detailed analysis

5. Review and save your generated avatar

### Using Generated Targeting

#### Facebook Ads
1. Go to Facebook Ads Manager
2. Create a new ad set
3. In detailed targeting, use the interests and behaviors from the avatar
4. Set age range and gender as specified
5. Copy custom audience suggestions for lookalike creation

#### Google Ads
1. Create a new campaign
2. Use the keywords with specified match types
3. Add affinity and in-market audiences from the avatar
4. Set up custom intent audiences with the provided keywords

#### LinkedIn Ads
1. Create a new campaign
2. Use job titles, industries, and company sizes from targeting
3. Add seniority levels and job functions
4. Refine with skills and interests

### Exporting Data

- **JSON Export**: Complete avatar data for backup or import
- **CSV Export**: Targeting data in spreadsheet format
- **Copy to Clipboard**: Quick copy of platform-specific targeting

## Project Structure

```
avatar-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── avatars/        # Avatar CRUD endpoints
│   │   │   ├── generate/       # AI generation endpoint
│   │   │   └── research/       # Research/scraping endpoint
│   │   ├── templates/          # Templates page
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── avatar/             # Avatar-related components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── industry-templates.ts
│   │   └── supabase.ts
│   ├── store/
│   │   └── avatarStore.ts      # Zustand store
│   └── types/
│       └── avatar.ts           # TypeScript definitions
├── .env.local
├── package.json
└── README.md
```

## API Reference

### POST /api/research
Research market data and competitors.

```typescript
{
  businessInfo: BusinessInfo,
  mode: 'quick' | 'comprehensive'
}
```

### POST /api/generate
Generate a complete avatar.

```typescript
{
  businessInfo: BusinessInfo,
  researchData: ResearchData,
  mode: 'quick' | 'comprehensive'
}
```

### GET /api/avatars
List all saved avatars.

Query params: `industry`, `isTemplate`, `search`

### POST /api/avatars
Save a new avatar.

### GET /api/avatars/[id]
Get a specific avatar.

### PUT /api/avatars/[id]
Update an avatar.

### DELETE /api/avatars/[id]
Delete an avatar.

## Industry Templates

Pre-configured templates available:
- E-commerce - Fashion & Apparel
- SaaS - B2B Software
- Local Services - Home Improvement
- Health & Fitness
- Online Education & Courses
- Personal Finance & Investing
- Beauty & Skincare
- B2B Marketing Services
- Real Estate
- Food & Restaurant
- Pet Products & Services
- Travel & Tourism

## Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `SCRAPINGBEE_API_KEY` | No | ScrapingBee API for reliable scraping |
| `META_APP_ID` | No | Facebook app ID |
| `META_APP_SECRET` | No | Facebook app secret |
| `META_ACCESS_TOKEN` | No | Facebook access token |

## Performance

- **Quick Generate**: ~2-3 minutes
- **Comprehensive Generate**: ~5-10 minutes
- Avatar data cached locally using Zustand persist
- Research cache available in Supabase (24-hour expiry)

## Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues and feature requests, please open a GitHub issue.
