"use client";
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

interface ModalContextType {
	callback?: (() => void) | (() => Promise<void>);
	text?: string;
	cancelText?: string;
	confirmText?: string;
}

type openModalProps = (
	callback?: (() => void) | (() => Promise<void>),
	text?: string,
	cancelText?: string,
	confirmText?: string
) => void;

interface ModalContextValue {
	visible: boolean;
	openModal: openModalProps;
	closeModal: () => void;
	props: ModalContextType;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const defaultValues: ModalContextType = {
	callback: undefined,
	text: "Are you sure?",
	cancelText: "Cancel",
	confirmText: "Confirm",
};

export const useModal = (): ModalContextValue => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};

interface ModalProviderProps {
	children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
	const [visible, setVisible] = useState(false);
	const [modalProps, setModalProps] = useState<ModalContextType>(defaultValues);

	const openModalFunction: openModalProps = (
		callback?: (() => void) | (() => Promise<void>),
		text?: string,
		cancelText?: string,
		confirmText?: string
	) => {
		setModalProps({
			callback,
			text,
			cancelText,
			confirmText,
		});
		setVisible(true);
	};

	const closeModal = async () => {
		setModalProps(defaultValues);
		setVisible(false);
	};

	const contextValue: ModalContextValue = {
		visible,
		openModal: openModalFunction,
		closeModal,
		props: modalProps,
	};

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
		</ModalContext.Provider>
	);
};
