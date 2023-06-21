"use client";
import useModal from '@/app/hooks/useModal';
import {
  Button,
  Modal,
  Text,
} from '@nextui-org/react';

const ModalWrapper: React.FC = () => {
	const { visible, closeModal } = useModal();
	console.log(visible);

	const closeHandler = () => {
		closeModal();
		console.log("closed");
	};

	return (
		<Modal
			closeButton
			blur
			aria-labelledby="modal-title"
			open={visible}
			onClose={closeHandler}
		>
			<Modal.Header>
				<Text id="modal-title" size={18}>
					Are you Sure?
				</Text>
			</Modal.Header>
			<Modal.Body>
				<Text>
					This action is irreversible. Are you sure you want to delete this
					item?
				</Text>
			</Modal.Body>
			<Modal.Footer>
				<Button auto flat color="error" onPress={closeHandler}>
					Close
				</Button>
				<Button auto onPress={closeHandler}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ModalWrapper;
