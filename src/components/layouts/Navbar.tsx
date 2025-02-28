'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import AvatarDropDown from '@/components/layouts/AvatarDropdown';
import { Navbar, Text } from '@nextui-org/react';

//import { User } from "your-user-library"; // Import your user library
import logo from '../../../public/logo.svg';

const Snackbar = dynamic(
  () => {
    return import('../utilities/SnackBar/SnackBar');
  },
  { ssr: false }
);

const ModalWrapper = dynamic(
  () => {
    return import('../Modal');
  },
  { ssr: false }
);

interface NavigationBarProps {
  title: string;
  //navigationItems: string[];
  //user: User;
}

interface navigationItem {
  name: string;
  link: string;
}

const navigationItems: navigationItem[] = [
  {
    name: 'Tracker',
    link: '/surf-session',
  },
  {
    name: 'New Session',
    link: '/surf-session/new',
  },
];

const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
  const { data: session } = useSession();
  return (
    <Navbar maxWidth={'fluid'} isBordered variant="sticky">
      <Navbar.Brand className="flex items-center gap-2">
        <Image width={40} height={40} alt="logo" src={logo} />
        <Text b color="inherit" hideIn="xs">
          Surf Tracker
        </Text>
      </Navbar.Brand>
      <Navbar.Content
        enableCursorHighlight
        activeColor="secondary"
        variant="underline"
      >
        <ModalWrapper />
        <Snackbar />
        {session?.user &&
          navigationItems.map((item, index) => (
            <Navbar.Link key={index} href={item.link}>
              {item.name}
            </Navbar.Link>
          ))}
      </Navbar.Content>
      {session?.user ? (
        <AvatarDropDown user={session.user} />
      ) : (
        <Navbar.Content
          enableCursorHighlight
          activeColor="secondary"
          hideIn="xs"
          variant="underline"
        >
          <Navbar.Link href="/api/auth/signin">Login</Navbar.Link>
        </Navbar.Content>
      )}
    </Navbar>
  );
};

export default NavigationBar;
