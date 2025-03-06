'use client';
import { useSession } from 'next-auth/react';
import { Card, Grid, Text } from '@nextui-org/react';
import { useRequest } from '@/providers/useRequest';
import { FriendRequestType } from '@/types/types';
import { Button } from '@/components/ui/button';
import { useSnackBar } from '@/components/context/SnackBarContext';

const FriendsPage = () => {
  const { data: session } = useSession();
  const { openSnackBar } = useSnackBar();
  const {
    data: friendsData,
    error: friendsError,
    loading: friendsLoading,
    fetchData: fetchFriends,
  } = useRequest<FriendRequestType[]>({ url: '/api/friends' });

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        openSnackBar('success', 'Friend removed successfully');
        fetchFriends();
      } else {
        openSnackBar('error', 'Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      openSnackBar('error', 'Failed to remove friend');
    }
  };

  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} sm={8} md={6}>
        <Card css={{ p: '$6', mw: '100%' }}>
          <Card.Header>
            <Text h3>My Friends</Text>
          </Card.Header>
          <Card.Body>
            {friendsLoading ? (
              <Text>Loading friends...</Text>
            ) : friendsError ? (
              <Text color="error">Error loading friends</Text>
            ) : !friendsData || friendsData.length === 0 ? (
              <Text>No friends yet</Text>
            ) : (
              <div className="space-y-4">
                {friendsData.map((friendship) => {
                  const friend =
                    friendship.fromUser.id === session?.user?.id
                      ? friendship.toUser
                      : friendship.fromUser;
                  return (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                    >
                      <div>
                        <Text>
                          {friend.firstName} {friend.lastName}
                        </Text>
                        <Text size="sm" color="gray">
                          {friend.email}
                        </Text>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFriend(friendship.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

export default FriendsPage;
