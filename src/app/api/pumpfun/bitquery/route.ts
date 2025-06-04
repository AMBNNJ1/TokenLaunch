import { NextResponse } from 'next/server';
import { getRecentPumpFunTokens } from '@/services/bitqueryPumpFun';

export const revalidate = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const tokens = await getRecentPumpFunTokens(limit);
  return NextResponse.json({ tokens });
}
