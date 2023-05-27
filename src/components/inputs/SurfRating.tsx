import { Button, Input } from "@nextui-org/react";

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
			<div className="flex">
				{Array.from({ length: 4 }, (_, index: number) => (
					<Button
						key={index}
						bordered
						auto
						color={rating >= index + 1 ? "primary" : "secondary"}
						onClick={() => handleClick(index + 1)}
					>
						{index + 1}
					</Button>
				))}
			</div>
		</div>
	);
};

export default SurfRating;
