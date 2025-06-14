"use client"
import { motion } from "framer-motion"
import { Clock, FileText, MoreHorizontal, Trash, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../Componants/UiElements/card"
import { Badge } from "../Componants/UiElements/badge"
import { Button } from "../Componants/UiElements/button"
import { Progress } from "../Componants/UiElements/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Componants/UiElements/dropDown-menu"
import { useState } from "react"

const CapsuleCard = ({ capsule, index, onViewDetails, onDelete, isDeleting }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    const unlock = new Date(unlockDate)
    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`
  }

  const calculateProgress = (createdAt, unlockDate) => {
    const now = new Date()
    const created = new Date(createdAt)
    const unlock = new Date(unlockDate)

    const totalTime = unlock.getTime() - created.getTime()
    const elapsedTime = now.getTime() - created.getTime()

    if (elapsedTime >= totalTime) return 100
    return Math.round((elapsedTime / totalTime) * 100)
  }

  const isUnlocked = new Date(capsule.dateToUnlock) <= new Date()

  const handleViewDetails = () => {
    onViewDetails(capsule)
  }

  const handleDelete = () => {
    onDelete(capsule.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-slate-800/50 border-slate-700 text-white h-full flex flex-col overflow-hidden group hover:border-indigo-500 transition-all">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant={isUnlocked ? "default" : "secondary"} className="mb-2">
              {isUnlocked ? "Unlocked" : "Locked"}
            </Badge>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                <DropdownMenuItem
                  className="text-white hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  onClick={handleViewDetails}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-red-900/30 focus:bg-red-900/30 cursor-pointer"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete Capsule"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle
            className="text-xl group-hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={handleViewDetails}
          >
            {capsule.title}
          </CardTitle>
          <CardDescription className="text-slate-400 line-clamp-2">{capsule.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex items-center text-sm text-slate-400 mb-3">
            <User className="mr-1 h-4 w-4" />
            <span>{capsule.recipientEmail ? `To: ${capsule.recipientEmail}` : `From: ${capsule.createdBy}`}</span>
          </div>
          <div className="flex items-center text-sm text-slate-400 mb-4">
            <Clock className="mr-1 h-4 w-4" />
            <span>
              Unlocks:{" "}
              {new Date(capsule.dateToUnlock).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className="text-indigo-400 font-medium">
                {calculateProgress(capsule.createdAt, capsule.dateToUnlock)}%
              </span>
            </div>
            <Progress value={calculateProgress(capsule.createdAt, capsule.dateToUnlock)} className="h-1.5 bg-slate-700" />
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-700 pt-3">
          <div className="flex justify-between items-center w-full text-sm">
            <div className="text-slate-400">
              {capsule.mediaCount} {capsule.mediaCount === 1 ? "item" : "items"}
            </div>
            <div className="text-indigo-400 font-medium">{calculateTimeRemaining(capsule.dateToUnlock)}</div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CapsuleCard
