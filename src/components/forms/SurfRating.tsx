"use client";

import {
  ChangeEvent,
  useState,
} from 'react';

import SurfRating from '@/components/inputs/SurfRating';
import {
  FormElement,
  Grid,
  Input,
} from '@nextui-org/react';

import InputWrapper from './helpers/InputWrapper';

export interface SurfRatingFormValues {
	surfRating: number;
	surfSize: number;
	surfShape: number;
}

interface FormProps {
	onChange: (values: SurfRatingFormValues) => void;
}

const SurfRatingForm: React.FC<FormProps> = ({ onChange }) => {
	const [formValues, setFormValues] = useState<SurfRatingFormValues>({
		surfRating: 0,
		surfSize: 0,
		surfShape: 0,
	});

	const handleSurfSizeChange = (e: ChangeEvent<FormElement>) => {
		const { value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			surfSize: parseInt(value),
		}));
		onChange(formValues);
	};

	const handleSurfRatingChange = (rating: number) => {
		setFormValues((prevValues) => ({
			...prevValues,
			surfRating: rating,
		}));
		onChange(formValues);
	};

	const handleSurfShapeChange = (shape: number) => {
		setFormValues((prevValues) => ({
			...prevValues,
			surfShape: shape,
		}));
		onChange(formValues);
	};

	return (
		<Grid.Container gap={2} className="justify-center">
			<InputWrapper label="Surf Size">
				<Input
					type="number"
					id="surfSize"
					name="surfSize"
					required
					value={formValues.surfSize}
					onChange={handleSurfSizeChange}
				/>
			</InputWrapper>

			<InputWrapper label="Surf Shape">
				<SurfRating
					id="surfShape"
					name="surfShape"
					required
					rating={formValues.surfShape}
					onChange={handleSurfShapeChange}
				/>
			</InputWrapper>
			<InputWrapper label="Surf Rating">
				<SurfRating
					id="surfRating"
					name="surfRating"
					required
					rating={formValues.surfRating}
					onChange={handleSurfRatingChange}
				/>
			</InputWrapper>
		</Grid.Container>
	);
};

export default SurfRatingForm;
