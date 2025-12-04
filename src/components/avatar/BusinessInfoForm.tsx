'use client';

import React, { useState } from 'react';
import { Input, TextArea, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { BusinessInfo } from '@/types/avatar';
import { industryTemplates, getTemplateById } from '@/lib/industry-templates';
import {
  Building2,
  Zap,
  ArrowRight,
  Sparkles,
  Plus,
  X
} from 'lucide-react';

interface BusinessInfoFormProps {
  onSubmit: (info: BusinessInfo, mode: 'quick' | 'comprehensive') => void;
  loading?: boolean;
  initialData?: Partial<BusinessInfo>;
}

export function BusinessInfoForm({ onSubmit, loading, initialData }: BusinessInfoFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [competitors, setCompetitors] = useState<string[]>(initialData?.competitors || ['']);
  const [geographies, setGeographies] = useState<string[]>(initialData?.targetGeography || ['United States']);

  const [formData, setFormData] = useState<Partial<BusinessInfo>>({
    industry: initialData?.industry || '',
    niche: initialData?.niche || '',
    productService: initialData?.productService || '',
    businessType: initialData?.businessType || 'b2c',
    pricePoint: initialData?.pricePoint || '',
    uniqueSellingProposition: initialData?.uniqueSellingProposition || '',
    existingCustomerDescription: initialData?.existingCustomerDescription || '',
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setFormData({
          ...formData,
          industry: template.defaultBusinessInfo.industry || formData.industry,
          niche: template.defaultBusinessInfo.niche || formData.niche,
          businessType: template.defaultBusinessInfo.businessType || formData.businessType,
          pricePoint: template.defaultBusinessInfo.pricePoint || formData.pricePoint,
        });
      }
    }
  };

  const handleChange = (field: keyof BusinessInfo, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, '']);
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index));
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
  };

  const addGeography = () => {
    setGeographies([...geographies, '']);
  };

  const removeGeography = (index: number) => {
    setGeographies(geographies.filter((_, i) => i !== index));
  };

  const updateGeography = (index: number, value: string) => {
    const updated = [...geographies];
    updated[index] = value;
    setGeographies(updated);
  };

  const handleSubmit = (mode: 'quick' | 'comprehensive') => {
    const businessInfo: BusinessInfo = {
      industry: formData.industry || '',
      niche: formData.niche || '',
      productService: formData.productService || '',
      businessType: formData.businessType as 'b2b' | 'b2c' | 'both',
      pricePoint: formData.pricePoint || '',
      uniqueSellingProposition: formData.uniqueSellingProposition || '',
      competitors: competitors.filter(c => c.trim()),
      targetGeography: geographies.filter(g => g.trim()),
      existingCustomerDescription: formData.existingCustomerDescription,
    };
    onSubmit(businessInfo, mode);
  };

  const isValid = formData.industry && formData.niche && formData.productService;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader
          title="Start with a Template"
          subtitle="Choose an industry template to pre-fill common settings"
          icon={<Sparkles className="w-5 h-5" />}
        />
        <Select
          label="Industry Template"
          options={[
            { value: '', label: 'Select a template (optional)' },
            ...industryTemplates.map(t => ({ value: t.id, label: t.name })),
          ]}
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          hint="Templates provide pre-configured settings for common industries"
        />
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader
          title="Business Information"
          subtitle="Tell us about your business and product"
          icon={<Building2 className="w-5 h-5" />}
        />
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Industry"
              placeholder="e.g., Health & Fitness, SaaS, E-commerce"
              value={formData.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              required
            />
            <Input
              label="Niche / Sub-Industry"
              placeholder="e.g., Weight Loss, Project Management"
              value={formData.niche}
              onChange={(e) => handleChange('niche', e.target.value)}
              required
            />
          </div>

          <TextArea
            label="Product or Service"
            placeholder="Describe your main product or service offering..."
            value={formData.productService}
            onChange={(e) => handleChange('productService', e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Business Type"
              options={[
                { value: 'b2c', label: 'B2C (Business to Consumer)' },
                { value: 'b2b', label: 'B2B (Business to Business)' },
                { value: 'both', label: 'Both B2B and B2C' },
              ]}
              value={formData.businessType}
              onChange={(e) => handleChange('businessType', e.target.value)}
            />
            <Input
              label="Price Point"
              placeholder="e.g., $50-200/month, $500 one-time"
              value={formData.pricePoint}
              onChange={(e) => handleChange('pricePoint', e.target.value)}
            />
          </div>

          <TextArea
            label="Unique Selling Proposition (USP)"
            placeholder="What makes your product/service different from competitors?"
            value={formData.uniqueSellingProposition}
            onChange={(e) => handleChange('uniqueSellingProposition', e.target.value)}
          />

          <TextArea
            label="Existing Customer Description (Optional)"
            placeholder="Describe your current customers if you have any..."
            value={formData.existingCustomerDescription}
            onChange={(e) => handleChange('existingCustomerDescription', e.target.value)}
          />
        </div>
      </Card>

      {/* Target Geography */}
      <Card>
        <CardHeader
          title="Target Geography"
          subtitle="Where do you want to reach customers?"
        />
        <div className="space-y-3">
          {geographies.map((geo, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., United States, Europe, Global"
                value={geo}
                onChange={(e) => updateGeography(index, e.target.value)}
                className="flex-1"
              />
              {geographies.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGeography(index)}
                  className="!p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addGeography}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Location
          </Button>
        </div>
      </Card>

      {/* Competitors */}
      <Card>
        <CardHeader
          title="Competitors (Optional)"
          subtitle="Add competitor websites for analysis"
        />
        <div className="space-y-3">
          {competitors.map((competitor, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://competitor-website.com"
                value={competitor}
                onChange={(e) => updateCompetitor(index, e.target.value)}
                className="flex-1"
              />
              {competitors.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCompetitor(index)}
                  className="!p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addCompetitor}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Competitor
          </Button>
        </div>
      </Card>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSubmit('quick')}
          disabled={!isValid || loading}
          loading={loading}
          icon={<Zap className="w-5 h-5" />}
        >
          Quick Generate (2-3 min)
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => handleSubmit('comprehensive')}
          disabled={!isValid || loading}
          loading={loading}
          icon={<ArrowRight className="w-5 h-5" />}
        >
          Comprehensive Research (5-10 min)
        </Button>
      </div>
    </div>
  );
}
