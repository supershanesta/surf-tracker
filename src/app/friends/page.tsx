'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button, Card, Grid, Text } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { useSnackBar } from '@/components/context/SnackBarContext';
import { SelectType } from '@/components/inputs/SearchSelect';
import { useRequest } from '@/providers/useRequest';
import FriendsTable from '@/components/tables/FriendsTable';
import { FriendRequestType } from '@/types/types';
const SearchSelect = dynamic(() => import('@/components/inputs/SearchSelect'), {
  ssr: false,
});

const FriendsPage = () => {
  const { data: session } = useSession();
  const { openSnackBar } = useSnackBar();
  const {
    data: friendsData,
    error: friendsError,
    loading: friendsLoading,
    fetchData: fetchFriends,
  } = useRequest<FriendRequestType[]>({ url: '/api/friends' });
  const {
    data: pendingRequestsData,
    error: pendingRequestsError,
    loading: pendingRequestsLoading,
    fetchData: fetchPendingRequests,
  } = useRequest<FriendRequestType[]>({ url: '/api/friends/pending' });

  console.log(friendsData);

  const handleSendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toUserId: userId }),
      });

      if (response.ok) {
        openSnackBar('success', 'Friend request sent!');
      } else {
        openSnackBar('error', 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      openSnackBar('error', 'Failed to send friend request');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/accept`, {
        method: 'POST',
      });

      if (response.ok) {
        openSnackBar('success', 'Friend request accepted!');
        fetchFriends();
        fetchPendingRequests();
      } else {
        openSnackBar('error', 'Failed to accept friend request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      openSnackBar('error', 'Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        openSnackBar('success', 'Friend request rejected!');
        fetchFriends();
        fetchPendingRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      openSnackBar('error', 'Failed to reject friend request');
    }
  };

  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12} sm={8} md={6}>
        <Card css={{ p: '$6', mw: '100%' }}>
          <Card.Header>
            <Text h3>Add New Friends</Text>
          </Card.Header>
          <Card.Body>
            <SearchSelect
              type={SelectType.User}
              onChange={(user) => {
                console.log(user);
                handleSendRequest(user.id);
              }}
              className="w-full"
            />
          </Card.Body>
        </Card>
      </Grid>

      <Grid xs={12} sm={8} md={6}>
        <Card css={{ p: '$6', mw: '100%' }}>
          <Card.Header>
            <Text h3>Pending Requests</Text>
          </Card.Header>
          <Card.Body>
            {pendingRequestsLoading ||
            !pendingRequestsData ||
            (pendingRequestsData && pendingRequestsData.length === 0) ? (
              <Text>No pending friend requests</Text>
            ) : (
              pendingRequestsData?.map((request) => (
                <Grid.Container key={request.id} gap={1} alignItems="center">
                  <Grid xs={6}>
                    <Text>
                      {request.fromUser.firstName} {request.fromUser.lastName}
                    </Text>
                  </Grid>
                  <Grid xs={3}>
                    <Button
                      size="sm"
                      color="error"
                      onPress={() => handleRejectRequest(request.id)}
                    >
                      Reject
                    </Button>
                  </Grid>
                  <Grid xs={3}>
                    <Button
                      size="sm"
                      onPress={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                  </Grid>
                </Grid.Container>
              ))
            )}
          </Card.Body>
        </Card>
      </Grid>

      <Grid xs={12} sm={8} md={6}>
        <Card css={{ p: '$6', mw: '100%' }}>
          <Card.Header>
            <Text h3>My Friends</Text>
          </Card.Header>
          <Card.Body>
            <FriendsTable
              friends={
                friendsData ? friendsData.map((friend) => friend.toUser) : null
              }
            />
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

export default FriendsPage;
