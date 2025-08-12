// app/reset-password/page.tsx
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Login = dynamic(() => import('./login'), { ssr: false });

export default function Loginn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <Login/>
    </Suspense>
  );
}
