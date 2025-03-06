import { useState, useEffect } from 'react';
import { FriendRequestType } from '@/types/types';

export function useFriendRequests() {
  const [pendingRequests, setPendingRequests] = useState<FriendRequestType[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('/api/friends/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending requests');
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/accept`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      // Remove the accepted request from the list
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/reject`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      // Remove the rejected request from the list
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      return true;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return false;
    }
  };

  return {
    pendingRequests,
    loading,
    handleAcceptRequest,
    handleRejectRequest,
    refreshRequests: fetchPendingRequests,
  };
}
