import BeachesPieChart from '@/components/charts/beaches/Pie';
import { filters, rawData } from '@/components/charts/types';
import { SurfActivityType } from '@/types/types';
import { SurfPercentage } from '../cards/SurfPercentage';
import { SurfSessions } from '../cards/SurfSessions';
import { SurfRatingAmounts } from '../cards/SurfRatingAmounts';

interface SurfChartsProps {
  surfExperiencesData: SurfActivityType[];
  filters: filters;
}

const MyActivityCharts: React.FC<SurfChartsProps> = ({
  surfExperiencesData,
  filters,
}) => {
  const processSurfExperienceData = () => {
    // Process surf experience data to generate chart data

    // Generate surf frequency data
    const surfFrequency: rawData = {};
    surfExperiencesData.forEach((experience) => {
      const date = experience.date;
      if (surfFrequency[date]) {
        surfFrequency[date]++;
      } else {
        surfFrequency[date] = 1;
      }
    });
    const surfFrequencyChartData = Object.entries(surfFrequency).map(
      ([date, frequency]) => ({
        name: date,
        value: frequency,
      })
    );

    // Generate ratings data
    const ratings = [1, 2, 3, 4];
    const ratingsCount: rawData = {};
    ratings.forEach((rating) => {
      ratingsCount[rating] = 0;
    });
    surfExperiencesData.forEach((experience) => {
      const rating = experience.mySurfRating?.rating;
      if (!rating) return;
      ratingsCount[rating]++;
    });
    const ratingsChartData = ratings.map((rating) => ({
      name: rating.toString(),
      value: ratingsCount[rating],
    }));

    // Generate beaches data
    const beaches: rawData = {};
    surfExperiencesData.forEach((experience) => {
      const beach = experience.beach;
      if (beaches[beach.name]) {
        beaches[beach.name]++;
      } else {
        beaches[beach.name] = 1;
      }
    });
    const beachesChartData = Object.entries(beaches).map(([beach, count]) => ({
      text: beach,
      value: count,
    }));

    return { surfFrequencyChartData, ratingsChartData, beachesChartData };
  };

  const { surfFrequencyChartData, ratingsChartData, beachesChartData } =
    processSurfExperienceData();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <SurfPercentage data={surfFrequencyChartData} filters={filters} />
        </div>
        <div className="col-span-1">
          <SurfSessions data={surfExperiencesData} filters={filters} />
        </div>
        <div className="col-span-1">
          <BeachesPieChart data={beachesChartData} width={250} height={250} />
        </div>
        <div className="col-span-1">
          <SurfRatingAmounts data={ratingsChartData} />
        </div>
      </div>
    </div>
  );
};

export default MyActivityCharts;
