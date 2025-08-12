// app/reset-password/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ConfirmEmail = dynamic(() => import('./ConfirmEmail'), { ssr: false });

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <ConfirmEmail />
    </Suspense>
  );
}
