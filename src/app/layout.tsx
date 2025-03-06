import './globals.css';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';

import { ModalProvider } from '@/components/context/ModalContext';
import { SnackBarProvider } from '@/components/context/SnackBarContext';
import { NavigationMenuDemo } from '@/components/layouts/Navbar2';
import { authOptions } from '@/libs/auth';

import { NextAuthProvider } from '../providers/NextAuthProvider';

export const metadata = {
  title: 'Surf Tracker',
  description: 'Track your surf sessions and improve your skills',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <NextAuthProvider session={session}>
          <ModalProvider>
            <SnackBarProvider>
              <NavigationMenuDemo session={session} />
              <div className="py-8 px-2">{children}</div>
            </SnackBarProvider>
          </ModalProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
