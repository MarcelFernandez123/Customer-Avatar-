'use client';

import React from 'react';
import { Avatar } from '@/types/avatar';
import { Card } from '../ui/Card';
import { Badge, ConfidenceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import {
  Eye,
  Trash2,
  Copy,
  GitCompare,
  User
} from 'lucide-react';

interface AvatarCardProps {
  avatar: Avatar;
  onView?: (avatar: Avatar) => void;
  onDelete?: (avatar: Avatar) => void;
  onDuplicate?: (avatar: Avatar) => void;
  onCompare?: (avatar: Avatar) => void;
  isSelected?: boolean;
  compact?: boolean;
}

export function AvatarCard({
  avatar,
  onView,
  onDelete,
  onDuplicate,
  onCompare,
  isSelected,
  compact = false
}: AvatarCardProps) {
  const timeAgo = formatDistanceToNow(new Date(avatar.createdAt), { addSuffix: true });

  if (compact) {
    return (
      <div
        className={`
          p-4 rounded-lg border cursor-pointer transition-all
          ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}
        `}
        onClick={() => onView?.(avatar)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate">{avatar.name}</h4>
            <p className="text-sm text-slate-500">{avatar.industry}</p>
          </div>
          <ConfidenceBadge confidence={avatar.overallConfidence} showLabel={false} />
        </div>
      </div>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{avatar.name}</h3>
              <p className="text-sm text-slate-500">{timeAgo}</p>
            </div>
          </div>
          <ConfidenceBadge confidence={avatar.overallConfidence} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge>{avatar.industry}</Badge>
          <Badge variant={avatar.businessInfo.businessType === 'b2b' ? 'info' : 'default'}>
            {avatar.businessInfo.businessType.toUpperCase()}
          </Badge>
          {avatar.isTemplate && <Badge variant="warning">Template</Badge>}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {avatar.narrative?.slice(0, 150)}...
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Pain Points</p>
            <p className="font-semibold text-slate-900">{avatar.painPoints?.length || 0}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Interests</p>
            <p className="font-semibold text-slate-900">{avatar.platformTargeting?.facebook?.interests?.length || 0}</p>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Keywords</p>
            <p className="font-semibold text-slate-900">{avatar.platformTargeting?.google?.keywords?.length || 0}</p>
          </div>
        </div>

        {/* Demographics Summary */}
        <div className="text-sm text-slate-600 mb-4">
          <span className="font-medium">Target: </span>
          {avatar.demographics?.ageRange?.min}-{avatar.demographics?.ageRange?.max} years,{' '}
          {avatar.demographics?.gender === 'all' ? 'All genders' : avatar.demographics?.gender},{' '}
          {avatar.demographics?.locations?.[0] || 'Global'}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-1">
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(avatar);
              }}
              className="!text-red-600 hover:!bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(avatar);
              }}
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}
          {onCompare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(avatar);
              }}
            >
              <GitCompare className="w-4 h-4" />
            </Button>
          )}
        </div>
        {onView && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView(avatar)}
            icon={<Eye className="w-4 h-4" />}
          >
            View
          </Button>
        )}
      </div>
    </Card>
  );
}
