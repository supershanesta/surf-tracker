"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';

import {
  Button,
  Card,
  FormElement,
  Grid,
  Input,
} from '@nextui-org/react';
import {
  Location,
  User,
} from '@prisma/client';

import SearchSelect, { SelectType } from '../inputs/SearchSelect';
import InputWrapper from './helpers/InputWrapper';
import SurfRatingForm, { SurfRatingFormValues } from './SurfRating';

export interface FormValues {
	id?: string;
	date: string;
	users: User[] | null;
	beach: Location | null;
	surfRating?: SurfRatingFormValues;
	createdBy?: string;
}

export interface SubmitValues {
	date: string;
	users: string[] | [];
	beach: string;
	surfRating?: SurfRatingFormValues;
}
interface FormProps {
	onSubmit: (values: SubmitValues) => void;
	data?: FormValues | null;
}

const defaultValues: FormValues = {
	date: new Date().toISOString().split("T")[0],
	users: null,
	beach: null,
	surfRating: {
		surfRating: 0,
		surfSize: 0,
		surfShape: 0,
	},
};

const SurfActivityForm: React.FC<FormProps> = ({ onSubmit, data }) => {
	console.log(data);
	const [formValues, setFormValues] = useState<FormValues>(
		data || defaultValues
	);
	console.log(formValues);
	const handleChange = (e: ChangeEvent<FormElement | HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const onSurfRatingChange = (values: SurfRatingFormValues) => {
		setFormValues((prevValues) => ({
			...prevValues,
			surfRating: values,
		}));
	};

	const handleBeachChange = (selectedOption: Location | null) => {
		setFormValues((prevValues) => ({
			...prevValues,
			beach: selectedOption,
		}));
	};

	const handleUsersChange = (selectedOption: User[] | null) => {
		setFormValues((prevValues) => ({
			...prevValues,
			users: selectedOption,
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formValues);
		const parseValues = {
			...formValues,
			beach: formValues.beach?.id || "",
			users: formValues.users?.map((user) => user.id) || [],
		};
		console.log(parseValues);
		onSubmit(parseValues);
	};
	return (
		<Grid.Container gap={2} className="sm:center" md={3}>
			<Card>
				<form onSubmit={handleSubmit}>
					<Grid.Container gap={2} className="justify-center">
						<InputWrapper label="Date:">
							<Input
								type="date"
								id="date"
								name="date"
								required
								value={formValues.date}
								onChange={handleChange}
							/>
						</InputWrapper>
						<InputWrapper label="Users:">
							<SearchSelect
								type={SelectType.User}
								defaultValue={formValues.users}
								onChange={handleUsersChange}
								className="w-full"
							/>
						</InputWrapper>
						<InputWrapper label="Beach:">
							<SearchSelect
								defaultValue={formValues.beach}
								type={SelectType.Beach}
								onChange={handleBeachChange}
								className="w-full"
							/>
						</InputWrapper>
						<SurfRatingForm
							defaults={formValues.surfRating}
							onChange={onSurfRatingChange}
						/>
						<Grid.Container gap={1} justify="space-around">
							{data && (
								<Grid xs={12} md={5} justify="center">
									<Button size="sm" type="button">
										Delete
									</Button>
								</Grid>
							)}

							<Grid xs={12} md={5} justify="center">
								<Button size="sm" type="submit">
									Submit
								</Button>
							</Grid>
						</Grid.Container>
					</Grid.Container>
				</form>
			</Card>
		</Grid.Container>
	);
};

export default SurfActivityForm;
