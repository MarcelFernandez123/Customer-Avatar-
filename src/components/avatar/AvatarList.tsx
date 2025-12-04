'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types/avatar';
import { AvatarCard } from './AvatarCard';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { industryTemplates, getAllIndustries } from '@/lib/industry-templates';
import {
  Search,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Users,
} from 'lucide-react';

interface AvatarListProps {
  avatars: Avatar[];
  onView?: (avatar: Avatar) => void;
  onDelete?: (avatar: Avatar) => void;
  onDuplicate?: (avatar: Avatar) => void;
  onCompare?: (avatar: Avatar) => void;
}

type SortOption = 'newest' | 'oldest' | 'name' | 'confidence';
type ViewMode = 'grid' | 'list';

export function AvatarList({
  avatars,
  onView,
  onDelete,
  onDuplicate,
  onCompare
}: AvatarListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter avatars
  let filteredAvatars = [...avatars];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredAvatars = filteredAvatars.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.industry.toLowerCase().includes(query) ||
        a.businessInfo.niche.toLowerCase().includes(query)
    );
  }

  if (industryFilter) {
    filteredAvatars = filteredAvatars.filter(
      (a) => a.industry.toLowerCase().includes(industryFilter.toLowerCase())
    );
  }

  // Sort avatars
  filteredAvatars.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'confidence':
        return b.overallConfidence - a.overallConfidence;
      default:
        return 0;
    }
  });

  const industries = getAllIndustries();

  if (avatars.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No avatars yet</h3>
        <p className="text-slate-500 mb-4">
          Create your first customer avatar to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search avatars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            options={[
              { value: '', label: 'All Industries' },
              ...industries.map((i) => ({ value: i, label: i })),
            ]}
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-40"
          />
          <Select
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'oldest', label: 'Oldest' },
              { value: 'name', label: 'Name' },
              { value: 'confidence', label: 'Confidence' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-32"
          />
          <div className="flex border border-slate-300 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="!rounded-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="!rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-500">
        Showing {filteredAvatars.length} of {avatars.length} avatars
      </p>

      {/* Avatar Grid/List */}
      {filteredAvatars.length === 0 ? (
        <Card className="text-center py-8">
          <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500">No avatars match your filters</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAvatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              onView={onView}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onCompare={onCompare}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAvatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              avatar={avatar}
              onView={onView}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onCompare={onCompare}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}
