import { create } from "zustand";

interface DefaultModal {
  extras: any;
  isOpen: boolean;
  onOpen: (extras?: any) => void;
  onClose: () => void;
}

const defaultModalValues = (set: any) => ({
  isOpen: false,
  extras: {},
  onOpen: (extras?: any) => set({ isOpen: true, extras }),
  onClose: () => set({ isOpen: false, extras: {} }),
});

interface VaultModalStore extends DefaultModal {
  vaults: any[];
  selectedVaultId: string;
  setSelectedVaultId: (id: string) => void;
}

export const useVaultStore = create<VaultModalStore>((set) => ({
  ...defaultModalValues(set),
  vaults: [],
  selectedVaultId: "",
  setSelectedVaultId: (id: string) => set({ selectedVaultId: id }),
}));
