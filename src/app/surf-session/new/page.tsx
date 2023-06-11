"use client";
import { useRouter } from 'next/navigation';

import Form, { SubmitValues } from '@/components/forms/SurfActivity';
import { Grid } from '@nextui-org/react';

const AddSurfPage: React.FC = () => {
	const router = useRouter();
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

	return (
		<Grid.Container className="" justify="center">
			<Form onSubmit={handleSubmit} />
		</Grid.Container>
	);
};

export default AddSurfPage;
