"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from 'react';

import SurfRating from '@/components/inputs/SurfRating';
import { SurfRatingFormType } from '@/types/forms';
import {
  FormElement,
  Grid,
  Input,
  Textarea,
} from '@nextui-org/react';

import InputWrapper from './helpers/InputWrapper';

interface FormProps {
	onChange: (values: SurfRatingFormType) => void;
	defaults?: SurfRatingFormType;
}

const SurfRatingForm: React.FC<FormProps> = ({ onChange, defaults }) => {
	const [formValues, setFormValues] = useState<SurfRatingFormType>({
		id: defaults?.id || undefined,
		notes: defaults?.notes || "",
		rating: defaults?.rating || 0,
		size: defaults?.size || 0,
		shape: defaults?.shape || 0,
	});
	const textareaRef = useRef(null);

	const handleSurfNoteChange = (e: ChangeEvent<FormElement>) => {
		const { value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			notes: value,
		}));
		onChange({ ...formValues, notes: value });
	};

	const handleSurfSizeChange = (e: ChangeEvent<FormElement>) => {
		const { value } = e.target;
		setFormValues((prevValues) => ({
			...prevValues,
			size: parseInt(value),
		}));
		onChange({ ...formValues, size: parseInt(value) });
	};

	const handleSurfRatingChange = (rating: number) => {
		setFormValues((prevValues) => ({
			...prevValues,
			rating: rating,
		}));
		onChange({ ...formValues, rating: rating });
	};

	const handleSurfShapeChange = (shape: number) => {
		setFormValues((prevValues) => ({
			...prevValues,
			shape: shape,
		}));
		onChange({ ...formValues, shape: shape });
	};

	return (
		<Grid.Container gap={2} className="justify-center">
			<InputWrapper label="Surf Size">
				<Input
					type="number"
					id="size"
					name="size"
					required
					value={formValues.size}
					onChange={handleSurfSizeChange}
				/>
			</InputWrapper>

			<InputWrapper label="Surf Shape">
				<SurfRating
					id="shape"
					name="shape"
					required
					rating={formValues.shape}
					onChange={handleSurfShapeChange}
				/>
			</InputWrapper>
			<InputWrapper label="Surf Rating">
				<SurfRating
					id="rating"
					name="rating"
					required
					rating={formValues.rating}
					onChange={handleSurfRatingChange}
				/>
			</InputWrapper>
			<InputWrapper label="Note">
				<Textarea
					ref={textareaRef}
					id="notes"
					name="notes"
					fullWidth={true}
					initialValue={formValues.notes || ""}
					placeholder="It was gnarly! ......"
					onChange={handleSurfNoteChange}
				/>
			</InputWrapper>
		</Grid.Container>
	);
};

export default SurfRatingForm;
