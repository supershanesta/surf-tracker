"use client";
import Form, { FormValues } from "@/components/forms/SurfForm";
import { Grid } from "@nextui-org/react";

const AddSurfPage: React.FC = () => {
	const handleSubmit = (values: FormValues) => {
		// Handle form submission
		console.log(values);
	};

	return (
		<Grid.Container className="" justify="center">
			<Form onSubmit={handleSubmit} />
		</Grid.Container>
	);
};

export default AddSurfPage;
