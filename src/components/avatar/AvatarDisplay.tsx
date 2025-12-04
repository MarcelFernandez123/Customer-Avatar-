'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types/avatar';
import { Card, CardHeader, CardSection } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, ConfidenceBadge } from '../ui/Badge';
import { Tabs, TabList, Tab, TabPanel } from '../ui/Tabs';
import { Modal } from '../ui/Modal';
import {
  User,
  Brain,
  AlertTriangle,
  Target,
  Globe,
  MessageSquare,
  TrendingUp,
  Shield,
  Facebook,
  Chrome,
  Linkedin,
  FileDown,
  Save,
  Copy,
  Edit3,
  Share2,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AvatarDisplayProps {
  avatar: Avatar;
  onSave?: (avatar: Avatar) => void;
  onEdit?: (avatar: Avatar) => void;
  showActions?: boolean;
}

export function AvatarDisplay({ avatar, onSave, onEdit, showActions = true }: AvatarDisplayProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(avatar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${avatar.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Avatar exported as JSON');
  };

  const exportTargetingAsCSV = () => {
    const rows = [
      ['Platform', 'Type', 'Value'],
      // Facebook
      ...avatar.platformTargeting.facebook.interests.map(i => ['Facebook', 'Interest', i.name]),
      ...avatar.platformTargeting.facebook.behaviors.map(b => ['Facebook', 'Behavior', b.name]),
      // Google
      ...avatar.platformTargeting.google.keywords.map(k => ['Google', 'Keyword', k.keyword]),
      ...avatar.platformTargeting.google.affinityAudiences.map(a => ['Google', 'Affinity', a]),
      ...avatar.platformTargeting.google.inMarketAudiences.map(i => ['Google', 'In-Market', i]),
      // LinkedIn
      ...avatar.platformTargeting.linkedin.jobTitles.map(j => ['LinkedIn', 'Job Title', j]),
      ...avatar.platformTargeting.linkedin.industries.map(i => ['LinkedIn', 'Industry', i]),
    ];

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${avatar.name.replace(/\s+/g, '-').toLowerCase()}-targeting.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Targeting exported as CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{avatar.name}</h1>
            <ConfidenceBadge confidence={avatar.overallConfidence} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{avatar.industry}</Badge>
            <Badge variant={avatar.businessInfo.businessType === 'b2b' ? 'info' : 'default'}>
              {avatar.businessInfo.businessType.toUpperCase()}
            </Badge>
            <Badge variant={avatar.generationMode === 'quick' ? 'warning' : 'success'}>
              {avatar.generationMode === 'quick' ? 'Quick' : 'Comprehensive'}
            </Badge>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" icon={<Edit3 className="w-4 h-4" />} onClick={() => onEdit(avatar)}>
                Edit
              </Button>
            )}
            {onSave && (
              <Button variant="outline" size="sm" icon={<Save className="w-4 h-4" />} onClick={() => onSave(avatar)}>
                Save
              </Button>
            )}
            <Button variant="outline" size="sm" icon={<Share2 className="w-4 h-4" />} onClick={() => setShowExportModal(true)}>
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Narrative */}
      <Card>
        <CardHeader
          title="Avatar Story"
          subtitle="A narrative description of your ideal customer"
          icon={<User className="w-5 h-5" />}
        />
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {avatar.narrative}
          </p>
        </div>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultTab="demographics">
        <TabList>
          <Tab value="demographics" icon={<User className="w-4 h-4" />}>Demographics</Tab>
          <Tab value="psychographics" icon={<Brain className="w-4 h-4" />}>Psychographics</Tab>
          <Tab value="painpoints" icon={<AlertTriangle className="w-4 h-4" />}>Pain Points</Tab>
          <Tab value="behavior" icon={<Globe className="w-4 h-4" />}>Online Behavior</Tab>
          <Tab value="targeting" icon={<Target className="w-4 h-4" />}>Targeting</Tab>
        </TabList>

        {/* Demographics Panel */}
        <TabPanel value="demographics" className="mt-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Demographics</h3>
              <ConfidenceBadge confidence={avatar.demographics.confidence} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSection title="Age Range">
                <p className="text-slate-700">{avatar.demographics.ageRange.min} - {avatar.demographics.ageRange.max} years</p>
              </CardSection>
              <CardSection title="Gender">
                <p className="text-slate-700 capitalize">{avatar.demographics.gender}</p>
              </CardSection>
              <CardSection title="Locations">
                <div className="flex flex-wrap gap-1">
                  {avatar.demographics.locations.map((loc, i) => (
                    <Badge key={i}>{loc}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Income Range">
                <p className="text-slate-700">
                  {avatar.demographics.incomeRange.currency} {avatar.demographics.incomeRange.min.toLocaleString()} - {avatar.demographics.incomeRange.max.toLocaleString()}
                </p>
              </CardSection>
              <CardSection title="Education">
                <div className="flex flex-wrap gap-1">
                  {avatar.demographics.education.map((edu, i) => (
                    <Badge key={i}>{edu}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Occupations">
                <div className="flex flex-wrap gap-1">
                  {avatar.demographics.occupations.map((occ, i) => (
                    <Badge key={i}>{occ}</Badge>
                  ))}
                </div>
              </CardSection>
            </div>
          </Card>
        </TabPanel>

        {/* Psychographics Panel */}
        <TabPanel value="psychographics" className="mt-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Psychographics</h3>
              <ConfidenceBadge confidence={avatar.psychographics.confidence} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSection title="Values">
                <div className="flex flex-wrap gap-1">
                  {avatar.psychographics.values.map((v, i) => (
                    <Badge key={i} variant="info">{v}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Interests">
                <div className="flex flex-wrap gap-1">
                  {avatar.psychographics.interests.map((v, i) => (
                    <Badge key={i}>{v}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Lifestyle">
                <div className="flex flex-wrap gap-1">
                  {avatar.psychographics.lifestyle.map((v, i) => (
                    <Badge key={i} variant="success">{v}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Personality Traits">
                <div className="flex flex-wrap gap-1">
                  {avatar.psychographics.personalityTraits.map((v, i) => (
                    <Badge key={i} variant="warning">{v}</Badge>
                  ))}
                </div>
              </CardSection>
            </div>
          </Card>

          {/* Goals */}
          <Card className="mt-4">
            <CardHeader title="Goals & Aspirations" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="space-y-3">
              {avatar.goals.map((goal, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Target className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-slate-700">{goal.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge size="sm">{goal.timeframe}</Badge>
                      <Badge size="sm" variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'default'}>
                        {goal.priority} priority
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabPanel>

        {/* Pain Points Panel */}
        <TabPanel value="painpoints" className="mt-6 space-y-4">
          <Card>
            <CardHeader title="Pain Points & Challenges" icon={<AlertTriangle className="w-5 h-5" />} />
            <div className="space-y-3">
              {avatar.painPoints.map((pain, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    pain.severity === 'critical' ? 'text-red-600' :
                    pain.severity === 'high' ? 'text-red-500' :
                    pain.severity === 'medium' ? 'text-yellow-500' : 'text-slate-400'
                  }`} />
                  <div>
                    <p className="text-slate-700">{pain.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge size="sm" variant={pain.severity === 'critical' || pain.severity === 'high' ? 'danger' : 'warning'}>
                        {pain.severity}
                      </Badge>
                      <Badge size="sm">{pain.frequency}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Objections */}
          <Card>
            <CardHeader title="Common Objections" icon={<Shield className="w-5 h-5" />} />
            <div className="space-y-3">
              {avatar.objections.map((obj, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400">&ldquo;</span>
                    <p className="text-slate-700 italic">{obj.description}</p>
                    <span className="text-slate-400">&rdquo;</span>
                  </div>
                  <div className="mt-2 pl-4 border-l-2 border-indigo-200">
                    <p className="text-sm text-indigo-700">
                      <span className="font-medium">Counter:</span> {obj.counterArgument}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Buying Triggers */}
          <Card>
            <CardHeader title="Buying Triggers" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {avatar.buyingTriggers.map((trigger, i) => (
                <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="font-medium text-slate-900">{trigger.trigger}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    <span className="text-green-700">Emotion:</span> {trigger.emotionalDriver}
                  </p>
                  <Badge size="sm" variant={trigger.urgencyLevel === 'high' ? 'danger' : 'warning'} className="mt-2">
                    {trigger.urgencyLevel} urgency
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabPanel>

        {/* Online Behavior Panel */}
        <TabPanel value="behavior" className="mt-6 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Online Behavior</h3>
              <ConfidenceBadge confidence={avatar.onlineBehavior.confidence} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CardSection title="Platforms Used">
                <div className="space-y-2">
                  {avatar.onlineBehavior.platforms.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="font-medium text-slate-700">{p.name}</span>
                      <div className="flex gap-2">
                        <Badge size="sm">{p.usageFrequency}</Badge>
                        <Badge size="sm" variant="info">{p.primaryUse}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardSection>

              <CardSection title="Content Types">
                <div className="flex flex-wrap gap-1">
                  {avatar.onlineBehavior.contentTypes.map((c, i) => (
                    <Badge key={i}>{c}</Badge>
                  ))}
                </div>
              </CardSection>

              <CardSection title="Peak Activity Times">
                <div className="flex flex-wrap gap-1">
                  {avatar.onlineBehavior.peakActivityTimes.map((t, i) => (
                    <Badge key={i} variant="info">{t}</Badge>
                  ))}
                </div>
              </CardSection>

              <CardSection title="Device Preferences">
                <div className="flex flex-wrap gap-1">
                  {avatar.onlineBehavior.devicePreferences.map((d, i) => (
                    <Badge key={i}>{d}</Badge>
                  ))}
                </div>
              </CardSection>
            </div>
          </Card>

          <Card>
            <CardHeader title="Buying Habits" icon={<TrendingUp className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Purchase Frequency</p>
                <p className="font-medium text-slate-900">{avatar.onlineBehavior.buyingHabits.frequency}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Average Order Value</p>
                <p className="font-medium text-slate-900">{avatar.onlineBehavior.buyingHabits.averageOrderValue}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Research Behavior</p>
                <p className="font-medium text-slate-900">{avatar.onlineBehavior.buyingHabits.researchBehavior}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Payment Methods</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {avatar.onlineBehavior.buyingHabits.preferredPaymentMethods.map((m, i) => (
                    <Badge key={i} size="sm">{m}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Communication Preferences" icon={<MessageSquare className="w-5 h-5" />} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSection title="Preferred Tone">
                <div className="flex flex-wrap gap-1">
                  {avatar.communicationPreference.tone.map((t, i) => (
                    <Badge key={i}>{t}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Preferred Channels">
                <div className="flex flex-wrap gap-1">
                  {avatar.communicationPreference.channels.map((c, i) => (
                    <Badge key={i}>{c}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Content Formats" className="md:col-span-2">
                <div className="flex flex-wrap gap-1">
                  {avatar.communicationPreference.contentFormats.map((f, i) => (
                    <Badge key={i} variant="info">{f}</Badge>
                  ))}
                </div>
              </CardSection>
              <CardSection title="Messaging Style" className="md:col-span-2">
                <p className="text-slate-700">{avatar.communicationPreference.messagingStyle}</p>
              </CardSection>
            </div>
          </Card>
        </TabPanel>

        {/* Platform Targeting Panel */}
        <TabPanel value="targeting" className="mt-6">
          <Tabs defaultTab="facebook">
            <TabList>
              <Tab value="facebook" icon={<Facebook className="w-4 h-4" />}>Facebook</Tab>
              <Tab value="google" icon={<Chrome className="w-4 h-4" />}>Google</Tab>
              <Tab value="linkedin" icon={<Linkedin className="w-4 h-4" />}>LinkedIn</Tab>
            </TabList>

            {/* Facebook Targeting */}
            <TabPanel value="facebook" className="mt-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Facebook/Meta Targeting</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied === 'fb' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={() => copyToClipboard(JSON.stringify(avatar.platformTargeting.facebook, null, 2), 'fb')}
                  >
                    Copy JSON
                  </Button>
                </div>

                <div className="space-y-4">
                  <CardSection title="Demographics">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-slate-500">Age</p>
                        <p className="font-medium">{avatar.platformTargeting.facebook.demographics.ageMin} - {avatar.platformTargeting.facebook.demographics.ageMax}</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-slate-500">Gender</p>
                        <p className="font-medium">{avatar.platformTargeting.facebook.demographics.genders.includes(0) ? 'All' : avatar.platformTargeting.facebook.demographics.genders.includes(1) ? 'Male' : 'Female'}</p>
                      </div>
                    </div>
                  </CardSection>

                  <CardSection title="Interests">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.facebook.interests.map((interest, i) => (
                        <div key={i} className="px-3 py-1.5 bg-blue-100 rounded-full text-sm">
                          <span className="font-medium text-blue-700">{interest.name}</span>
                          {interest.audienceSize && (
                            <span className="text-blue-500 ml-1">({(interest.audienceSize / 1000000).toFixed(1)}M)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Behaviors">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.facebook.behaviors.map((b, i) => (
                        <Badge key={i} variant="info">{b.name}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Custom & Lookalike Audiences">
                    <div className="flex flex-wrap gap-2">
                      {[...avatar.platformTargeting.facebook.customAudiences, ...avatar.platformTargeting.facebook.lookalikes].map((a, i) => (
                        <Badge key={i}>{a}</Badge>
                      ))}
                    </div>
                  </CardSection>
                </div>
              </Card>
            </TabPanel>

            {/* Google Targeting */}
            <TabPanel value="google" className="mt-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Google Ads Targeting</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied === 'google' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={() => copyToClipboard(JSON.stringify(avatar.platformTargeting.google, null, 2), 'google')}
                  >
                    Copy JSON
                  </Button>
                </div>

                <div className="space-y-4">
                  <CardSection title="Keywords">
                    <div className="space-y-2">
                      {avatar.platformTargeting.google.keywords.map((kw, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="font-medium text-slate-700">{kw.keyword}</span>
                          <div className="flex gap-2">
                            <Badge size="sm" variant="success">{kw.matchType}</Badge>
                            {kw.volume && <Badge size="sm">{kw.volume.toLocaleString()} vol</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Affinity Audiences">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.google.affinityAudiences.map((a, i) => (
                        <Badge key={i} variant="info">{a}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="In-Market Audiences">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.google.inMarketAudiences.map((a, i) => (
                        <Badge key={i} variant="success">{a}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Custom Intent Keywords">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.google.customIntentKeywords.map((k, i) => (
                        <Badge key={i}>{k}</Badge>
                      ))}
                    </div>
                  </CardSection>
                </div>
              </Card>
            </TabPanel>

            {/* LinkedIn Targeting */}
            <TabPanel value="linkedin" className="mt-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">LinkedIn Targeting</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={copied === 'linkedin' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    onClick={() => copyToClipboard(JSON.stringify(avatar.platformTargeting.linkedin, null, 2), 'linkedin')}
                  >
                    Copy JSON
                  </Button>
                </div>

                <div className="space-y-4">
                  <CardSection title="Job Titles">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.linkedin.jobTitles.map((j, i) => (
                        <Badge key={i} variant="info">{j}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Industries">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.linkedin.industries.map((ind, i) => (
                        <Badge key={i}>{ind}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Company Sizes">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.linkedin.companySizes.map((s, i) => (
                        <Badge key={i}>{s} employees</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Seniorities">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.linkedin.seniorities.map((s, i) => (
                        <Badge key={i} variant="success">{s}</Badge>
                      ))}
                    </div>
                  </CardSection>

                  <CardSection title="Job Functions">
                    <div className="flex flex-wrap gap-2">
                      {avatar.platformTargeting.linkedin.jobFunctions.map((f, i) => (
                        <Badge key={i}>{f}</Badge>
                      ))}
                    </div>
                  </CardSection>
                </div>
              </Card>
            </TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Avatar"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-slate-600">Choose an export format:</p>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => {
                exportAsJSON();
                setShowExportModal(false);
              }}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileDown className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Export as JSON</p>
                <p className="text-sm text-slate-500">Complete avatar data for import/backup</p>
              </div>
            </button>
            <button
              onClick={() => {
                exportTargetingAsCSV();
                setShowExportModal(false);
              }}
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Export Targeting as CSV</p>
                <p className="text-sm text-slate-500">Platform targeting data for spreadsheets</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
