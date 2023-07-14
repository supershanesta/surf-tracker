"use client";
import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import { useSnackBar } from '@/components/context/SnackBarContext';
import Form from '@/components/forms/SurfRating';
import api from '@/libs/api';
import { SurfRatingFormType } from '@/types/forms';
import { SurfRatingType } from '@/types/types';
import {
  Button,
  Card,
  Grid,
} from '@nextui-org/react';

const SurfRating: React.FC = () => {
	const router = useRouter();
	const { id, ratingId } = useParams();
	const { openSnackBar } = useSnackBar();
	const [data, setData] = useState<SurfRatingFormType | null>(null);
	const [formValues, setFormValues] = useState<SurfRatingFormType>({
		notes: "",
		rating: 0,
		size: 0,
		shape: 0,
	});
	const onSurfRatingChange = (values: SurfRatingFormType) => {
		setFormValues((prevValues) => ({
			...prevValues,
			notes: values.notes,
			rating: values.rating,
			size: values.size,
			shape: values.shape,
		}));
	};

	useEffect(() => {
		api.get<SurfRatingType>(`surf-rating/${ratingId}`).then((data) => {
			if (data) {
				setData({
					...data,
				});
			} else {
				setData({
					notes: "",
					rating: 0,
					size: 0,
					shape: 0,
				});
			}
		});
	}, [ratingId]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const values = {
			...formValues,
		};
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}api/surf-rating/${ratingId}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);

			console.log("RESPONSE", response);

			if (!response.ok) {
				openSnackBar("error", "Error Updating Surf Rating");
				throw new Error("Failed to create surf activity");
			}

			openSnackBar("success", "Surf Rating Updated");
			await router.push("/surf-session");
		} catch (error) {
			// Handle error
			console.error("Error:", error);
			// You can show an error message to the user
		}
	};
	if (!data) {
		return <div>Loading...</div>;
	}
	return (
		<div className="flex justify-center">
			<Grid.Container gap={2} className="sm:center" md={3}>
				<Card>
					<form onSubmit={handleSubmit}>
						<Form onChange={onSurfRatingChange} defaults={data} />
						<Grid.Container gap={2} justify="space-around">
							<Grid>
								<Button
									auto
									color="error"
									onPress={() => router.push("/surf-session")}
								>
									Cancel
								</Button>
							</Grid>
							<Grid>
								<Button auto type="submit">
									Submit
								</Button>
							</Grid>
						</Grid.Container>
					</form>
				</Card>
			</Grid.Container>
		</div>
	);
};

export default SurfRating;
