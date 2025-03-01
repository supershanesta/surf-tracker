'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button, Card, Grid, Input, Text } from '@nextui-org/react';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
              </form>
            </div>
          </Card>
        </Grid>
      </Grid.Container>
    </div>
  );
}
