"use client";
import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import { useSnackBar } from '@/components/context/SnackBarContext';
import Form from '@/components/forms/SurfActivity';
import api from '@/libs/api';
import { UpdateSurfActivityInputType } from '@/types/api';
import { SurfActivityFormType } from '@/types/forms';
import { SurfActivityType } from '@/types/types';
import { Grid } from '@nextui-org/react';

const formToApi = (
	id: string,
	values: SurfActivityFormType
): UpdateSurfActivityInputType => {
	return {
		...values,
		id,
		beach: values.beach?.id || "",
		users: values.users?.map((user) => user.id) || [],
	};
};

const AddSurfPage: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const { openSnackBar } = useSnackBar();
	const [data, setData] = useState<SurfActivityType | null>(null);
	const [error, setError] = useState<boolean>(false);
	const handleSubmit = async (values: SurfActivityFormType) => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_URL}api/surf-activity/${id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formToApi(id, values)),
				}
			);

			if (!response.ok) {
				openSnackBar("error", "Error Updating Surf Session");
				throw new Error("Failed to create surf activity");
			}

			// Handle success
			// redirect to surf activity page
			openSnackBar("success", "Surf Session Updated!");
			router.push("/surf-session");
		} catch (error) {
			// Handle error
			console.error("Error:", error);
			// You can show an error message to the user
		}
	};

	useEffect(() => {
		api.get<SurfActivityType>(`surf-activity/${id}`).then((data) => {
			if (data) {
				setData(data);
			} else {
				setError(true);
			}
		});
	}, [id]);
	if (error) {
		return <div>error</div>;
	}
	if (!data) {
		return <div>Loading...</div>;
	}
	return (
		<Grid.Container className="" justify="center">
			<Form onSubmit={handleSubmit} data={data} showRating={false} />
		</Grid.Container>
	);
};

export default AddSurfPage;
