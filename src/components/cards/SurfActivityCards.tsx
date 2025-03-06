'use client';
import { useRouter } from 'next/navigation';

import { SurfActivityType } from '@/types/types';
import { Button, Card, Grid } from '@nextui-org/react';

import SurfActivityCard from './SurfActivityCard';

interface SurfActivityCardProps {
  surfExperiences: SurfActivityType[];
}

const SurfActivityCards: React.FC<SurfActivityCardProps> = ({
  surfExperiences,
}) => {
  const router = useRouter();
  return (
    <div className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
        {surfExperiences.length > 0 ? (
          surfExperiences.map((experience, index) => (
            <SurfActivityCard key={index} experience={experience} />
          ))
        ) : (
          <Card>
            <Card.Body>
              <Button ghost onClick={() => router.push('/surf-session/new')}>
                Add Surf Experience
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SurfActivityCards;
