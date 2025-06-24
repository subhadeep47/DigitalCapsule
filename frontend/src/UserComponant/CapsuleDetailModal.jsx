"use client"
import { Calendar, Clock, Download, File, FileImage, FileText, User, Video } from "lucide-react"
import { Modal, ModalHeader, ModalContent } from "../Componants/UiElements/modal"
import { Badge } from "../Componants/UiElements/badge"
import { Separator } from "../Componants/UiElements/separator"
import api from "../Utils/api"
import { Button } from "../Componants/UiElements/button"

const CapsuleDetailModal = ({ capsule, isOpen, onClose }) => {
  if (!capsule) return null

  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Start of today

    const unlock = new Date(unlockDate)
    unlock.setHours(0, 0, 0, 0) // Start of unlock day

    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`
  }

  const checkIfUnlocked = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const unlockDate = new Date(capsule.dateToUnlock)
    unlockDate.setHours(0, 0, 0, 0)

    return unlockDate <= today
  }

  const isUnlocked = checkIfUnlocked()

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <FileImage className="h-8 w-8 text-indigo-400" />
    } else if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(extension)) {
      return <Video className="h-8 w-8 text-purple-400" />
    } else if (["pdf"].includes(extension)) {
      return <FileText className="h-8 w-8 text-red-400" />
    } else {
      return <File className="h-8 w-8 text-gray-400" />
    }
  }

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1024)} KB`
    }
    return `${Math.round(sizeInMB * 100) / 100} MB`
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await api.get(`/api/capsules/download/${fileId}`, {
        responseType: "blob",
      })

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download file. Please try again.")
    }
  }

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
              <span className="text-slate-400">{capsule.createdBy ? "From:" : "To:"}</span>
              <span className="ml-1 text-white">{capsule.createdBy || capsule.senderEmail}</span>
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
                {new Date(capsule.dateToUnlock).toLocaleDateString("en-US", {
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
                {Array.isArray(capsule.fileInfo) ? capsule.fileInfo.length : capsule.mediaCount || 0}{" "}
                {(Array.isArray(capsule.fileInfo) ? capsule.fileInfo.length : capsule.mediaCount || 0) === 1
                  ? "item"
                  : "items"}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Time Status */}
        <div className="text-center p-4 bg-slate-900/50 rounded-lg">
          <p className="text-lg font-semibold text-indigo-400">{calculateTimeRemaining(capsule.dateToUnlock)}</p>
        </div>

        {/* Content Preview */}
        {isUnlocked && (
          <>
            <Separator className="bg-slate-700" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Capsule Contents</h3>

              {/* Message */}
              {capsule.personalMessage && (
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <h4 className="font-medium text-indigo-400 mb-2">Personal Message</h4>
                  <p className="text-slate-300">{capsule.personalMessage}</p>
                </div>
              )}

              {/* Files */}
              {Array.isArray(capsule.fileInfo) && capsule.fileInfo.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-indigo-400">Files</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {capsule.fileInfo.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-900/50 rounded-md p-3 border border-slate-700"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          {getFileIcon(file.fileName)}
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{file.fileName}</p>
                            <p className="text-xs text-slate-400">{formatFileSize(file.fileSize)}</p>
                          </div>
                        </div>
                        <Button
                          type='button'
                          onClick={() => handleDownload(file.fileId, file.fileName)}
                          size="sm"
                          variant="outline"
                          className="ml-3 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No files message */}
              {(!Array.isArray(capsule.fileInfo) || capsule.fileInfo.length === 0) && (
                <div className="text-center p-6 bg-slate-900/30 rounded-lg">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">No files in this capsule</p>
                </div>
              )}
            </div>
          </>
        )}

        {!isUnlocked && (
          <div className="text-center p-6 bg-slate-900/30 rounded-lg">
            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">
              This capsule is still locked. Come back on{" "}
              {new Date(capsule.dateToUnlock).toLocaleDateString("en-US", {
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
