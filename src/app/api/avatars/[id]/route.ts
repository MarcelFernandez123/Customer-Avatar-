import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/types/avatar';

// GET single avatar by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Avatar not found' },
        { status: 404 }
      );
    }

    const avatar: Avatar = {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
      businessInfo: data.business_info,
      ...data.avatar_data,
      industry: data.industry,
      tags: data.tags,
      isTemplate: data.is_template,
      generationMode: data.generation_mode,
      overallConfidence: data.overall_confidence,
    };

    return NextResponse.json({
      success: true,
      avatar
    });
  } catch (error) {
    console.error('GET avatar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch avatar' },
      { status: 500 }
    );
  }
}

// PUT update avatar
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json() as Partial<Avatar>;

    const updateData: Record<string, unknown> = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.isTemplate !== undefined) updateData.is_template = updates.isTemplate;

    // If any avatar data fields are updated, merge them
    const avatarDataFields = [
      'narrative', 'demographics', 'psychographics', 'painPoints',
      'goals', 'onlineBehavior', 'objections', 'buyingTriggers',
      'communicationPreference', 'platformTargeting', 'sources'
    ];

    const avatarDataUpdates: Record<string, unknown> = {};
    for (const field of avatarDataFields) {
      if (updates[field as keyof Avatar] !== undefined) {
        avatarDataUpdates[field] = updates[field as keyof Avatar];
      }
    }

    if (Object.keys(avatarDataUpdates).length > 0) {
      // Fetch current data to merge
      const { data: currentData } = await supabase
        .from('avatars')
        .select('avatar_data')
        .eq('id', id)
        .single();

      updateData.avatar_data = {
        ...(currentData?.avatar_data || {}),
        ...avatarDataUpdates
      };
    }

    if (updates.businessInfo) {
      updateData.business_info = updates.businessInfo;
    }

    const { data, error } = await supabase
      .from('avatars')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      avatar: data,
      message: 'Avatar updated successfully'
    });
  } catch (error) {
    console.error('PUT avatar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update avatar' },
      { status: 500 }
    );
  }
}

// DELETE avatar
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('avatars')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('DELETE avatar error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
}
