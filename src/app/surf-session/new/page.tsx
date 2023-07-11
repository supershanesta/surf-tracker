"use client";
import { useRouter } from 'next/navigation';

import { useSnackBar } from '@/components/context/SnackBarContext';
import Form from '@/components/forms/SurfActivity';
import { CreateSurfActivityInputType } from '@/types/api';
import { SurfActivityFormType } from '@/types/forms';
import { Grid } from '@nextui-org/react';

const formToApi = (
	values: SurfActivityFormType
): CreateSurfActivityInputType => {
	return {
		...values,
		beach: values.beach?.id || "",
		users: values.users?.map((user) => user.id) || [],
	};
};

const AddSurfPage: React.FC = () => {
	const router = useRouter();
	const { openSnackBar } = useSnackBar();
	const handleSubmit = async (values: SurfActivityFormType) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}api/surf-activity`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formToApi(values)),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create surf activity");
			}

			// Handle success
			// redirect to surf activity page

			router.push("/surf-session");
			openSnackBar("success", "Surf activity created");
		} catch (error) {
			// Handle error
			console.error("Error:", error);
			// You can show an error message to the user
		}
	};

	return (
		<Grid.Container className="" justify="center">
			<Form onSubmit={handleSubmit} showRating={true} />
		</Grid.Container>
	);
};

export default AddSurfPage;
