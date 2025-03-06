'use client';
import 'react';

import { useEffect, useState } from 'react';

import { format, subDays } from 'date-fns';

import SurfActivityCards from '@/components/cards/SurfActivityCards';
import MyActivityCharts from '@/components/charts/MyActivityCharts';
import { SurfActivityType } from '@/types/types';
import { SurfSessionFilters } from '@/components/pageComponents/surfSessions/Filters';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  if (!isMobile) {
    return (
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 flex flex-col gap-4">
          {filteredSurfExperiences && (
            <MyActivityCharts
              surfExperiencesData={filteredSurfExperiences}
              filters={{ startDate, endDate, rating: filterRating }}
            />
          )}
        </div>
        <div className="col-span-3">
          <SurfSessionFilters
            startDate={startDate}
            endDate={endDate}
            filterRating={filterRating}
            filteredSurfExperiences={filteredSurfExperiences}
            handleFilterStartDateChange={handleFilterStartDateChange}
            handleFilterEndDateChange={handleFilterEndDateChange}
            handleFilterRatingChange={handleFilterRatingChange}
            handleFilterReset={handleFilterReset}
          />
          {filteredSurfExperiences && (
            <SurfActivityCards surfExperiences={filteredSurfExperiences} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-8 mt-8">
        <SurfSessionFilters
          startDate={startDate}
          endDate={endDate}
          filterRating={filterRating}
          filteredSurfExperiences={filteredSurfExperiences}
          handleFilterStartDateChange={handleFilterStartDateChange}
          handleFilterEndDateChange={handleFilterEndDateChange}
          handleFilterRatingChange={handleFilterRatingChange}
          handleFilterReset={handleFilterReset}
        />
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
