'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Card, Grid, Input, Text, Button } from '@nextui-org/react';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/surf-session');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        setError('Failed to sign in with Google');
      } else {
        router.push('/surf-session');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during Google sign in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-8">
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} sm={6} md={4}>
          <Card className="p-8 w-full">
            <div className="px-4 py-6">
              <Text h2 className="text-center my-6">
                Sign In
              </Text>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />
                <Input.Password
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                />
                {error && (
                  <Text color="error" className="text-center">
                    {error}
                  </Text>
                )}
                <Button
                  type="submit"
                  color="primary"
                  disabled={isLoading}
                  className="mx-auto"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <Text className="mx-4 text-gray-500">or</Text>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                <div className="flex justify-center">
                  <GoogleSignInButton
                    onClick={handleGoogleSignIn}
                    isLoading={isGoogleLoading}
                  />
                </div>
              </form>
            </div>
          </Card>
        </Grid>
      </Grid.Container>
    </div>
  );
}
