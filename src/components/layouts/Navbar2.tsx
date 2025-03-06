'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
  {
    name: 'Friends',
    link: '/friends',
  },
  {
    name: 'Community',
    link: '/community',
  },
];

export function NavigationMenuDemo({ title, session }: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <Image width={40} height={40} alt="logo" src={logo} />
          <span className="hidden font-bold sm:inline-block">Surf Tracker</span>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="mx-6 hidden md:flex">
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <ModalWrapper />
                <Snackbar />
                {session?.user &&
                  navigationItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link}
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto flex items-center">
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
