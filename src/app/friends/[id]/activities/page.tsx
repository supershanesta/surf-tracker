'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Grid, Text, Loading } from '@nextui-org/react';
import { SurfActivityType } from '@/types/types';
import SurfActivityCards from '@/components/cards/SurfActivityCards';
import { useSnackBar } from '@/components/context/SnackBarContext';

export default function FriendActivities() {
  const { id } = useParams();
  const [activities, setActivities] = useState<SurfActivityType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openSnackBar } = useSnackBar();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/friends/${id}/activities`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err: any) {
        setError(err.message);
        openSnackBar('error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [id, openSnackBar]);

  if (loading) {
    return (
      <Grid.Container gap={2} justify="center">
        <Grid>
          <Loading size="lg">Loading activities...</Loading>
        </Grid>
      </Grid.Container>
    );
  }

  if (error) {
    return (
      <Grid.Container gap={2} justify="center">
        <Grid>
          <Text color="error">{error}</Text>
        </Grid>
      </Grid.Container>
    );
  }

  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={12}>
        <Text h2>Friend&apos;s Surf Activities</Text>
      </Grid>
      <Grid xs={12}>
        {activities && activities.length > 0 ? (
          <SurfActivityCards surfExperiences={activities} />
        ) : (
          <Text>No activities found</Text>
        )}
      </Grid>
    </Grid.Container>
  );
}
