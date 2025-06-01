"use client"
import { Gift, Plus } from "lucide-react"
import { Card } from "../../Componants/UiElements/card"
import { Button } from "../../Componants/UiElements/button"

const EmptyState = ({ type, onCreateCapsule }) => {
  const content = {
    created: {
      title: "No capsules created yet",
      description: "Create your first time capsule to preserve special memories",
      showButton: true,
    },
    received: {
      title: "No shared capsules yet",
      description: "When someone shares a time capsule with you, it will appear here",
      showButton: false,
    },
  }

  const { title, description, showButton } = content[type]

  return (
    <Card className="bg-slate-800/30 border-slate-700 text-center p-8">
      <div className="flex flex-col items-center justify-center text-slate-400">
        <Gift className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className={showButton ? "mb-4" : ""}>{description}</p>
        {showButton && (
          <Button onClick={onCreateCapsule} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create New Capsule
          </Button>
        )}
      </div>
    </Card>
  )
}

export default EmptyState
