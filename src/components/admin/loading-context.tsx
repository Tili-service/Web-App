"use client";

import { createContext, useContext } from 'react';

export type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading doit être utilisé à l'intérieur d'un AdminLayout");
  return context;
}
