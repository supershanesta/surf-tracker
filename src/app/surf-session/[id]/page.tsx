"use client";
import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import Form, {
  FormValues,
  SubmitValues,
} from '@/components/forms/SurfActivity';
import api from '@/libs/api';
import { Grid } from '@nextui-org/react';

const AddSurfActivityPage: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const [data, setData] = useState<FormValues | null>(null);

	useEffect(() => {
		api
			.get<FormValues>(`surf-activity`, [{ name: "surfActivityId", value: id }])
			.then((data) => {
				if (data) {
					setData(data);
				}
			});
	}, [id]);

	const handleSubmit = async (values: SubmitValues) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}api/surf-activity`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create surf activity");
			}

			// Handle success
			// redirect to surf activity page
			router.push("/surf-session");
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
		<Grid.Container className="" justify="center">
			<Form data={data} onSubmit={handleSubmit} />
		</Grid.Container>
	);
};

export default AddSurfActivityPage;
