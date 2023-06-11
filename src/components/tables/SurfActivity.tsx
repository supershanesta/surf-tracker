"use client";
import { Table } from '@nextui-org/react';

interface SurfActivity {
	date: string;
	beach: string;
	surfRating: number;
	surfSize: number;
	surfShape: number;
}

interface SurfActivityTableProps {
	surfExperiences: SurfActivity[];
}

const SurfActivityTable: React.FC<SurfActivityTableProps> = ({
	surfExperiences,
}) => {
	return (
		<div className="w-full">
			<Table
				css={{
					height: "auto",
					minWidth: "100%",
				}}
			>
				<Table.Header>
					<Table.Column>Date</Table.Column>
					<Table.Column>Beach</Table.Column>
					<Table.Column>Size</Table.Column>
					<Table.Column>Shape</Table.Column>
					<Table.Column>Rating</Table.Column>
				</Table.Header>
				<Table.Body>
					{surfExperiences.length > 0 ? (
						surfExperiences.map((experience, index) => (
							<Table.Row key={index}>
								<Table.Cell>{experience.date}</Table.Cell>
								<Table.Cell>{experience.beach}</Table.Cell>
								<Table.Cell>{experience.surfSize}</Table.Cell>
								<Table.Cell>{experience.surfShape}</Table.Cell>
								<Table.Cell>{experience.surfRating}</Table.Cell>
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
	);
};

export default SurfActivityTable;
