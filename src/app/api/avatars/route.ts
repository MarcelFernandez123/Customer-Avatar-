import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/types/avatar';

// GET all avatars
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get('industry');
    const isTemplate = searchParams.get('isTemplate');
    const search = searchParams.get('search');

    let query = supabase
      .from('avatars')
      .select('*')
      .order('created_at', { ascending: false });

    if (industry) {
      query = query.eq('industry', industry);
    }

    if (isTemplate !== null) {
      query = query.eq('is_template', isTemplate === 'true');
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,industry.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform database records to Avatar type
    const avatars: Avatar[] = (data || []).map(record => ({
      id: record.id,
      name: record.name,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      userId: record.user_id,
      businessInfo: record.business_info,
      ...record.avatar_data,
      industry: record.industry,
      tags: record.tags,
      isTemplate: record.is_template,
      generationMode: record.generation_mode,
      overallConfidence: record.overall_confidence,
    }));

    return NextResponse.json({
      success: true,
      avatars,
      count: avatars.length
    });
  } catch (error) {
    console.error('GET avatars error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch avatars' },
      { status: 500 }
    );
  }
}

// POST save a new avatar
export async function POST(request: NextRequest) {
  try {
    const avatar = await request.json() as Avatar;

    const { data, error } = await supabase
      .from('avatars')
      .insert({
        id: avatar.id,
        name: avatar.name,
        user_id: avatar.userId || null,
        business_info: avatar.businessInfo,
        avatar_data: {
          narrative: avatar.narrative,
          demographics: avatar.demographics,
          psychographics: avatar.psychographics,
          painPoints: avatar.painPoints,
          goals: avatar.goals,
          onlineBehavior: avatar.onlineBehavior,
          objections: avatar.objections,
          buyingTriggers: avatar.buyingTriggers,
          communicationPreference: avatar.communicationPreference,
          platformTargeting: avatar.platformTargeting,
          sources: avatar.sources,
        },
        industry: avatar.industry,
        tags: avatar.tags,
        is_template: avatar.isTemplate,
        generation_mode: avatar.generationMode,
        overall_confidence: avatar.overallConfidence,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      avatar: data,
      message: 'Avatar saved successfully'
    });
  } catch (error) {
    console.error('POST avatar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save avatar' },
      { status: 500 }
    );
  }
}
