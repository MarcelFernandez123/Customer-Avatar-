'use client';

import React from 'react';
import { Progress, StepProgress } from '../ui/Progress';
import { Card } from '../ui/Card';
import {
  Search,
  Globe,
  Brain,
  Target,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface GenerationProgressProps {
  step: string;
  progress: number;
  mode: 'quick' | 'comprehensive';
}

const steps = {
  quick: [
    { id: 'research', label: 'Research', icon: Search },
    { id: 'generate', label: 'Generate', icon: Brain },
    { id: 'targeting', label: 'Targeting', icon: Target },
  ],
  comprehensive: [
    { id: 'research', label: 'Research', icon: Search },
    { id: 'competitors', label: 'Competitors', icon: Globe },
    { id: 'generate', label: 'Generate', icon: Brain },
    { id: 'targeting', label: 'Targeting', icon: Target },
    { id: 'refine', label: 'Refine', icon: CheckCircle2 },
  ],
};

const stepMessages: Record<string, string[]> = {
  research: [
    'Analyzing market data...',
    'Gathering industry insights...',
    'Researching consumer trends...',
  ],
  competitors: [
    'Scraping competitor websites...',
    'Analyzing competitor messaging...',
    'Identifying market positioning...',
  ],
  generate: [
    'Creating demographic profile...',
    'Building psychographic analysis...',
    'Identifying pain points...',
    'Mapping buying behavior...',
  ],
  targeting: [
    'Generating Facebook targeting...',
    'Creating Google Ads parameters...',
    'Building LinkedIn criteria...',
  ],
  refine: [
    'Validating data accuracy...',
    'Cross-referencing sources...',
    'Finalizing avatar profile...',
  ],
};

export function GenerationProgress({ step, progress, mode }: GenerationProgressProps) {
  const currentSteps = steps[mode];
  const currentStepIndex = currentSteps.findIndex(s => s.id === step);

  const stepProgressData = currentSteps.map((s, index) => ({
    label: s.label,
    completed: index < currentStepIndex,
    current: index === currentStepIndex,
  }));

  const messages = stepMessages[step] || ['Processing...'];
  const messageIndex = Math.min(
    Math.floor((progress % 100) / (100 / messages.length)),
    messages.length - 1
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="text-center">
        <div className="py-8">
          {/* Animated Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              {currentSteps[currentStepIndex] && (() => {
                const IconComponent = currentSteps[currentStepIndex].icon;
                return <IconComponent className="w-4 h-4 text-indigo-600" />;
              })()}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Generating Your Avatar
          </h2>
          <p className="text-slate-500 mb-8">
            {mode === 'quick' ? 'Quick generation in progress...' : 'Comprehensive research underway...'}
          </p>

          {/* Step Progress */}
          <div className="mb-8 px-4">
            <StepProgress steps={stepProgressData} />
          </div>

          {/* Current Status */}
          <div className="bg-slate-50 rounded-xl p-6 mx-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              {currentSteps[currentStepIndex] && (() => {
                const IconComponent = currentSteps[currentStepIndex].icon;
                return <IconComponent className="w-5 h-5 text-indigo-600" />;
              })()}
              <span className="font-medium text-slate-900 capitalize">
                {step.replace(/-/g, ' ')}
              </span>
            </div>
            <Progress
              value={progress}
              max={100}
              showPercentage
              color="indigo"
              size="lg"
            />
            <p className="text-sm text-slate-500 mt-4 h-5">
              {messages[messageIndex]}
            </p>
          </div>

          {/* Time estimate */}
          <p className="text-xs text-slate-400 mt-6">
            Estimated time remaining: {mode === 'quick' ? '1-2' : '3-5'} minutes
          </p>
        </div>
      </Card>

      {/* Tips while waiting */}
      <Card className="bg-slate-50 border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">
          While you wait...
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span>
            The avatar will include ready-to-use targeting for Facebook, Google, and LinkedIn
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span>
            You can edit and refine any section after generation
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500">•</span>
            Export as PDF or JSON for easy sharing with your team
          </li>
        </ul>
      </Card>
    </div>
  );
}
