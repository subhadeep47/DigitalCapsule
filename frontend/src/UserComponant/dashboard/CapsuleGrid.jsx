import CapsuleCard from "../CapsuleCard"

const CapsuleGrid = ({ capsules, onViewDetails, onDelete, isDeleting, canDelete = true }) => {
  return (
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
  )
}

export default CapsuleGrid
