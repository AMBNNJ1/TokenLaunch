import { NextResponse } from 'next/server';
import { pumpFunApi } from '@/services/pumpFunApi';

export const revalidate = 30; // cache for 30 seconds

export async function GET() {
  const tokens = await pumpFunApi.getRecentTokens(20);
  return NextResponse.json({ tokens });
}
