'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Plus, LayoutDashboard, BookTemplate } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onNewAvatar?: () => void;
}

export function Header({ onNewAvatar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Avatar<span className="text-indigo-600">Gen</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/templates"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <BookTemplate className="w-4 h-4" />
              Templates
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button onClick={onNewAvatar} icon={<Plus className="w-4 h-4" />}>
              New Avatar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
