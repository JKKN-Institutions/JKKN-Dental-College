// API Route to test hero_sections table access
import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[API] Testing hero_sections table access...');
    console.log('[API] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[API] Supabase Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const supabase = createClient();

    const { data, error, count } = await supabase
      .from('hero_sections')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('[API] Error fetching hero sections:', error);
      return NextResponse.json({
        success: false,
        error: error.message || 'Unknown error',
        errorCode: error.code,
        errorDetails: error,
      }, { status: 500 });
    }

    console.log('[API] Successfully fetched hero sections');
    return NextResponse.json({
      success: true,
      count: count || 0,
      heroSections: data,
      message: 'Hero sections table is accessible!',
    });

  } catch (err: any) {
    console.error('[API] Catch block error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Unknown error',
      stack: err.stack,
    }, { status: 500 });
  }
}
