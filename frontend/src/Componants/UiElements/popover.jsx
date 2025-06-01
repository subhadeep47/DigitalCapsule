"use client"

import React from "react"
import { cn } from "../../Utils/utils"

const PopoverContext = React.createContext()

const Popover = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  const Comp = asChild ? React.cloneElement : "button"

  const handleClick = () => {
    context?.setOpen(!context.open)
  }

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, {
      ref,
      onClick: handleClick,
      ...props.children.props,
    })
  }

  return <button ref={ref} className={className} onClick={handleClick} {...props} />
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const context = React.useContext(PopoverContext)

  if (!context?.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        "top-full mt-1",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        align === "end" && "right-0",
        className,
      )}
      {...props}
    />
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
