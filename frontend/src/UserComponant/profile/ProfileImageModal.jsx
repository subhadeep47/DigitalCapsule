"use client"
import { useState } from "react"
import { X, Download, User } from "lucide-react"
import { Modal, ModalContent } from "../../Componants/UiElements/modal"
import { Button } from "../../Componants/UiElements/button"

const ProfileImageModal = ({ isOpen, onClose, user, imageUrl }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const getDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "User"
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-slate-900 border-slate-700 max-w-2xl">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <ModalContent className="p-0">
          <div className="relative">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-indigo-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{getDisplayName()}</h3>
                    <p className="text-sm text-slate-400">Profile Picture</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Container */}
            <div className="relative bg-slate-800 flex items-center justify-center min-h-[400px]">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                </div>
              )}

              {imageError ? (
                <div className="flex flex-col items-center justify-center text-slate-400 p-8">
                  <User className="h-16 w-16 mb-4 opacity-50" />
                  <p>Failed to load image</p>
                </div>
              ) : (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${getDisplayName()}'s profile picture`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <p className="text-xs text-slate-400 text-center">Click outside or press ESC to close</p>
            </div>
          </div>
        </ModalContent>
      </div>
    </Modal>
  )
}

export default ProfileImageModal
