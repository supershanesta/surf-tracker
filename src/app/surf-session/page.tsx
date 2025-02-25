'use client';
import 'react';

import { useEffect, useState } from 'react';

import { format, subDays } from 'date-fns';

import SurfActivityCards from '@/components/cards/SurfActivityCards';
import MyActivityCharts from '@/components/charts/MyActivityCharts';
import { SurfActivityType } from '@/types/types';
import { Button, FormElement, Grid, Input } from '@nextui-org/react';
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
  const [data, setData] = useState<SurfActivityType[]>([]);

  const handleFilterStartDateChange = (e: React.ChangeEvent<FormElement>) => {
    localStorage.setItem('startDate', e.target.value);
    setStartDate(e.target.value);
  };

  const handleFilterEndDateChange = (e: React.ChangeEvent<FormElement>) => {
    localStorage.setItem('endDate', e.target.value);
    setEndDate(e.target.value);
  };

  const handleFilterRatingChange = (e: React.ChangeEvent<FormElement>) => {
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
      }
    };
    fetchData();
  }, [startDate, endDate]);

  console.log('data', data);
  if (!data) {
    return <div>Loading...</div>;
  }
  const filteredSurfExperiences = data.filter((experience) => {
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
      <div className="flex justify-center ">
        <div className="md:w-1/3">
          <Grid.Container id="filters" gap={2} justify="center">
            <Grid xs={6} md={6} justify="center">
              <Input
                labelPlaceholder="Start Date"
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleFilterStartDateChange}
                fullWidth
              />
            </Grid>
            <Grid xs={6} md={6} justify="center">
              <Input
                labelPlaceholder="End Date"
                type="date"
                id="endDate"
                value={endDate}
                onChange={handleFilterEndDateChange}
                fullWidth
              />
            </Grid>

            <Grid xs={6} md={6} justify="center">
              <Input
                type="number"
                labelPlaceholder="Rating"
                id="filterRating"
                min={1}
                max={4}
                value={filterRating}
                onChange={handleFilterRatingChange}
                fullWidth
              />
            </Grid>
            <Grid xs={6} md={6} justify="center">
              <Button size="sm" onClick={handleFilterReset}>
                Reset Filters
              </Button>
            </Grid>
            <Grid xs={6} md={6} justify="center">
              <ExportSessions data={filteredSurfExperiences} />
            </Grid>
          </Grid.Container>
        </div>
      </div>
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={12}>
          <MyActivityCharts
            surfExperiencesData={filteredSurfExperiences}
            filters={{ startDate, endDate, rating: filterRating }}
          />
        </Grid>
        <Grid xs={12} md={12}>
          <SurfActivityCards surfExperiences={filteredSurfExperiences} />
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default SurfExperiences;
