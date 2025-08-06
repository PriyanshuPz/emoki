"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc, queryClient } from "@/utils/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  Edit,
  FileText,
  Plus,
  Calendar,
  Move,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

import moment from "moment";

interface Chit {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Vault {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: string;
}

interface VaultData {
  vault: Vault;
  chits: Chit[];
}

export default function VaultDetailPage() {
  const params = useParams();
  const vaultId = params.id as string;

  const [deleteChitDialogOpen, setDeleteChitDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [chitToDelete, setChitToDelete] = useState<string | null>(null);
  const [chitToTransfer, setChitToTransfer] = useState<string | null>(null);
  const [selectedTargetVault, setSelectedTargetVault] = useState<string>("");

  const { data: vaultData, isLoading } = useQuery(
    trpc.getVaultWithChits.queryOptions({
      vaultId,
    })
  );

  const { data: allVaults } = useQuery(trpc.fetchVaults.queryOptions());

  const deleteChitMutation = useMutation(
    trpc.deleteChit.mutationOptions({
      onSuccess: () => {
        toast.success("Chit deleted successfully");

        queryClient.invalidateQueries({
          queryKey: trpc.getVaultWithChits.queryKey({
            vaultId,
          }),
        });
        setDeleteChitDialogOpen(false);
        setChitToDelete(null);
      },
    })
  );

  const transferChitMutation = useMutation(
    trpc.transferChit.mutationOptions({
      onSuccess: () => {
        toast.success("Chit transferred successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.getVaultWithChits.queryKey({
            vaultId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.getVaultsWithCounts.pathKey(),
        });
        setTransferDialogOpen(false);
        setChitToTransfer(null);
        setSelectedTargetVault("");
      },
    })
  );

  const handleDeleteChit = (chitId: string) => {
    setChitToDelete(chitId);
    setDeleteChitDialogOpen(true);
  };

  const handleTransferChit = (chitId: string) => {
    setChitToTransfer(chitId);
    setTransferDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chitToDelete) {
      deleteChitMutation.mutate({
        chitId: chitToDelete,
      });
    }
  };

