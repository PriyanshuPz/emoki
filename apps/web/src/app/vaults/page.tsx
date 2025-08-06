"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc, queryClient } from "@/utils/trpc";
import { toast } from "sonner";
import { Plus, MoreVertical, Trash2, Edit, Eye, FileText } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Vault {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  isPublic: boolean;
  createdAt: string;
  chitCount: number;
}

export default function VaultsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vaultToDelete, setVaultToDelete] = useState<string | null>(null);

  const { data: vaults, isLoading } = useQuery(
    trpc.getVaultsWithCounts.queryOptions()
  );

  const deleteVaultMutation = useMutation(
    trpc.deleteVault.mutationOptions({
      onSuccess: () => {
        toast.success("Vault deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.getVaultsWithCounts.queryKey(),
        });
        setDeleteDialogOpen(false);
        setVaultToDelete(null);
      },
    })
  );

  const handleDeleteVault = (vaultId: string) => {
    setVaultToDelete(vaultId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vaultToDelete) {
      deleteVaultMutation.mutate({
        vaultId: vaultToDelete,
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
              <p className="text-paper-600">Loading your vaults...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-game text-paper-900 mb-2">
                Your Vaults
              </h1>
              <p className="text-paper-600">
                Organize your chits into different vaults
              </p>
            </div>
            <div className="space-x-1">
              <Link href="/vaults/new">
                <Button className="game-button">
                  <Plus className="w-4 h-4 mr-2" />
                  New Vault
                </Button>
              </Link>
              <Link href="/paper">
                <Button className="game-button" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {vaults && vaults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vaults.map((vault: Vault) => (
                <div
                  key={vault.id}
                  className="bg-white border-2 border-paper-300 rounded-sm p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Link href={`/vaults/${vault.id}`}>
                      <div className="flex-1">
                        <h3 className="text-xl font-game text-paper-900 mb-2">
                          {vault.name}
                          {vault.isDefault && (
                            <span className="ml-2 text-xs bg-paper-200 text-paper-700 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </h3>
                        {vault.description && (
                          <p className="text-paper-600 text-sm mb-3">
                            {vault.description}
                          </p>
                        )}
                      </div>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/vaults/${vault.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem asChild>
                          <Link href={`/vaults/${vault.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem> */}
                        {!vault.isDefault && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteVault(vault.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between text-sm text-paper-600">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      <span>{vault.chitCount} chits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {vault.isPublic && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Public
                        </span>
                      )}
                      <span className="text-xs">
                        {new Date(vault.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white border-2 border-paper-300 rounded-sm p-8 max-w-md mx-auto">
                <FileText className="w-16 h-16 text-paper-400 mx-auto mb-4" />
                <h3 className="text-xl font-game text-paper-900 mb-2">
                  No vaults yet
                </h3>
                <p className="text-paper-600 mb-6">
                  Create your first vault to start organizing your chits
                </p>
                <Link href="/vaults/new">
                  <Button className="game-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Vault
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="bg-white border-2 border-paper-300 rounded-sm">
              <DialogHeader>
                <DialogTitle className="font-game text-paper-900">
                  Delete Vault
                </DialogTitle>
                <DialogDescription className="text-paper-600">
                  Are you sure you want to delete this vault? This action will
                  also delete all chits inside the vault and cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleteVaultMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={deleteVaultMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteVaultMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
