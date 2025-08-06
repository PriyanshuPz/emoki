"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { chitFont, gameFont } from "@/lib/font";
import { cn } from "@/lib/utils";
import ActionButtons from "./action-buttons";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

interface ChitForm {
  content: string;
}

interface NoteContainerProps {
  onContentChange?: (content: string) => void;
  isLoading?: boolean;
}

export default function ChitMakerView({ isLoading }: NoteContainerProps) {
  const form = useForm<ChitForm>({
    defaultValues: {
      content: "",
    },
  });
  const saveChitMutation = useMutation(trpc.saveChit.mutationOptions());

  async function onSubmit() {
    const data = form.getValues();
    try {
      await saveChitMutation.mutateAsync({ content: data.content });
      form.reset();
      toast.success("Chit saved successfully! 📝", {
        description: "Your chit has been saved.",
      });
    } catch (error) {
      console.error("Error saving chit:", error);
      toast.error("Failed to save chit. Please try again.");
    }
  }

  const watchedContent = form.watch("content");

  return (
    <div className="flex h-full max-h-[70vh] max-w-2xl w-full items-center justify-center mx-auto">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="rounded-sm p-8 w-full h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="text-sm text-gray-600">Saving your chit...</p>
              </div>
            </div>
          )}

          <div className="pl-8 h-full flex flex-col">
            <Form {...form}>
              <form className="flex-1 flex flex-col">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Textarea
                          placeholder=""
                          {...field}
                          className={cn(
                            "h-full min-h-[350px] text-xl resize-none bg-background p-4 caret-accent",
                            chitFont.className
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between text-xs text-gray-400 mt-2 pt-2">
                  <span>
                    {watchedContent
                      ?.split(/\s+/)
                      .filter((word) => word.length > 0).length || 0}{" "}
                    words
                  </span>
                  <span>{watchedContent?.length || 0} characters</span>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <ActionButtons
        content={watchedContent}
        onClear={() => form.reset()}
        onSave={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
