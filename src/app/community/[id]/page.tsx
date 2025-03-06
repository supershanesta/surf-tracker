'use client';
import { useParams } from 'next/navigation';
import { useRequest } from '@/providers/useRequest';
import { UserType } from '@/types/types';
import { SurfActivityType } from '@/types/types';
import SurfActivityCards from '@/components/cards/SurfActivityCards';
import { useSnackBar } from '@/components/context/SnackBarContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface UserProfile extends UserType {
  surfActivity: SurfActivityType[];
  friendship?: {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  };
}

export default function UserProfile() {
  const { id } = useParams();
  const { openSnackBar } = useSnackBar();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: userData,
    error: userError,
    loading: userLoading,
  } = useRequest<UserProfile>({ url: `/api/users/${id}` });

  const handleSendFriendRequest = async () => {
    if (!session?.user?.id || !userData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: userData.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send friend request');
      }

      openSnackBar('success', 'Friend request sent successfully!');
    } catch (error: any) {
      openSnackBar('error', error.message || 'Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-destructive">Error loading profile</p>
      </div>
    );
  }

  const isCurrentUser = session?.user?.id === userData.id;
  const isFriend = userData.friendship?.status === 'ACCEPTED';
  const isPending = userData.friendship?.status === 'PENDING';

  return (
    <div className="container mx-auto py-6">
      <Card className="mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {userData.firstName} {userData.lastName}&apos;s Profile
            </CardTitle>
            {!isCurrentUser && !isFriend && !isPending && (
              <Button onClick={handleSendFriendRequest} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Send Friend Request
              </Button>
            )}
            {isPending && (
              <Button variant="secondary" disabled>
                Request Pending
              </Button>
            )}
            {isFriend && (
              <Button variant="secondary" disabled>
                Already Friends
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">{userData.email}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Recent Surf Sessions</h4>
            {!userData.surfActivity || userData.surfActivity?.length === 0 ? (
              <p className="text-muted-foreground">No surf sessions yet</p>
            ) : (
              <SurfActivityCards surfExperiences={userData.surfActivity} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
