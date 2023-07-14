import Image from "next/image";

import { Grid, Input } from "@nextui-org/react";

import shellSelected from "../../../public/shell-selected.svg";
import shell from "../../../public/shell.svg";

interface SurfRatingProps {
	id: string;
	name: string;
	required: boolean;
	rating: number;
	onChange: (rating: number) => void;
}

const SurfRating: React.FC<SurfRatingProps> = ({
	id,
	name,
	required,
	rating,
	onChange,
}) => {
	const handleClick = (selectedRating: number) => {
		onChange(selectedRating);
	};

	return (
		<div>
			<Input
				id={id}
				name={name}
				required={required}
				value={rating}
				css={{ display: "none" }}
			/>
			<Grid.Container gap={1} justify="center">
				{Array.from({ length: 4 }, (_, index: number) => (
					<Grid xs={3} md={3} key={index}>
						<div className="relative" onClick={() => handleClick(index + 1)}>
							<Image
								alt="shell"
								src={rating >= index + 1 ? shellSelected : shell}
								className="filter-blue"
							/>
							<span className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-20%]">
								{index + 1}
							</span>
						</div>
					</Grid>
				))}
			</Grid.Container>
			<style jsx>{`
				.button-container {
					position: relative;
				}
				.rating-number {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -35%);
				}
			`}</style>
		</div>
	);
};

export default SurfRating;
