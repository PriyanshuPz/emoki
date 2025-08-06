"use client";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useVaultStore } from "@/stores/modal-store";
import { Plus, X } from "lucide-react";
import { SoundButton } from "./sound-button";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
interface Vault {
  id: string;
  name: string;
  description: string;
  chitCount: number;
}

// Mock vaults data - replace with actual data from your backend
const mockVaults: Vault[] = [
  {
    id: "1",
    name: "Personal Thoughts",
    description: "Private thoughts and reflections",
    chitCount: 12,
  },

  {
    id: "4",
    name: "Learning Journal",
    description: "Study notes and insights",
    chitCount: 15,
  },
  {
    id: "2",
    name: "Learning Journal",
    description: "Study notes and insights",
    chitCount: 15,
  },
  {
    id: "5",
    name: "Learning Journal",
    description: "Study notes and insights",
    chitCount: 15,
  },
];

export default function VaultSelectorModal() {
  const state = useVaultStore();
  const { data, isLoading } = useQuery(trpc.fetchVaults.queryOptions());

  return (
    <Drawer open={state.isOpen} onOpenChange={state.onClose}>
      <DrawerContent className="max-w-md rounded-t-4xl border-2 mx-auto">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-bold">Your Vaults</DrawerTitle>
          <DrawerDescription>
            Your vaults are where you can save your chits. Choose one to
            continue.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Loading vaults...</p>
            </div>
          )}
          {data &&
            data.map((vault) => (
              <Link key={vault.id} href={`/vault/${vault.id}`}>
                <SoundButton
                  key={vault.id}
                  type="button"
                  variant="outline"
                  className="w-full text-left p-4 h-auto border-2 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-sm">{vault.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {vault.description}
                      </p>
                    </div>
                  </div>
                </SoundButton>
              </Link>
            ))}
        </div>

        <DrawerFooter className="flex flex-row justify-between items-center p-4 border-t">
          <SoundButton
            type="button"
            variant="outline"
            className="p-4 border-2 border-dashed rounded-sm hover:bg-blue-50 transition-colors"
            onClick={() => {
              console.log("Create new vault");
            }}
          >
            <Plus className="w-4 h-4 text-blue-400" />
            Create New Vault
          </SoundButton>
          <SoundButton
            onClick={state.onClose}
            variant="ghost"
            className="rounded-sm"
          >
            <X className="w-4 h-4 text-gray-500" />
          </SoundButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
