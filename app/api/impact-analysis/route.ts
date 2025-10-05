import { NextRequest, NextResponse } from 'next/server';
import { getImpactAnalysis, getLocationName } from '@/lib/gemini-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parameters, results } = body;

    if (!parameters || !results) {
      return NextResponse.json(
        { error: 'Missing required parameters or results' },
        { status: 400 }
      );
    }

    // Get location name for better context
    let locationName: string | undefined;
    if (parameters.location.lat !== 0 || parameters.location.lng !== 0) {
      try {
        locationName = await getLocationName(
          parameters.location.lat,
          parameters.location.lng
        );
      } catch (error) {
        console.error('Failed to get location name:', error);
      }
    }

    // Get AI analysis
    const analysis = await getImpactAnalysis({
      parameters,
      results,
      locationName,
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate analysis';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
