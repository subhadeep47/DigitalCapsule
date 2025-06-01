"use client"

import React from "react"
import { cn } from "../../Utils/utils"

const DropdownMenuContext = React.createContext()

const DropdownMenu = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)

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
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        context?.setOpen(false)
      }
    }

    if (context?.open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context?.open, ref])

  if (!context?.open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
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
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = (event) => {
    context?.setOpen(false)
    props.onClick?.(event)
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
