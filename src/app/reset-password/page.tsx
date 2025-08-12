// app/reset-password/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ResetPasswordClient = dynamic(() => import('./ResetPasswordClient'), { ssr: false });

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
