"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card, Grid, Text } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useSnackBar } from "@/components/context/SnackBarContext";
import { SelectType } from "@/components/inputs/SearchSelect";

const SearchSelect = dynamic(() => import("@/components/inputs/SearchSelect"), {
    ssr: false,
});

interface FriendRequest {
    id: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    fromUser: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    toUser: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
}

const FriendsPage = () => {
    const { data: session } = useSession();
    const { openSnackBar } = useSnackBar();
    const [friends, setFriends] = useState<FriendRequest[]>([]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);

    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await fetch("/api/friends");
            const data = await response.json();
            setFriends(data.friends);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await fetch("/api/friends/pending");
            const data = await response.json();
            setPendingRequests(data.requests);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
        }
    };

    const handleSendRequest = async (userId: string) => {
        try {
            const response = await fetch("/api/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ toUserId: userId }),
            });

            if (response.ok) {
                openSnackBar("success", "Friend request sent!");
            } else {
                openSnackBar("error", "Failed to send friend request");
            }
        } catch (error) {
            console.error("Error sending friend request:", error);
            openSnackBar("error", "Failed to send friend request");
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const response = await fetch(`/api/friends/request/${requestId}/accept`, {
                method: "POST",
            });

            if (response.ok) {
                openSnackBar("success", "Friend request accepted!");
                fetchFriends();
                fetchPendingRequests();
            } else {
                openSnackBar("error", "Failed to accept friend request");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
            openSnackBar("error", "Failed to accept friend request");
        }
    };

    return (
        <Grid.Container gap={2} justify="center">
            <Grid xs={12} sm={8} md={6}>
                <Card css={{ p: "$6", mw: "100%" }}>
                    <Card.Header>
                        <Text h3>Add New Friends</Text>
                    </Card.Header>
                    <Card.Body>
                        <SearchSelect
                            type={SelectType.User}
                            onChange={(user) => handleSendRequest(user.id)}
                            className="w-full"
                        />
                    </Card.Body>
                </Card>
            </Grid>

            <Grid xs={12} sm={8} md={6}>
                <Card css={{ p: "$6", mw: "100%" }}>
                    <Card.Header>
                        <Text h3>Pending Requests</Text>
                    </Card.Header>
                    <Card.Body>
                        {pendingRequests.length === 0 ? (
                            <Text>No pending friend requests</Text>
                        ) : (
                            pendingRequests.map((request) => (
                                <Grid.Container key={request.id} gap={1} alignItems="center">
                                    <Grid xs={8}>
                                        <Text>
                                            {request.fromUser.firstName} {request.fromUser.lastName}
                                        </Text>
                                    </Grid>
                                    <Grid xs={4}>
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
                <Card css={{ p: "$6", mw: "100%" }}>
                    <Card.Header>
                        <Text h3>My Friends</Text>
                    </Card.Header>
                    <Card.Body>
                        {friends.length === 0 ? (
                            <Text>No friends yet</Text>
                        ) : (
                            friends.map((friend) => (
                                <Grid.Container key={friend.id} gap={1} alignItems="center">
                                    <Grid xs={12}>
                                        <Text>
                                            {friend.toUser.firstName} {friend.toUser.lastName}
                                        </Text>
                                    </Grid>
                                </Grid.Container>
                            ))
                        )}
                    </Card.Body>
                </Card>
            </Grid>
        </Grid.Container>
    );
};

export default FriendsPage; 