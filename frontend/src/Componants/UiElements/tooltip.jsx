"use client"

import React from "react"
import { cn } from "../../Utils/utils"

const TooltipProvider = ({ children, delayDuration = 700 }) => {
  return <div>{children}</div>
}

const TooltipContext = React.createContext()

const Tooltip = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const context = React.useContext(TooltipContext)

  const handleMouseEnter = () => {
    context?.setOpen(true)
  }

  const handleMouseLeave = () => {
    context?.setOpen(false)
  }

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      ...props.children.props,
    })
  }

  return (
    <div ref={ref} className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props} />
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, hidden = false, ...props }, ref) => {
  const context = React.useContext(TooltipContext)

  if (!context?.open || hidden) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        "bottom-full mb-1 left-1/2 -translate-x-1/2",
        className,
      )}
      {...props}
    />
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
