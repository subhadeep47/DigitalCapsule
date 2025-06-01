import React from "react";
import { cn } from "../../Utils/utils"; // Make sure this works as expected

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-300", className)}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
