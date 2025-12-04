'use client';

import React, { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BusinessInfoForm } from '@/components/avatar/BusinessInfoForm';
import { GenerationProgress } from '@/components/avatar/GenerationProgress';
import { AvatarDisplay } from '@/components/avatar/AvatarDisplay';
import { AvatarList } from '@/components/avatar/AvatarList';
import { ComparisonView } from '@/components/avatar/ComparisonView';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { useAvatarStore } from '@/store/avatarStore';
import { Avatar, BusinessInfo, ResearchData } from '@/types/avatar';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  Plus,
  Users,
  GitCompare,
  Sparkles,
  ArrowLeft,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react';

type AppView = 'dashboard' | 'create' | 'generating' | 'view' | 'compare';

export default function Home() {
  const [view, setView] = useState<AppView>('dashboard');
  const [generationMode, setGenerationMode] = useState<'quick' | 'comprehensive'>('comprehensive');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; avatar: Avatar | null }>({
    open: false,
    avatar: null,
  });

  const {
    currentAvatar,
    savedAvatars,
    comparisonAvatars,
    isGenerating,
    generationStep,
    generationProgress,
    setBusinessInfo,
    setCurrentAvatar,
    saveAvatar,
    deleteAvatar,
    setGenerating,
    setGenerationStep,
    setGenerationProgress,
    addToComparison,
    removeFromComparison,
    clearComparison,
  } = useAvatarStore();

  const simulateProgress = useCallback(async (steps: string[], mode: 'quick' | 'comprehensive') => {
    const totalSteps = steps.length;
    for (let i = 0; i < totalSteps; i++) {
      setGenerationStep(steps[i]);
      const stepProgress = 100 / totalSteps;
      for (let p = 0; p <= 100; p += 10) {
        setGenerationProgress((i * stepProgress) + (p * stepProgress / 100));
        await new Promise(r => setTimeout(r, mode === 'quick' ? 100 : 200));
      }
    }
  }, [setGenerationStep, setGenerationProgress]);

  const handleCreateAvatar = async (businessInfo: BusinessInfo, mode: 'quick' | 'comprehensive') => {
    setGenerationMode(mode);
    setBusinessInfo(businessInfo);
    setView('generating');
    setGenerating(true);

    const steps = mode === 'quick'
      ? ['research', 'generate', 'targeting']
      : ['research', 'competitors', 'generate', 'targeting', 'refine'];

    try {
      // Start progress simulation in background
      simulateProgress(steps, mode);

      // Call research API
      const researchResponse = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo, mode }),
      });

      if (!researchResponse.ok) {
        throw new Error('Research failed');
      }

      const researchResult = await researchResponse.json();
      const researchData: ResearchData = researchResult.data;

      // Call generate API
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessInfo, researchData, mode }),
      });

      if (!generateResponse.ok) {
        throw new Error('Generation failed');
      }

      const generateResult = await generateResponse.json();
      const avatar: Avatar = generateResult.avatar;

      setCurrentAvatar(avatar);
      setGenerating(false);
      setView('view');
      toast.success('Avatar generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      setGenerating(false);
      setView('create');
      toast.error('Failed to generate avatar. Please try again.');
    }
  };

  const handleSaveAvatar = (avatar: Avatar) => {
    saveAvatar(avatar);
    toast.success('Avatar saved successfully!');
  };

  const handleViewAvatar = (avatar: Avatar) => {
    setCurrentAvatar(avatar);
    setView('view');
  };

  const handleDeleteAvatar = (avatar: Avatar) => {
    setDeleteModal({ open: true, avatar });
  };

  const confirmDelete = () => {
    if (deleteModal.avatar) {
      deleteAvatar(deleteModal.avatar.id);
      toast.success('Avatar deleted');
      if (currentAvatar?.id === deleteModal.avatar.id) {
        setView('dashboard');
      }
    }
    setDeleteModal({ open: false, avatar: null });
  };

  const handleDuplicateAvatar = (avatar: Avatar) => {
    const duplicated: Avatar = {
      ...avatar,
      id: uuidv4(),
      name: `${avatar.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveAvatar(duplicated);
    toast.success('Avatar duplicated!');
  };

  const handleCompareAvatar = (avatar: Avatar) => {
    if (comparisonAvatars.length >= 3) {
      toast.error('Maximum 3 avatars can be compared at once');
      return;
    }
    addToComparison(avatar);
    if (comparisonAvatars.length === 0) {
      toast.success('Avatar added to comparison. Add more to compare!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNewAvatar={() => setView('create')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            {savedAvatars.length === 0 && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold mb-4">
                    Create Your First Customer Avatar
                  </h1>
                  <p className="text-indigo-100 mb-6">
                    Generate accurate, data-driven customer profiles for your marketing campaigns.
                    Get platform-specific targeting for Facebook, Google, and LinkedIn in minutes.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setView('create')}
                    icon={<Plus className="w-5 h-5" />}
                  >
                    Create Avatar
                  </Button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {savedAvatars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{savedAvatars.length}</p>
                    <p className="text-sm text-slate-500">Total Avatars</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {savedAvatars.reduce((acc, a) => acc + (a.platformTargeting?.facebook?.interests?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-slate-500">FB Interests</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {savedAvatars.reduce((acc, a) => acc + (a.platformTargeting?.google?.keywords?.length || 0), 0)}
                    </p>
                    <p className="text-sm text-slate-500">Keywords</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {Math.round(savedAvatars.reduce((acc, a) => acc + (a.overallConfidence || 0), 0) / Math.max(savedAvatars.length, 1) * 100)}%
                    </p>
                    <p className="text-sm text-slate-500">Avg Confidence</p>
                  </div>
                </Card>
              </div>
            )}

            {/* Comparison Banner */}
            {comparisonAvatars.length > 0 && (
              <Card className="bg-indigo-50 border-indigo-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GitCompare className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-slate-900">
                      {comparisonAvatars.length} avatar(s) selected for comparison
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearComparison}>
                      Clear
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setView('compare')}
                      disabled={comparisonAvatars.length < 2}
                    >
                      Compare
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Avatar Tabs */}
            <Tabs defaultTab="all">
              <div className="flex items-center justify-between mb-4">
                <TabList>
                  <Tab value="all" icon={<Users className="w-4 h-4" />}>All Avatars</Tab>
                  <Tab value="recent" icon={<Clock className="w-4 h-4" />}>Recent</Tab>
                </TabList>
                {savedAvatars.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setView('create')}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    New Avatar
                  </Button>
                )}
              </div>

              <TabPanel value="all">
                <AvatarList
                  avatars={savedAvatars}
                  onView={handleViewAvatar}
                  onDelete={handleDeleteAvatar}
                  onDuplicate={handleDuplicateAvatar}
                  onCompare={handleCompareAvatar}
                />
              </TabPanel>

              <TabPanel value="recent">
                <AvatarList
                  avatars={savedAvatars.slice(0, 6)}
                  onView={handleViewAvatar}
                  onDelete={handleDeleteAvatar}
                  onDuplicate={handleDuplicateAvatar}
                  onCompare={handleCompareAvatar}
                />
              </TabPanel>
            </Tabs>
          </div>
        )}

        {/* Create View */}
        {view === 'create' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setView('dashboard')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Create New Avatar
              </h1>
              <p className="text-slate-500 max-w-xl mx-auto">
                Tell us about your business and we&apos;ll generate a detailed customer avatar
                with platform-specific targeting recommendations.
              </p>
            </div>
            <BusinessInfoForm onSubmit={handleCreateAvatar} loading={isGenerating} />
          </div>
        )}

        {/* Generating View */}
        {view === 'generating' && (
          <div className="animate-fade-in py-8">
            <GenerationProgress
              step={generationStep}
              progress={generationProgress}
              mode={generationMode}
            />
          </div>
        )}

        {/* View Avatar */}
        {view === 'view' && currentAvatar && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setView('dashboard')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <AvatarDisplay
              avatar={currentAvatar as Avatar}
              onSave={handleSaveAvatar}
              showActions={true}
            />
          </div>
        )}

        {/* Compare View */}
        {view === 'compare' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setView('dashboard')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
            </div>
            <ComparisonView
              avatars={comparisonAvatars}
              onRemove={removeFromComparison}
              onClear={() => {
                clearComparison();
                setView('dashboard');
              }}
            />
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, avatar: null })}
        onConfirm={confirmDelete}
        title="Delete Avatar"
        message={`Are you sure you want to delete "${deleteModal.avatar?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
