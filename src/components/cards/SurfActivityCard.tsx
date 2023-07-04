import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Setting } from 'react-iconly';

import {
  Badge,
  Button,
  Card,
  Grid,
} from '@nextui-org/react';

import shellSelected from '../../../public/shell-selected.svg';
import { SurfActivity } from './SurfActivityCards';

interface SurfActivityCardProps {
	experience: SurfActivity;
}

const SurfActivityCard: React.FC<SurfActivityCardProps> = ({ experience }) => {
	const {
		id,
		date,
		beach,
		users,
		surfRatingId,
		surfSize,
		surfShape,
		surfRating,
	} = experience;
	const router = useRouter();
	return (
		<Grid md={2}>
			<Card>
				<Card.Header>
					<Grid.Container gap={1} justify="center">
						<Grid xs={8} justify="flex-start">
							{date}
						</Grid>
						<Grid xs={4} justify="flex-end">
							<div onClick={() => router.push(`/surf-session/${id}`)}>
								<Setting />
							</div>
						</Grid>
						<Grid xs={12} justify="center">
							{beach}
						</Grid>
						<Grid xs={12}>
							{users.map((user) => (
								<Badge key={user.id} size="xs" color="primary">
									{user.firstName} {user.lastName}
								</Badge>
							))}
						</Grid>
					</Grid.Container>
				</Card.Header>
				<Card.Body>
					<Grid.Container
						gap={0}
						justify="center"
						className="border border-solid rounded-md"
					>
						{surfRatingId ? (
							<Grid.Container xs={12} justify="center" className="!p-1">
								<Grid xs={12} justify="flex-end">
									<div
										onClick={() => router.push(`/surf-session/${id}/rating`)}
									>
										<Setting />
									</div>
								</Grid>
								<Grid xs={6} justify="center">
									Size: {surfSize}
								</Grid>
								<Grid xs={6} justify="center">
									Shape: {surfShape}
								</Grid>
								<Grid xs={12} justify="center">
									<div className="flex items-center">Rating: </div>
									<div className="relative">
										<Image alt="shell" src={shellSelected} />
										<span className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-20%]">
											{surfRating}
										</span>
									</div>
								</Grid>
							</Grid.Container>
						) : (
							<Grid xs={12} justify="center">
								<Button
									ghost
									onClick={() => router.push(`/surf-session/${id}/rating`)}
								>
									Add your rating
								</Button>
							</Grid>
						)}
					</Grid.Container>
				</Card.Body>
			</Card>
		</Grid>
	);
};

export default SurfActivityCard;
