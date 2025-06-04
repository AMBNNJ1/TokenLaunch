'use client';

import { AIImageTester } from '@/components/common/AIImageTester';
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    // Debug env variables
    console.log('Environment variables check:', {
      openaiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      keyExists: !!process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      keyLength: process.env.NEXT_PUBLIC_OPENAI_API_KEY?.length || 0,
      environment: process.env.NODE_ENV,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <AIImageTester />
    </div>
  );
}
