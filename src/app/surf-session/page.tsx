"use client";
import 'react';

import {
  useEffect,
  useState,
} from 'react';

import {
  format,
  subDays,
} from 'date-fns';

import MyActivityCharts from '@/components/charts/MyActivityCharts';
import SurfActivityTable from '@/components/tables/SurfActivity';
import {
  Button,
  FormElement,
  Grid,
  Input,
} from '@nextui-org/react';

export interface SurfActivity {
	date: string;
	beach: string;
	surfRating: number;
	surfSize: number;
	surfShape: number;
}

const SurfExperiences: React.FC = () => {
	const [startDate, setStartDate] = useState(
		format(subDays(new Date(), 7), "yyyy-MM-dd")
	);
	const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [filterRating, setFilterRating] = useState<number | undefined>(
		undefined
	);
	const [data, setData] = useState<SurfActivity[]>([]);

	const handleFilterStartDateChange = (e: React.ChangeEvent<FormElement>) => {
		console.log(e.target.value);
		setStartDate(e.target.value);
	};

	const handleFilterEndDateChange = (e: React.ChangeEvent<FormElement>) => {
		setEndDate(e.target.value);
	};

	const handleFilterRatingChange = (e: React.ChangeEvent<FormElement>) => {
		setFilterRating(Number(e.target.value) || undefined);
	};

	const handleFilterReset = () => {
		setStartDate("");
		setEndDate("");
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
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [startDate, endDate]);

	console.log("data", data);
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
			experience.surfRating !== filterRating
		) {
			return false;
		}
		return true;
	});

	return (
		<div>
			<div>
				<h1>Surf Experiences</h1>
			</div>

			<div id="filters" className="flex gap-2 pt-12">
				<div>
					<Input
						labelPlaceholder="Start Date"
						type="date"
						id="startDate"
						value={startDate}
						onChange={handleFilterStartDateChange}
					/>
				</div>
				<div>
					<Input
						labelPlaceholder="End Date"
						type="date"
						id="endDate"
						value={endDate}
						onChange={handleFilterEndDateChange}
					/>
				</div>

				<div>
					<Input
						type="number"
						labelPlaceholder="Rating"
						id="filterRating"
						min={1}
						max={4}
						value={filterRating}
						onChange={handleFilterRatingChange}
					/>
				</div>

				<Button onClick={handleFilterReset}>Reset Filters</Button>
			</div>
			<Grid.Container gap={2} justify="center">
				<Grid xs={12} md={12}>
					<MyActivityCharts
						surfExperiencesData={filteredSurfExperiences}
						filters={{ startDate, endDate, rating: filterRating }}
					/>
				</Grid>
				<Grid xs={12} md={12}>
					<SurfActivityTable surfExperiences={filteredSurfExperiences} />
				</Grid>
			</Grid.Container>
		</div>
	);
};

export default SurfExperiences;
