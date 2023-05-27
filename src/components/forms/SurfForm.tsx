import { ChangeEvent, FormEvent, useCallback, useState } from "react";

import { debounce } from "lodash";
import AsyncSelect from "react-select/async";

import SurfRating from "@/components/inputs/SurfRating";
import {
	Button,
	Card,
	FormElement,
	Grid,
	Input,
	Radio,
} from "@nextui-org/react";
import { Location } from "@prisma/client";

export interface FormValues {
	date: string;
	beach: BeachOption | null;
	timeOfDay: string;
	surfRating: number;
	surfSize: number;
}

export interface BeachOption {
	label: string;
	value: string;
}

interface FormProps {
	onSubmit: (values: FormValues) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
	const [formValues, setFormValues] = useState<FormValues>({
		date: "",
		beach: null,
		timeOfDay: "",
		surfRating: 0,
		surfSize: 0,
	});

	const handleChange = (e: ChangeEvent<FormElement | HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const handleTimeOfDayChange = (timeOfDay: string) => {
		setFormValues((prevValues) => ({
			...prevValues,
			timeOfDay,
		}));
	};

	const handleSurfRatingChange = (rating: number) => {
		setFormValues((prevValues) => ({
			...prevValues,
			surfRating: rating,
		}));
	};

	const handleBeachChange = (selectedOption: BeachOption | null) => {
		setFormValues((prevValues) => ({
			...prevValues,
			beach: selectedOption,
		}));
	};

	const loadBeaches = useCallback(
		debounce(
			async (
				inputValue: string,
				callback: (options: BeachOption[]) => void
			) => {
				try {
					if (inputValue.length < 3) {
						return [];
					}
					const response = await fetch(`/api/spots?searchQuery=${inputValue}`);
					const data = await response.json();
					const options = data.spots.map((beach: Location) => ({
						value: beach.id,
						label: beach.name,
					}));
					callback(options);
				} catch (error) {
					console.log(error);
					callback([]);
				}
			},
			2000
		),
		[]
	);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit(formValues);
	};

	return (
		<Grid.Container gap={2} justify="center" md={3}>
			<Card>
				<form onSubmit={handleSubmit}>
					<Grid.Container gap={2}>
						<Grid md={12} justify="space-between">
							<label htmlFor="date">Date:</label>
							<Input
								type="date"
								id="date"
								name="date"
								required
								value={formValues.date}
								onChange={handleChange}
							/>
						</Grid>
						<Grid md={12} justify="space-between">
							<label htmlFor="beach">Beach:</label>
							<AsyncSelect
								id="beach"
								name="beach"
								loadOptions={loadBeaches}
								getOptionLabel={(option) => option.label}
								getOptionValue={(option) => option.value}
								value={formValues.beach}
								onChange={handleBeachChange}
							/>
						</Grid>
						<Grid md={12} justify="space-between">
							<label htmlFor="timeOfDay">Time of Day:</label>
							<Radio.Group
								id="timeOfDay"
								name="timeOfDay"
								isRequired
								value={formValues.timeOfDay}
								onChange={handleTimeOfDayChange}
								orientation="horizontal"
							>
								<Radio
									size="sm"
									value="morning"
									checked={formValues.timeOfDay === "morning"}
								>
									Morning
								</Radio>
								<Radio
									size="sm"
									value="mid-day"
									checked={formValues.timeOfDay === "mid-day"}
								>
									Mid-Day
								</Radio>
								<Radio
									size="sm"
									value="afternoon"
									checked={formValues.timeOfDay === "afternoon"}
								>
									Afternoon
								</Radio>
							</Radio.Group>
						</Grid>
						<Grid md={12} justify="space-between">
							<label htmlFor="surfSize">Size:</label>
							<Input
								type="number"
								id="surfSize"
								name="surfSize"
								required
								value={formValues.surfSize}
								onChange={handleChange}
							/>
						</Grid>
						<Grid md={12} justify="space-between">
							<label htmlFor="surfRating">Surf Rating:</label>
							<SurfRating
								id="surfRating"
								name="surfRating"
								required
								rating={formValues.surfRating}
								onChange={handleSurfRatingChange}
							/>
						</Grid>
						<Grid md={12} justify="flex-end">
							<Button type="submit">Submit</Button>
						</Grid>
					</Grid.Container>
				</form>
			</Card>
		</Grid.Container>
	);
};

export default Form;
