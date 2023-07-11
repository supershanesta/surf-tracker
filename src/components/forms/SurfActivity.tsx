"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { useModal } from '@/components/context/ModalContext';
import { useSnackBar } from '@/components/context/SnackBarContext';
import {
  SurfActivityFormType,
  SurfRatingFormType,
} from '@/types/forms';
import {
  LocationType,
  SurfActivityType,
} from '@/types/types';
import {
  Button,
  Card,
  FormElement,
  Grid,
  Input,
} from '@nextui-org/react';
import { User } from '@prisma/client';

import { SelectType } from '../inputs/SearchSelect';
import InputWrapper from './helpers/InputWrapper';
import SurfRatingForm from './SurfRating';

const SearchSelect = dynamic(() => import("../inputs/SearchSelect"), {
	ssr: false,
});

interface FormProps {
	onSubmit: (values: SurfActivityFormType) => void;
	data?: SurfActivityType | null;
	showRating?: boolean;
}

const defaultValues: SurfActivityFormType = {
	date: new Date().toLocaleDateString("en-CA"),
	users: [],
	beach: null,
	surfRating: {
		rating: 0,
		size: 0,
		shape: 0,
	},
};

const SurfActivityForm: React.FC<FormProps> = ({
	onSubmit,
	data,
	showRating = false,
}) => {
	const { openModal, visible } = useModal();
	const { openSnackBar } = useSnackBar();
	const router = useRouter();

	const deleteSurfActivity = useCallback(async () => {
		const id = data?.id;
		const res = await fetch(`/api/surf-activity/${id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			throw new Error("Something went wrong");
		}

		router.push("/surf-session");
		openSnackBar("success", "Surf activity deleted");
	}, [data?.id, openSnackBar, router]);

	const openModalTest = (id: string) => {
		openModal(() => deleteSurfActivity(), "Are you sure?", "Cancel", "Delete");
	};
	const [formValues, setFormValues] = useState<SurfActivityFormType>(
		data
			? {
					id: data.id,
					date: data.date,
					users: data.users,
					beach: data.beach,
					surfRating: data?.mySurfRating || defaultValues.surfRating,
			  }
			: defaultValues
	);
	const handleChange = (e: ChangeEvent<FormElement | HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const onSurfRatingChange = (values: SurfRatingFormType) => {
		setFormValues((prevValues) => ({
			...prevValues,
			surfRating: values,
		}));
	};

	const handleBeachChange = (selectedOption: LocationType | null) => {
		setFormValues((prevValues) => ({
			...prevValues,
			beach: selectedOption,
		}));
	};

	const handleUsersChange = (selectedOption: User[] | null) => {
		setFormValues((prevValues) => ({
			...prevValues,
			users: selectedOption || [],
		}));
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("are we subitting in form?");
		onSubmit(formValues);
	};
	return (
		<Grid.Container gap={2} className="sm:center" md={3}>
			<Card className="!py-5">
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
						{showRating && (
							<SurfRatingForm
								defaults={formValues.surfRating}
								onChange={onSurfRatingChange}
							/>
						)}
						<Grid.Container gap={1} justify="space-around">
							{data && (
								<Grid xs={5} md={5} justify="center">
									<Button
										color={"error"}
										size="sm"
										type="button"
										onPress={() => openModalTest(data.id)}
									>
										Delete
									</Button>
								</Grid>
							)}

							<Grid xs={5} md={5} justify="center">
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
