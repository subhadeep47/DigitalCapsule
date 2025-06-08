"use client"
import { Calendar, Clock, FileImage, FileText, User } from "lucide-react"
import { Modal, ModalHeader, ModalContent } from "../Componants/UiElements/modal"
import { Badge } from "../Componants/UiElements/badge"
import { Separator } from "../Componants/UiElements/separator"

const CapsuleDetailModal = ({ capsule, isOpen, onClose }) => {
  if (!capsule) return null

  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    const unlock = new Date(unlockDate)
    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`
  }

  const isUnlocked = new Date(capsule.unlockDate) <= new Date()

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-slate-800 border-slate-700 text-white">
      <ModalHeader>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{capsule.title}</h2>
            <p className="text-slate-300 mt-1">{capsule.description}</p>
          </div>
          <Badge variant={isUnlocked ? "default" : "secondary"} className="ml-4">
            {isUnlocked ? "Unlocked" : "Locked"}
          </Badge>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {/* Capsule Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-indigo-400" />
              <span className="text-slate-400">{capsule.recipientEmail ? "To:" : "From:"}</span>
              <span className="ml-1 text-white">{capsule.recipientEmail || capsule.senderEmail}</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
              <span className="text-slate-400">Created:</span>
              <span className="ml-1 text-white">
                {new Date(capsule.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-indigo-400" />
              <span className="text-slate-400">Unlocks:</span>
              <span className="ml-1 text-white">
                {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4 text-indigo-400" />
              <span className="text-slate-400">Content:</span>
              <span className="ml-1 text-white">
                {capsule.mediaCount} {capsule.mediaCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Time Status */}
        <div className="text-center p-4 bg-slate-900/50 rounded-lg">
          <p className="text-lg font-semibold text-indigo-400">{calculateTimeRemaining(capsule.unlockDate)}</p>
        </div>

        {/* Content Preview */}
        {isUnlocked && (
          <>
            <Separator className="bg-slate-700" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Capsule Contents</h3>

              {/* Message */}
              {capsule.message && (
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-400 mb-2">Personal Message</h4>
                  <p className="text-slate-300">{capsule.message}</p>
                </div>
              )}

              {/* Files */}
              <div className="space-y-2">
                <h4 className="font-medium text-indigo-400">Files</h4>
                <div className="space-y-2">
                  {Array.from({ length: capsule.mediaCount }, (_, i) => (
                    <div key={i} className="flex items-center bg-slate-900/50 rounded-md p-2">
                      <FileImage className="h-8 w-8 text-indigo-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-white">Memory_{i + 1}.jpg</p>
                        <p className="text-xs text-slate-400">Image • 2.4 MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {!isUnlocked && (
          <div className="text-center p-6 bg-slate-900/30 rounded-lg">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">
              This capsule is still locked. Come back on{" "}
              {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              to view its contents.
            </p>
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CapsuleDetailModal
