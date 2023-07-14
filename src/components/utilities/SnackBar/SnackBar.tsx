"use client";
import './styles.css';

import React from 'react';
import { createPortal } from 'react-dom';

import { useSnackBar } from '@/components/context/SnackBarContext';

const SnackBar: React.FC = () => {
	const { visible, props } = useSnackBar();
	const { text, type } = props;
	const className = ["snackbar", visible ? "show" : "", type].join(" ");
	const snackbar = (
		<div id="snackbar" className={className} hidden={!visible}>
			{text}
		</div>
	);
	if (typeof window === "object") {
		return createPortal(snackbar, document.body);
	}
	return null;
};

export default SnackBar;
