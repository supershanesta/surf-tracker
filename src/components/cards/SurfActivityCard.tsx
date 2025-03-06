import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

import { SurfActivityType } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import shellSelected from '../../../public/shell-selected.svg';

interface SurfActivityCardProps {
  experience: SurfActivityType;
}

const SurfActivityCard: React.FC<SurfActivityCardProps> = ({ experience }) => {
  const { id, date, beach, users, mySurfRating } = experience;
  const router = useRouter();
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <div className="w-2/3">{date}</div>
              <div className="w-1/3 flex justify-end">
                <div onClick={() => router.push(`/surf-session/${id}/edit`)}>
                  <Settings className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="text-center">{beach.name}</div>
            <div className="flex flex-wrap gap-1">
              {users.map((user) => (
                <Badge key={user.id} variant="default">
                  {user.firstName} {user.lastName}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {mySurfRating ? (
            <div className="border rounded-md p-1">
              <div className="flex flex-col gap-1">
                <div className="flex justify-end">
                  <div
                    onClick={() =>
                      router.push(
                        `/surf-session/${id}/rating/${mySurfRating.id}`
                      )
                    }
                  >
                    <Settings className="h-5 w-5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-center">Size: {mySurfRating.size}</div>
                  <div className="text-center">Shape: {mySurfRating.shape}</div>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div>Rating: </div>
                  <div className="relative">
                    <Image alt="shell" src={shellSelected} />
                    <span className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-20%]">
                      {mySurfRating.rating}
                    </span>
                  </div>
                </div>
                {mySurfRating.notes && (
                  <div className="w-full">
                    <Textarea
                      id="notes"
                      name="notes"
                      disabled
                      value={mySurfRating.notes}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => router.push(`/surf-session/${id}/rating`)}
              >
                Add your rating
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurfActivityCard;
