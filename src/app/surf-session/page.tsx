"use client";
import "react";

import { useEffect, useState } from "react";

import { format, subDays } from "date-fns";

import SurfActivityCards from "@/components/cards/SurfActivityCards";
import MyActivityCharts from "@/components/charts/MyActivityCharts";
import { Button, FormElement, Grid, Input } from "@nextui-org/react";

export interface SurfActivity {
	id: string;
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
			<Grid.Container id="filters" gap={2}>
				<Grid xs={6} md={6}>
					<Input
						labelPlaceholder="Start Date"
						type="date"
						id="startDate"
						value={startDate}
						onChange={handleFilterStartDateChange}
					/>
				</Grid>
				<Grid xs={6} md={6}>
					<Input
						labelPlaceholder="End Date"
						type="date"
						id="endDate"
						value={endDate}
						onChange={handleFilterEndDateChange}
					/>
				</Grid>

				<Grid xs={6} md={6}>
					<Input
						type="number"
						labelPlaceholder="Rating"
						id="filterRating"
						min={1}
						max={4}
						value={filterRating}
						onChange={handleFilterRatingChange}
					/>
				</Grid>
				<Grid xs={6} md={6}>
					<Button size="sm" onClick={handleFilterReset}>
						Reset Filters
					</Button>
				</Grid>
			</Grid.Container>
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
