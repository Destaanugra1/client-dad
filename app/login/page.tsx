'use client';

import { SignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function LoginPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null; // Will redirect
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-600 mb-6 shadow-2xl">
            <span className="text-2xl">📊</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-3">
            Monitoring Absen
          </h1>
          <p className="text-gray-400 text-lg">Silakan login untuk melanjutkan</p>
        </div>
        
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-gray-800/50 border border-gray-600/50 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gray-700/10"></div>
          <div className="relative z-10">
            <SignIn 
              routing="hash"
              signUpUrl="/login"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-gray-100 text-2xl font-bold",
                  headerSubtitle: "text-gray-400",
                  socialButtonsBlockButton: "backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-100 hover:bg-gray-600/50 transition-all duration-300 rounded-xl",
                  formFieldInput: "backdrop-blur-xl bg-gray-700/50 border border-gray-600/50 text-gray-100 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent",
                  formFieldLabel: "text-gray-300 font-medium",
                  footerActionLink: "text-gray-400 hover:text-gray-200 transition-colors duration-300",
                  identityPreviewText: "text-gray-300",
                  formResendCodeLink: "text-gray-400 hover:text-gray-200 transition-colors duration-300"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}