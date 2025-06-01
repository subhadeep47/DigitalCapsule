"use client"

import React from "react"
import { cn } from "../../Utils/utils"
import { X } from "lucide-react"
import { Button } from "./button"

const Modal = ({ isOpen, onClose, children, className, ...props }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          "relative bg-background rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto",
          className,
        )}
        {...props}
      >
        <Button variant="ghost" size="icon" className="absolute right-2 top-2 z-10" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ children, className, ...props }) => (
  <div className={cn("p-6 pb-2", className)} {...props}>
    {children}
  </div>
)

const ModalContent = ({ children, className, ...props }) => (
  <div className={cn("p-6 pt-2", className)} {...props}>
    {children}
  </div>
)

const ModalFooter = ({ children, className, ...props }) => (
  <div className={cn("p-6 pt-2 flex justify-end gap-2", className)} {...props}>
    {children}
  </div>
)

export { Modal, ModalHeader, ModalContent, ModalFooter }
