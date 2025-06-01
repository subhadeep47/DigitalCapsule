import CapsuleCard from "../CapsuleCard"

const CapsuleGrid = ({ capsules, onViewDetails, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {capsules.map((capsule, index) => (
        <CapsuleCard
          key={capsule.id}
          capsule={capsule}
          index={index}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default CapsuleGrid
