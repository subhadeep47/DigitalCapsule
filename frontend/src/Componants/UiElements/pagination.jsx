"use client"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "../../Utils/utils"
import { Button } from "./button"

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const generatePageNumbers = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 4) {
        pages.push("ellipsis-start")
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("ellipsis-end")
      }

      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (typeof page === "string") {
          return (
            <div key={`ellipsis-${index}`} className="px-2">
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn(
              "min-w-[32px]",
              currentPage === page
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
            )}
          >
            {page}
          </Button>
        )
      })}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}

export { Pagination }
