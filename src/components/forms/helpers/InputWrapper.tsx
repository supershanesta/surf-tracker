import React from 'react';

import { Grid } from '@nextui-org/react';

interface InputWrapperProps {
	label: string;
	children: React.ReactNode;
}

const InputWrapper: React.FC<InputWrapperProps> = ({
	children,
	label,
	...props
}) => {
	return (
		<Grid.Container xs={12} gap={2} justify="space-between">
			<Grid xs={12} md={2}>
				<label className="self-center">{label}</label>
			</Grid>
			<Grid xs={12} md={10}>
				{children}
			</Grid>
		</Grid.Container>
	);
};

export default InputWrapper;
