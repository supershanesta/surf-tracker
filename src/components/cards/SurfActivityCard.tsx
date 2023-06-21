import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Setting } from 'react-iconly';

import {
  Card,
  Grid,
} from '@nextui-org/react';

import shellSelected from '../../../public/shell-selected.svg';
import { SurfActivity } from './SurfActivityCards';

interface SurfActivityCardProps {
	experience: SurfActivity;
}

const SurfActivityCard: React.FC<SurfActivityCardProps> = ({ experience }) => {
	const { id, date, beach, surfSize, surfShape, surfRating } = experience;
	const router = useRouter();
	return (
		<Grid md={2}>
			<Card>
				<Card.Header>
					<Grid md={8} justify="flex-start">
						{date}
					</Grid>
					<Grid md={4} justify="flex-end">
						<div onClick={() => router.push(`/surf-rating/${id}`)}>
							<Setting set="bold" />
						</div>
					</Grid>
				</Card.Header>
				<Card.Body>
					<Grid.Container gap={2} justify="center">
						<Grid xs={12} justify="center">
							Beach: {beach}
						</Grid>
						<Grid.Container xs={12} justify="center">
							<Grid xs={12} justify="center">
								Size: {surfSize}
							</Grid>
							<Grid xs={12} justify="center">
								Shape: {surfShape}
							</Grid>
							<Grid xs={12} justify="center">
								Rating:{" "}
								<div className="relative">
									<Image alt="shell" src={shellSelected} />
									<span className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-20%]">
										{surfRating}
									</span>
								</div>
							</Grid>
						</Grid.Container>
					</Grid.Container>
				</Card.Body>
			</Card>
		</Grid>
	);
};

export default SurfActivityCard;
