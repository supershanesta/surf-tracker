import BeachesPieChart from '@/components/charts/beaches/Pie';
import FrequencyPieChart from '@/components/charts/frequency/Pie';
import RatingsPieChart from '@/components/charts/ratings/Pie';
import {
  filters,
  rawData,
} from '@/components/charts/types';
import { SurfActivityType } from '@/types/types';
import {
  Card,
  Grid,
} from '@nextui-org/react';

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
			name: beach,
			value: count,
		}));

		return { surfFrequencyChartData, ratingsChartData, beachesChartData };
	};

	const { surfFrequencyChartData, ratingsChartData, beachesChartData } =
		processSurfExperienceData();

	return (
		<Card>
			<Grid.Container gap={2} justify="center">
				<Grid xs={12} md={4}>
					<FrequencyPieChart data={surfFrequencyChartData} filters={filters} />
				</Grid>
				<Grid xs={12} md={4}>
					<RatingsPieChart data={ratingsChartData} filters={filters} />
				</Grid>
				<Grid xs={12} md={4}>
					<BeachesPieChart data={beachesChartData} filters={filters} />
				</Grid>
			</Grid.Container>
		</Card>
	);
};

export default MyActivityCharts;
