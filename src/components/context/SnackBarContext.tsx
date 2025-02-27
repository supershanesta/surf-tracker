'use client';
import React, { createContext, useContext, useState } from 'react';

interface SnackBarContextType {
  type: 'success' | 'error' | 'warning' | 'info';
  text?: string;
}

type openSnackBarContextType = (
  type: 'success' | 'error' | 'warning' | 'info',
  text?: string
) => void;

interface SnackBarContextValue {
  visible: boolean;
  openSnackBar: openSnackBarContextType;
  closeSnackBar: () => void;
  props: SnackBarContextType;
}

const SnackBarContext = createContext<SnackBarContextValue | undefined>(
  undefined
);

const defaultValues: SnackBarContextType = {
  type: 'info',
  text: 'Are you sure?',
};

export const useSnackBar = (): SnackBarContextValue => {
  const context = useContext(SnackBarContext);
  if (!context) {
    throw new Error('useSnackBar must be used within a SnackBarProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const SnackBarProvider: React.FC<ModalProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [snackBarProps, setSnackBarProps] =
    useState<SnackBarContextType>(defaultValues);

  const openSnackBar: openSnackBarContextType = (
    type: 'success' | 'error' | 'warning' | 'info',
    text?: string
  ) => {
    setVisible(true);
    setSnackBarProps({
      type,
      text,
    });

    setTimeout(() => {
      closeSnackBar();
    }, 3000); // Snackbar auto closes after 3 seconds*/
  };

  const closeSnackBar = () => {
    setVisible(false);
    setSnackBarProps(defaultValues);
  };

  const contextValue: SnackBarContextValue = {
    visible,
    openSnackBar,
    closeSnackBar,
    props: snackBarProps,
  };

  return (
    <SnackBarContext.Provider value={contextValue}>
      {children}
    </SnackBarContext.Provider>
  );
};
