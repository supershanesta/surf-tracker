"use client";
import { useState } from 'react';

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

const SurfExperiences: React.FC = () => {
	const [startDate, setStartDate] = useState(
		format(subDays(new Date(), 7), "yyyy-MM-dd")
	);
	const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [filterRating, setFilterRating] = useState<number | undefined>(
		undefined
	);

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

	// Replace the surfExperiencesData with your actual data source
	const surfExperiencesData = [
		{
			date: "2023-05-12",
			beach: "Beach A",
			timeOfDay: "morning",
			surfRating: 3,
			surfSize: 2,
		},
		{
			date: "2023-05-13",
			beach: "Beach B",
			timeOfDay: "afternoon",
			surfRating: 4,
			surfSize: 2,
		},
		{
			date: "2023-05-14",
			beach: "Beach C",
			timeOfDay: "morning",
			surfRating: 2,
			surfSize: 2,
		},
		// Add more surf experience data as needed
	];

	const filteredSurfExperiences = surfExperiencesData.filter((experience) => {
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
						surfExperiencesData={surfExperiencesData}
						filters={{ startDate, endDate, rating: filterRating }}
					/>
				</Grid>
				<Grid xs={12} md={12}>
					<SurfActivityTable surfExperiences={surfExperiencesData} />
				</Grid>
			</Grid.Container>
		</div>
	);
};

export default SurfExperiences;