  const confirmTransfer = () => {
    if (chitToTransfer && selectedTargetVault) {
      transferChitMutation.mutate({
        chitId: chitToTransfer,
        targetVaultId: selectedTargetVault,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-paper-900 mx-auto mb-4"></div>
              <p className="text-paper-600">Loading vault...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vaultData) {
    return (
      <div className="min-h-screen bg-paper-100">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-game text-paper-900 mb-2">
                Vault not found
              </h2>
              <p className="text-paper-600 mb-6">
                The vault you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <Link href="/vaults">
                <Button className="game-button">Back to Vaults</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableVaults = allVaults?.filter((v) => v.id !== vaultId) || [];

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/vaults">
                <Button variant="outline" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vaults
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/paper">
                <Button className="game-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chit
                </Button>
              </Link>
            </div>
          </div>

          {/* Vault Details */}
          <div className="bg-white border-2 border-paper-300 rounded-sm p-6 mb-8">
            <h1 className="text-3xl font-game text-paper-900 mb-2">
              {vaultData.vault.name}
            </h1>
            <p className="text-paper-600 mb-4">
              {vaultData.vault.description || "No description provided"}
            </p>
            <div className="flex items-center space-x-4 text-sm text-paper-500">
              <span>
                Created: {moment(vaultData.vault.createdAt).fromNow()}
              </span>
            </div>
          </div>

          {/* Vault Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border-2 border-paper-300 rounded-sm p-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-paper-600 mr-2" />
                <div>
                  <p className="text-2xl font-game text-paper-900">
                    {vaultData.chits.length}
                  </p>
                  <p className="text-paper-600 text-sm">Chits</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-paper-300 rounded-sm p-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-paper-600 mr-2" />
                <div>
                  <p className="text-lg font-game text-paper-900">
                    {new Date(vaultData.vault.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-paper-600 text-sm">Created</p>
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-paper-300 rounded-sm p-4">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-2">
                  {vaultData.vault.isPublic ? "🌍" : "🔒"}
                </div>
                <div>
                  <p className="text-lg font-game text-paper-900">
                    {vaultData.vault.isPublic ? "Public" : "Private"}
                  </p>
                  <p className="text-paper-600 text-sm">Visibility</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chits List */}
          <div className="space-y-4">
            <h2 className="text-xl font-game text-paper-900 mb-4">
              Chits in this vault
            </h2>

            {vaultData.chits.length > 0 ? (
              vaultData.chits.map((chit) => (
                <div
                  key={chit.id}
                  className="bg-white border-2 border-paper-300 rounded-sm p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="chit-content bg-paper-50 border border-paper-200 rounded-sm p-4 mb-3 font-mono text-paper-900 whitespace-pre-wrap">
                        {chit.content}
                      </div>
                      <div className="flex items-center text-sm text-paper-500 space-x-4">
                        <span>
                          Created: {new Date(chit.createdAt).toLocaleString()}
                        </span>
                        {chit.updatedAt !== chit.createdAt && (
                          <span>
                            Updated: {new Date(chit.updatedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleTransferChit(chit.id)}
                          disabled={availableVaults.length === 0}
                        >
                          <Move className="w-4 h-4 mr-2" />
                          Transfer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteChit(chit.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-white border-2 border-paper-300 rounded-sm p-8">
                  <FileText className="w-16 h-16 text-paper-400 mx-auto mb-4" />
                  <h3 className="text-xl font-game text-paper-900 mb-2">
                    No chits in this vault yet
                  </h3>
                  <p className="text-paper-600 mb-6">
                    Start adding chits to organize your thoughts and ideas
                  </p>
                  <Link href="/paper">
                    <Button className="game-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Chit
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Delete Chit Dialog */}
          <Dialog
            open={deleteChitDialogOpen}
            onOpenChange={setDeleteChitDialogOpen}
          >
            <DialogContent className="bg-white border-2 border-paper-300 rounded-sm">
              <DialogHeader>
                <DialogTitle className="font-game text-paper-900">
                  Delete Chit
                </DialogTitle>
                <DialogDescription className="text-paper-600">
                  Are you sure you want to delete this chit? This action cannot
                  be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDeleteChitDialogOpen(false)}
                  disabled={deleteChitMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={deleteChitMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteChitMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Transfer Chit Dialog */}
          <Dialog
            open={transferDialogOpen}
            onOpenChange={setTransferDialogOpen}
          >
            <DialogContent className="bg-white border-2 border-paper-300 rounded-sm">
              <DialogHeader>
                <DialogTitle className="font-game text-paper-900">
                  Transfer Chit
                </DialogTitle>
                <DialogDescription className="text-paper-600">
                  Choose a vault to transfer this chit to.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                {availableVaults.length > 0 ? (
                  availableVaults.map((vault) => (
                    <label
                      key={vault.id}
                      className="flex items-center space-x-3 cursor-pointer p-3 border-2 border-paper-200 rounded-sm hover:border-paper-300"
                    >
                      <input
                        type="radio"
                        name="targetVault"
                        value={vault.id}
                        checked={selectedTargetVault === vault.id}
                        onChange={(e) => setSelectedTargetVault(e.target.value)}
                        className="w-4 h-4 text-paper-600"
                      />
                      <div>
                        <p className="font-medium text-paper-900">
                          {vault.name}
                        </p>
                        {vault.description && (
                          <p className="text-sm text-paper-600">
                            {vault.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-paper-600 text-center py-4">
                    No other vaults available for transfer.
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTransferDialogOpen(false);
                    setSelectedTargetVault("");
                  }}
                  disabled={transferChitMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmTransfer}
                  disabled={
                    transferChitMutation.isPending ||
                    !selectedTargetVault ||
                    availableVaults.length === 0
                  }
                  className="game-button"
                >
                  {transferChitMutation.isPending
                    ? "Transferring..."
                    : "Transfer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
