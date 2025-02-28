'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import logo from '../../../public/surf-logo.svg';
import AvatarDropDown from './AvatarDropdown';

const Snackbar = dynamic(() => import('../utilities/SnackBar/SnackBar'), {
  ssr: false,
});

const ModalWrapper = dynamic(() => import('../Modal'), { ssr: false });

interface NavigationBarProps {
  title?: string;
  session: Session | null;
}

const navigationItems = [
  {
    name: 'Tracker',
    link: '/surf-session',
  },
  {
    name: 'New Session',
    link: '/surf-session/new',
  },
];

export function NavigationMenuDemo({ title, session }: NavigationBarProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <Image width={40} height={40} alt="logo" src={logo} />
          <span className="hidden font-bold sm:inline-block">Surf Tracker</span>
        </div>

        <NavigationMenu className="mx-6">
          <NavigationMenuList>
            <ModalWrapper />
            <Snackbar />
            {session?.user &&
              navigationItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <Link href={item.link} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto">
          {session?.user ? (
            <AvatarDropDown user={session.user} />
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/api/auth/signin" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Login
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
      </div>
    </div>
  );
}
