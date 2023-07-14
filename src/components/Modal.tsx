"use client";
import { createPortal } from 'react-dom';

import {
  Button,
  Modal,
  Text,
} from '@nextui-org/react';

import { useModal } from './context/ModalContext';

const ModalWrapper: React.FC = () => {
	const { visible, closeModal, props } = useModal();
	const { callback, text, cancelText, confirmText } = props;

	const onConfirm = async () => {
		await closeModal();
		if (callback) {
			try {
				await callback();
			} catch (e) {
				console.error(e);
			}
		}
	};

	const modal = (
		<Modal
			blur
			aria-labelledby="modal-title"
			open={visible}
			onClose={closeModal}
		>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					{text}
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Text>{text}</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button auto flat color="error" onPress={closeModal}>
					{cancelText}
				</Button>
				<Button auto type="button" onPress={onConfirm}>
					{confirmText}
				</Button>
			</Modal.Footer>
		</Modal>
	);

	if (typeof window === "object") {
		return createPortal(modal, document.body);
	}
	return null;
};

export default ModalWrapper;
