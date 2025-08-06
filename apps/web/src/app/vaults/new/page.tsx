"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trpc, queryClient } from "@/utils/trpc";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

const createVaultSchema = z.object({
  name: z
    .string()
    .min(1, "Vault name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  isPublic: z.boolean(),
});

type CreateVaultData = z.infer<typeof createVaultSchema>;

export default function NewVaultPage() {
  const router = useRouter();

  const form = useForm<CreateVaultData>({
    resolver: zodResolver(createVaultSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
    },
  });

  const createVaultMutation = useMutation(
    trpc.createVault.mutationOptions({
      onSuccess: (result) => {
        toast.success("Vault created successfully");
        queryClient.invalidateQueries({ queryKey: ["getVaultsWithCounts"] });
        router.push("/vaults");
      },
    })
  );

  const onSubmit = (data: CreateVaultData) => {
    createVaultMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8 justify-between">
            <div>
              <h1 className="text-3xl font-game text-paper-900">
                Create New Vault
              </h1>
            </div>
            <Link href="/vaults">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Vaults
              </Button>
            </Link>
          </div>

          {/* Form */}
          <div className="bg-white border-2 border-paper-300 rounded-sm p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-paper-900 font-medium">
                        Vault Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter vault name..."
                          className="border-2 border-paper-300 rounded-sm focus:border-paper-500 focus:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-paper-600">
                        Choose a descriptive name for your vault
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-paper-900 font-medium">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter vault description (optional)..."
                          className="border-2 border-paper-300 rounded-sm focus:border-paper-500 focus:ring-0 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-paper-600">
                        Optional description to help you remember what this
                        vault is for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4 text-paper-600 bg-paper-100 border-2 border-paper-300 rounded focus:ring-paper-500 focus:ring-2"
                        />
                        <FormLabel
                          htmlFor="isPublic"
                          className="text-paper-900 font-medium cursor-pointer"
                        >
                          Make this vault public
                        </FormLabel>
                      </div>
                      <FormDescription className="text-paper-600">
                        Public vaults can be viewed by other users (your chits
                        will still be private)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4 pt-4 border-t border-paper-200">
                  <Link href="/vaults">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={createVaultMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="game-button"
                    disabled={createVaultMutation.isPending}
                  >
                    {createVaultMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Vault
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-paper-50 border-2 border-paper-200 rounded-sm p-6">
            <h3 className="font-game text-paper-900 mb-3">💡 Tips</h3>
            <ul className="space-y-2 text-paper-600 text-sm">
              <li>• Use descriptive names to easily identify your vaults</li>
              <li>• Create separate vaults for different topics or projects</li>
              <li>
                • Public vaults allow others to see the vault name and
                description only
              </li>
              <li>
                • Your first vault will automatically become your default vault
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
