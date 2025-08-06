import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide",

  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500 active:translate-y-0.5",
        primary:
          "bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-2 active:translate-y-0.5",
        primaryOutline:
          "bg-white text-sky-500 hover:bg-slate-100 active:translate-y-0.5",
        secondary:
          "bg-green-500 text-primary-foreground hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        secondaryOutline:
          "bg-white text-green-500 hover:bg-slate-100 active:translate-y-0.5",
        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        dangerOutline:
          "bg-white text-rose-500 hover:bg-slate-100 active:translate-y-0.5",
        super:
          "bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-2 active:translate-y-0.5",
        superOutline:
          "bg-white text-indigo-500 hover:bg-slate-100 active:translate-y-0.5",
        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100 active:translate-y-0.5",

        filled:
          "bg-transparent text-slate-500 border-transparent border-2 hover:bg-slate-100 transition-all active:translate-y-0.5",
        outline:
          "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-all active:translate-y-0.5",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 gap-1.5 px-3",
        lg: "h-12 px-6",
        icon: "size-10 p-0", // Changed: removed padding for icon buttons
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  // Logic to detect if the button contains only an icon
  const isIconOnly =
    React.Children.count(children) === 1 &&
    React.isValidElement(children) &&
    ((children.type as any).displayName?.includes("Icon") ||
      /svg|svg-icon|icon/i.test(children.type.toString()) ||
      children.type.toString().includes("react-icons"));

  // Properly handle icon content
  const buttonContent = isIconOnly ? (
    <span className="flex items-center justify-center">{children}</span>
  ) : (
    children
  );

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {buttonContent}
    </Comp>
  );
}

export { Button, buttonVariants };
