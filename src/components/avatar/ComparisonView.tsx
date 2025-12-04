'use client';

import React from 'react';
import { Avatar } from '@/types/avatar';
import { Card, CardHeader, CardSection } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, ConfidenceBadge } from '../ui/Badge';
import { X, User } from 'lucide-react';

interface ComparisonViewProps {
  avatars: Avatar[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ComparisonView({ avatars, onRemove, onClear }: ComparisonViewProps) {
  if (avatars.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">
          Avatar Comparison ({avatars.length}/3)
        </h2>
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left p-4 bg-slate-50 rounded-tl-lg w-48">
                <span className="text-sm font-medium text-slate-500">Attribute</span>
              </th>
              {avatars.map((avatar, index) => (
                <th key={avatar.id} className={`p-4 bg-slate-50 ${index === avatars.length - 1 ? 'rounded-tr-lg' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="font-medium text-slate-900 truncate max-w-[150px]">
                        {avatar.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(avatar.id)}
                      className="!p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Confidence */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Confidence Score</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-center">
                  <ConfidenceBadge confidence={avatar.overallConfidence} />
                </td>
              ))}
            </tr>

            {/* Industry */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">Industry</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4">
                  <Badge>{avatar.industry}</Badge>
                </td>
              ))}
            </tr>

            {/* Business Type */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Business Type</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4">
                  <Badge variant="info">{avatar.businessInfo.businessType.toUpperCase()}</Badge>
                </td>
              ))}
            </tr>

            {/* Age Range */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">Age Range</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700">
                  {avatar.demographics.ageRange.min} - {avatar.demographics.ageRange.max} years
                </td>
              ))}
            </tr>

            {/* Gender */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Gender</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700 capitalize">
                  {avatar.demographics.gender}
                </td>
              ))}
            </tr>

            {/* Income Range */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">Income Range</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700">
                  ${avatar.demographics.incomeRange.min.toLocaleString()} - ${avatar.demographics.incomeRange.max.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* Locations */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Locations</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {avatar.demographics.locations.slice(0, 3).map((loc, i) => (
                      <Badge key={i} size="sm">{loc}</Badge>
                    ))}
                    {avatar.demographics.locations.length > 3 && (
                      <Badge size="sm" variant="info">+{avatar.demographics.locations.length - 3}</Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Pain Points Count */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">Pain Points</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700">
                  {avatar.painPoints.length} identified
                </td>
              ))}
            </tr>

            {/* Top Interests */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Top Interests</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {avatar.psychographics.interests.slice(0, 4).map((int, i) => (
                      <Badge key={i} size="sm">{int}</Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* FB Interests */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">FB Targeting Interests</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700">
                  {avatar.platformTargeting.facebook.interests.length} interests
                </td>
              ))}
            </tr>

            {/* Google Keywords */}
            <tr className="border-b border-slate-100">
              <td className="p-4 font-medium text-slate-700">Google Keywords</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4 text-slate-700">
                  {avatar.platformTargeting.google.keywords.length} keywords
                </td>
              ))}
            </tr>

            {/* LinkedIn Job Titles */}
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <td className="p-4 font-medium text-slate-700">LinkedIn Job Titles</td>
              {avatars.map((avatar) => (
                <td key={avatar.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {avatar.platformTargeting.linkedin.jobTitles.slice(0, 3).map((title, i) => (
                      <Badge key={i} size="sm">{title}</Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Generation Mode */}
            <tr>
              <td className="p-4 font-medium text-slate-700 rounded-bl-lg">Generation Mode</td>
              {avatars.map((avatar, index) => (
                <td key={avatar.id} className={`p-4 ${index === avatars.length - 1 ? 'rounded-br-lg' : ''}`}>
                  <Badge variant={avatar.generationMode === 'comprehensive' ? 'success' : 'warning'}>
                    {avatar.generationMode}
                  </Badge>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
