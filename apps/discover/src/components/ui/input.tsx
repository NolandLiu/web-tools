import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "h-12 w-full rounded-full border border-discover-line bg-discover-surface px-5 text-base text-discover-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-discover-muted focus:border-discover-mint-strong focus:shadow-[0_0_0_4px_rgb(201_236_198_/_0.55)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
