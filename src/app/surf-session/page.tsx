'use client';
import 'react';

import { useEffect, useState } from 'react';

import { format, subDays } from 'date-fns';

import SurfActivityCards from '@/components/cards/SurfActivityCards';
import MyActivityCharts from '@/components/charts/MyActivityCharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SurfActivityType } from '@/types/types';
import ExportSessions from '@/components/exports/ExportSessions';

const SurfExperiences: React.FC = () => {
  const [startDate, setStartDate] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('startDate') ||
          format(subDays(new Date(), 7), 'yyyy-MM-dd')
      : format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('endDate') || format(new Date(), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')
  );
  const [filterRating, setFilterRating] = useState<number | undefined>(
    undefined
  );
  const [data, setData] = useState<SurfActivityType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterStartDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    localStorage.setItem('startDate', e.target.value);
    setStartDate(e.target.value);
  };

  const handleFilterEndDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    localStorage.setItem('endDate', e.target.value);
    setEndDate(e.target.value);
  };

  const handleFilterRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRating(Number(e.target.value) || undefined);
  };

  const handleFilterReset = () => {
    setStartDate(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    localStorage.setItem(
      'startDate',
      format(subDays(new Date(), 7), 'yyyy-MM-dd')
    );
    localStorage.setItem('endDate', format(new Date(), 'yyyy-MM-dd'));
    setFilterRating(undefined);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/surf-activity/stats?startDate=${startDate}&endDate=${endDate}`
        );
        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [startDate, endDate]);

  console.log(data);

  const filteredSurfExperiences = data?.filter((experience) => {
    //if (filterDate && experience.date !== filterDate) {
    //	return false;
    //}
    if (
      filterRating &&
      filterRating > 0 &&
      experience.mySurfRating?.rating !== filterRating
    ) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-start">
        <div className="grid grid-cols-6 gap-4 p-4">
          <div className="col-span-1">
            <label htmlFor="startDate" className="block text-sm mb-2">
              Start Date
            </label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleFilterStartDateChange}
              className="w-full"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="endDate" className="block text-sm mb-2">
              End Date
            </label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleFilterEndDateChange}
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="filterRating" className="block text-sm mb-2">
              Rating
            </label>
            <Input
              type="number"
              id="filterRating"
              min={1}
              max={4}
              value={filterRating}
              onChange={handleFilterRatingChange}
              className="w-full"
            />
          </div>
          <div className="col-span-1 flex items-end">
            <Button
              variant="outline"
              onClick={handleFilterReset}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>

          {filteredSurfExperiences && (
            <div className="col-span-1 flex items-end">
              <ExportSessions data={filteredSurfExperiences} />
            </div>
          )}
        </div>
      </div>

      {filteredSurfExperiences && (
        <div className="grid grid-cols-1 gap-8 mt-8">
          <div className="col-span-1">
            <MyActivityCharts
              surfExperiencesData={filteredSurfExperiences}
              filters={{ startDate, endDate, rating: filterRating }}
            />
          </div>
          <div className="col-span-1">
            <SurfActivityCards surfExperiences={filteredSurfExperiences} />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default SurfExperiences;
