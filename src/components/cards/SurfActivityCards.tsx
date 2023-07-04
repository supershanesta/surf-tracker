"use client";
import { useRouter } from 'next/navigation';

import {
  Button,
  Card,
  Grid,
} from '@nextui-org/react';

import SurfActivityCard from './SurfActivityCard';

export interface SurfActivityUser {
	id: string;
	firstName: string;
	lastName: string;
}
export interface SurfActivity {
	id: string;
	date: string;
	beach: string;
	users: SurfActivityUser[];
	surfRatingId?: string;
	surfRating?: number;
	surfSize?: number;
	surfShape?: number;
}

interface SurfActivityCardProps {
	surfExperiences: SurfActivity[];
}

const SurfActivityCards: React.FC<SurfActivityCardProps> = ({
	surfExperiences,
}) => {
	const router = useRouter();
	return (
		<div className="w-full">
			<Grid.Container gap={2} justify="center">
				{surfExperiences.length > 0 ? (
					surfExperiences.map((experience, index) => (
						<SurfActivityCard key={index} experience={experience} />
					))
				) : (
					<Card>
						<Card.Body>
							<Button ghost onClick={() => router.push("/add-surf-experience")}>
								Add Surf Experience
							</Button>
						</Card.Body>
					</Card>
				)}
			</Grid.Container>
		</div>
	);
};

export default SurfActivityCards;
