"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { BsGithub } from "react-icons/bs";

export default function EnterPage() {
  async function handleSignIn() {
    await authClient.signIn.social({
      provider: "github",
      errorCallbackURL: "/problem",
      callbackURL: "/",
    });
  }

  return (
    <div className="bg-amber-50/70 flex h-screen w-full items-center justify-center">
      <div className="max-w-md flex flex-col items-center justify-center gap-4 rounded-lg border border-input bg-background p-8 shadow-md dark:border-input/30 dark:bg-input/50">
        <h1 className="text-2xl font-bold">Welcome to the Emok</h1>
        <p className="text-sm text-muted-foreground text-center">
          Please sign in to continue. You can use your Google account to log in.
          If you don't have an account, one will be created for you
          automatically.
        </p>

        <Button
          variant="default"
          size="lg"
          className="w-full justify-center h-[52px]"
          onClick={handleSignIn}
        >
          <BsGithub className="mr-5" /> Continue with Github
        </Button>
      </div>
    </div>
  );
}
