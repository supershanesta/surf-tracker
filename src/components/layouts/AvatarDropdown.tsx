import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSnackBar } from '@/components/context/SnackBarContext';
import { useFriendRequests } from '@/hooks/useFriendRequests';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AvatarDropDownProps {
  user: User;
}

export default function AvatarDropDown({ user }: AvatarDropDownProps) {
  const { openSnackBar } = useSnackBar();
  const { pendingRequests, handleAcceptRequest, handleRejectRequest } =
    useFriendRequests();

  const handleAccept = async (requestId: string) => {
    const success = await handleAcceptRequest(requestId);
    if (success) {
      openSnackBar('success', 'Friend request accepted!');
    } else {
      openSnackBar('error', 'Failed to accept friend request');
    }
  };

  const handleReject = async (requestId: string) => {
    const success = await handleRejectRequest(requestId);
    if (success) {
      openSnackBar('success', 'Friend request rejected');
    } else {
      openSnackBar('error', 'Failed to reject friend request');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
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
        {pendingRequests.length > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {pendingRequests.length}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p>{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {pendingRequests.length > 0 && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-between">
                <span>Friend Requests</span>
                <Badge variant="destructive" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex flex-col space-y-2 p-2"
                    >
                      <p className="text-sm">
                        {request.fromUser.firstName} {request.fromUser.lastName}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleAccept(request.id)}
                          className="flex-1"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}
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
