"use client";

import { Button } from "@/components/ui/button";
import { useSoundEffect } from "@/hooks/use-sound-effect";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface SoundButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  soundType?: "click" | "success" | "error" | "complete";
  asChild?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500 active:translate-y-0.5",
        primary:
          "bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-2 active:translate-y-0.5",
        secondary:
          "bg-green-500 text-primary-foreground hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        super:
          "bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100 active:translate-y-0.5",
        outline:
          "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-all active:translate-y-0.5",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 gap-1.5 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SoundButton = forwardRef<HTMLButtonElement, SoundButtonProps>(
  (
    {
      className,
      variant,
      size,
      soundType = "click",
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { playFeedback } = useSoundEffect();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playFeedback(soundType);

      // Add visual feedback with a CSS animation
      const button = e.currentTarget;
      button.classList.add("sound-button-press");

      setTimeout(() => {
        button.classList.remove("sound-button-press");
      }, 150);

      if (onClick) onClick(e);
    };

    return (
      <Button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onClick={handleClick}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SoundButton.displayName = "SoundButton";

export { SoundButton };
