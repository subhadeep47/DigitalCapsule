import { Pagination } from "../../Componants/UiElements/pagination"
import CapsuleCard from "../CapsuleCard"

const CapsuleGrid = ({ capsules, onViewDetails, onDelete, isDeleting, canDelete = true, pagination, onPageChange }) => {
  return (
    <div className="space-y-6">
      {/* Capsules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capsules.map((capsule, index) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            index={index}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
            isDeleting={isDeleting}
            canDelete={canDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />

          {/* Pagination Info */}
          <div className="text-sm text-slate-400 text-center">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} capsules
          </div>
        </div>
      )}
    </div>
  )
}

export default CapsuleGrid
