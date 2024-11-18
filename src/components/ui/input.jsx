import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md px-3 py-2 text-sm file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:file:text-slate-50 dark:placeholder:text-slate-400 text-white font-subHeading",
        className
      )}
      placeholder='Enter Email'
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
