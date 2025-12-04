'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { industryTemplates } from '@/lib/industry-templates';
import { IndustryTemplate } from '@/types/avatar';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  Users,
  Target,
  AlertTriangle,
  Building2
} from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = industryTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = (template: IndustryTemplate) => {
    // Store template in session storage and redirect to create page
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    router.push('/?template=' + template.id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Industry Templates
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Start with a pre-configured template for your industry to speed up avatar creation.
            Templates include common pain points, interests, and demographic data.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <Badge className="mt-1">{template.industry}</Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-4">{template.description}</p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Default Demographics */}
                {template.typicalDemographics && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                      <Users className="w-4 h-4" />
                      Typical Demographics
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.typicalDemographics.ageRange && (
                        <Badge size="sm">
                          {template.typicalDemographics.ageRange.min}-{template.typicalDemographics.ageRange.max} years
                        </Badge>
                      )}
                      {template.typicalDemographics.gender && (
                        <Badge size="sm" variant="info">
                          {template.typicalDemographics.gender === 'all' ? 'All genders' : template.typicalDemographics.gender}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested Interests */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Target className="w-4 h-4" />
                    Key Interests
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.suggestedInterests.slice(0, 5).map((interest, i) => (
                      <Badge key={i} size="sm" variant="success">{interest}</Badge>
                    ))}
                    {template.suggestedInterests.length > 5 && (
                      <Badge size="sm">+{template.suggestedInterests.length - 5}</Badge>
                    )}
                  </div>
                </div>

                {/* Common Pain Points */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Common Pain Points
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {template.commonPainPoints.slice(0, 3).map((pain, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleUseTemplate(template)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Use This Template
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <Card className="text-center py-12">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-500">
              Try a different search term or browse all templates
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
