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
	date: string;
	users: User[] | null;
	beach: Location | null;
	surfRating: number;
	surfSize: number;
	surfShape: number;
}

export interface SubmitValues {
	date: string;
	users: string[] | [];
	beach: string;
	surfRating: number;
	surfSize: number;
	surfShape: number;
}
interface FormProps {
	onSubmit: (values: SubmitValues) => void;
}

const SurfActivityForm: React.FC<FormProps> = ({ onSubmit }) => {
	const [formValues, setFormValues] = useState<FormValues>({
		// get date in local time zone
		date: new Date().toISOString().split("T")[0],
		users: null,
		beach: null,
		surfRating: 0,
		surfSize: 0,
		surfShape: 0,
	});
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
			surfRating: values.surfRating,
			surfSize: values.surfSize,
			surfShape: values.surfShape,
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
								onChange={handleUsersChange}
								className="w-full"
							/>
						</InputWrapper>
						<InputWrapper label="Beach:">
							<SearchSelect
								type={SelectType.Beach}
								onChange={handleBeachChange}
								className="w-full"
							/>
						</InputWrapper>
						<SurfRatingForm onChange={onSurfRatingChange} />
						<Grid md={12} justify="flex-end">
							<Button type="submit">Submit</Button>
						</Grid>
					</Grid.Container>
				</form>
			</Card>
		</Grid.Container>
	);
};

export default SurfActivityForm;
