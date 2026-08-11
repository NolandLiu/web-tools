import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
  {
    variants: {
      variant: {
        default:
          "border-discover-mint-strong bg-discover-mint-soft text-discover-forest",
        tool: "border-discover-mint-strong bg-discover-mint-soft text-discover-forest",
        website:
          "border-discover-sky-line bg-discover-sky-soft text-discover-sky-ink",
        guide:
          "border-discover-amber-line bg-discover-amber-soft text-discover-amber-ink",
        neutral: "border-discover-line bg-discover-surface-muted text-discover-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge };
