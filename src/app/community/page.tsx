'use client';
import { useState } from 'react';
import { useRequest } from '@/providers/useRequest';
import { UserType } from '@/types/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SurfActivityType } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RecentSession {
  id: string;
  date: string;
  beach: {
    id: string;
    name: string;
  };
  user: UserType;
  mySurfRating?: {
    rating: number;
  };
}

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: sessionsData,
    error: sessionsError,
    loading: sessionsLoading,
  } = useRequest<RecentSession[]>({ url: '/api/users' });

  const filteredSessions = sessionsData?.filter((session) => {
    const fullName =
      `${session.user.firstName} ${session.user.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container mx-auto px-2 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-semibold">Recent Surf Sessions</h3>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            {sessionsLoading ? (
              <p>Loading recent sessions...</p>
            ) : sessionsError ? (
              <p className="text-destructive">Error loading recent sessions</p>
            ) : !filteredSessions || filteredSessions.length === 0 ? (
              <p>No surf sessions found</p>
            ) : (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col p-4 rounded-lg border hover:bg-accent/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Avatar>
                          <AvatarImage
                            src={session.user.image || ''}
                            className="h-full w-full object-cover"
                            alt={`${session.user.firstName} ${session.user.lastName}`}
                          />
                          <AvatarFallback
                            delayMs={600}
                            className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground"
                          >
                            {`${session.user.firstName?.[0]}${session.user.lastName?.[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <h4 className="text-lg font-semibold">
                          {session.user.firstName} {session.user.lastName}
                        </h4>
                      </div>
                      <Button asChild>
                        <Link href={`/community/${session.user.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm font-semibold">Surf Session</p>
                      <p className="text-sm">
                        {new Date(session.date).toLocaleDateString()} -{' '}
                        {session.beach.name}
                      </p>
                      {session.mySurfRating && (
                        <p className="text-sm text-muted-foreground">
                          Your Rating: {session.mySurfRating.rating}/5
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityPage;
