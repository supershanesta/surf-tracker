import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarDropDownProps {
  user: User;
}

export default function AvatarDropDown({ user }: AvatarDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user.image || ''}
            className="h-full w-full object-cover"
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback
            delayMs={600}
            className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground"
          >
            {`${user.firstName?.[0]}${user.lastName?.[0]}`}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p>{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">My Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/friends">Friends</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => signOut()}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
