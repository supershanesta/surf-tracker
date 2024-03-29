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
import api from '@/libs/api';
import { UpdateSurfActivityInputType } from '@/types/api';
import { SurfActivityFormType } from '@/types/forms';
import { SurfActivityType } from '@/types/types';
import {
  Badge,
  Card,
  Grid,
  Table,
} from '@nextui-org/react';

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

const SurfActivitDetails: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const { openSnackBar } = useSnackBar();
	const [data, setData] = useState<SurfActivityType | null>(null);
	const [error, setError] = useState<boolean>(false);

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
			<Grid.Container gap={2} className="sm:center" md={3}>
				<Card className="!py-5">
					<Grid.Container gap={2} className="justify-center">
						<Grid xs={12} md={12} justify="space-between" alignItems="center">
							<h1 className="text-3xl font-bold text-center">
								{data.beach.name}
							</h1>
							<h2 className="text-xl font-bold text-center">{data.date}</h2>
						</Grid>
						<Grid xs={12} md={12} justify="space-between" alignItems="center">
							<h3 className="text-xl font-bold text-center">
								{data.mySurfRating?.size}ft
							</h3>
							<h3 className="text-xl font-bold text-center">
								Shape: {data.mySurfRating?.shape}
							</h3>
							<h3 className="text-xl font-bold text-center">
								Rating: {data.mySurfRating?.rating}
							</h3>
						</Grid>
						<Grid xs={12} md={12} justify="space-between" alignItems="center">
							<h3 className="text-xl font-bold text-center">
								{data.mySurfRating?.notes}
							</h3>
						</Grid>
						<Grid xs={12} md={12} justify="space-between" alignItems="center">
							{data.users.map((user) => (
								<Badge key={user.id} size="md" color="primary">
									{user.firstName} {user.lastName}
								</Badge>
							))}
						</Grid>
						<Grid xs={12} md={12} justify="space-between" alignItems="center">
							<div className="w-full">
								<Table
									css={{
										height: "auto",
										minWidth: "100%",
									}}
								>
									<Table.Header>
										<Table.Column>Person</Table.Column>
										<Table.Column>Size</Table.Column>
										<Table.Column>Shape</Table.Column>
										<Table.Column>Rating</Table.Column>
										<Table.Column>Notes</Table.Column>
									</Table.Header>
									<Table.Body>
										{data.surfRatings.length > 0 ? (
											data.surfRatings.map((rating, index) => (
												<Table.Row key={index}>
													<Table.Cell>
														<Badge
															key={rating.user.id}
															size="md"
															color="primary"
														>
															{rating.user.firstName} {rating.user.lastName}
														</Badge>
													</Table.Cell>
													<Table.Cell>{rating.size}</Table.Cell>
													<Table.Cell>{rating.shape}</Table.Cell>
													<Table.Cell>
														{rating.rating === 0 ? "N/A" : rating.rating}
													</Table.Cell>
													<Table.Cell>{rating.notes}</Table.Cell>
												</Table.Row>
											))
										) : (
											<Table.Row key={0}>
												<Table.Cell>{}</Table.Cell>
												<Table.Cell>{}</Table.Cell>
												<Table.Cell>No surf experiences found.</Table.Cell>
												<Table.Cell>{}</Table.Cell>
												<Table.Cell>{}</Table.Cell>
											</Table.Row>
										)}
									</Table.Body>
								</Table>
							</div>
						</Grid>
					</Grid.Container>
				</Card>
			</Grid.Container>
		</Grid.Container>
	);
};

export default SurfActivitDetails;
