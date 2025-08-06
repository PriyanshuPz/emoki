"use client";

import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Chit {
  id?: string;
  content: string;
  vaultId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChitContextType {
  currentChit: Chit;
  setCurrentChit: (chit: Chit) => void;
  updateContent: (content: string) => void;
  clearChit: () => void;
  saveChit: (vaultId: string) => Promise<void>;
  isLoading: boolean;
}

const ChitContext = createContext<ChitContextType | undefined>(undefined);

export function ChitProvider({ children }: { children: ReactNode }) {
  const [currentChit, setCurrentChit] = useState<Chit>({
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateContent = (content: string) => {
    setCurrentChit((prev) => ({ ...prev, content }));
  };

  const clearChit = () => {
    setCurrentChit({
      content: "",
    });
  };

  const saveChit = async (vaultId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const savedChit: Chit = {
        ...currentChit,
        id: Date.now().toString(),
        vaultId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Chit saved:", savedChit);

      // Show success message
      const { toast } = await import("sonner");
      toast.success("Chit saved successfully! 📝", {
        description: `Saved to vault`,
      });

      // Clear the form after saving
      clearChit();
    } catch (error) {
      console.error("Failed to save chit:", error);
      const { toast } = await import("sonner");
      toast.error("Failed to save chit", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChitContext.Provider
      value={{
        currentChit,
        setCurrentChit,
        updateContent,
        clearChit,
        saveChit,
        isLoading,
      }}
    >
      {children}
    </ChitContext.Provider>
  );
}

export function useChit() {
  const context = useContext(ChitContext);
  if (context === undefined) {
    throw new Error("useChit must be used within a ChitProvider");
  }
  return context;
}
