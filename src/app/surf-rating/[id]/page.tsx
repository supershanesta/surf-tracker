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

import useModal from '@/app/hooks/useModal';
import Form, { SurfRatingFormValues } from '@/components/forms/SurfRating';
import api, { SurfRatingType } from '@/libs/api';
import {
  Button,
  Card,
  Grid,
} from '@nextui-org/react';

const SurfRating: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const { openModal } = useModal();
	const [data, setData] = useState<SurfRatingFormValues | null>(null);
	const [formValues, setFormValues] = useState<SurfRatingFormValues>({
		surfRating: 0,
		surfSize: 0,
		surfShape: 0,
	});
	const onSurfRatingChange = (values: SurfRatingFormValues) => {
		console.log(values);
		setFormValues({
			surfRating: values.surfRating,
			surfSize: values.surfSize,
			surfShape: values.surfShape,
		});
	};
	useEffect(() => {
		api
			.get<SurfRatingType>(`surf-rating`, [
				{ name: "surfActivityId", value: id },
			])
			.then((data) => {
				console.log(data);
				if (data) {
					setData({
						surfRating: data.rating,
						surfSize: data.size,
						surfShape: data.shape,
					});
				} else {
					setData({
						surfRating: 0,
						surfSize: 0,
						surfShape: 0,
					});
				}
			});
	}, [id]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const values = {
			surfActivityId: id,
			...formValues,
		};
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}api/surf-rating`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);

			console.log("RESPONSE", response);

			if (!response.ok) {
				throw new Error("Failed to create surf activity");
			}

			// Handle success
			// redirect to surf activity page
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
						<Grid.Container gap={2}>
							<Grid>
								<Button
									color={"error"}
									onPress={() => {
										console.log("hello world"), openModal();
									}}
								>
									Delete
								</Button>
							</Grid>
							<Grid>
								<Button type="submit">Submit</Button>
							</Grid>
						</Grid.Container>
					</form>
				</Card>
			</Grid.Container>
		</div>
	);
};

export default SurfRating;
