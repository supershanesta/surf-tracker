'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export default function GoogleSignInButton({
  onClick,
  isLoading,
}: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-white hover:bg-gray-50 text-gray-800 font-roboto py-2 px-4 border border-gray-300 rounded-md shadow-sm flex items-center justify-center space-x-2 transition-colors"
      style={{ height: '40px' }}
    >
      {!isLoading && (
        <Image
          src="/google-logo.svg"
          alt="Google logo"
          width={18}
          height={18}
          className="mr-2"
        />
      )}
      <span className="text-sm font-medium">
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </span>
    </Button>
  );
}
