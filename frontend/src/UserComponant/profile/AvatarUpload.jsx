"use client"
import { useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { Camera, Upload, Loader2, Eye } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { Tooltip, TooltipTrigger, TooltipProvider } from "../../Componants/UiElements/tooltip"
import { dispatchAction, ACTION_TYPES } from "../../redux/actionDispatcher"
import ProfileImageModal from "../ProfileImageModal"
import api from "../../Utils/api"

const AvatarUpload = ({ user }) => {
  const dispatch = useDispatch()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const fileInputRef = useRef(null)

  const getDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "User"
  }

  const getAvatarDisplay = () => {
    if (user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))) {
      return (
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={getDisplayName()}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsImageModalOpen(true)}
          loading="lazy"
        />
      )
    }
    const initials = user?.avatar || getDisplayName().charAt(0).toUpperCase()
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl">
        {initials}
      </div>
    )
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB")
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/auth/update-profile-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const updatedUser = {
        ...user,
        avatar: response.data.avatar,
      }
      dispatchAction(dispatch, ACTION_TYPES.CURRENT_USER, updatedUser)
      event.target.value = ""
    } catch (error) {
      console.error("Avatar upload error:", error)
      setUploadError(error.response?.data?.message || "Failed to upload avatar")
    } finally {
      setIsUploading(false)
    }
  }
  const hasImage = user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))

  return (
    <TooltipProvider>
      <div className="relative group">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-slate-600 hover:border-indigo-500 transition-colors">
          {getAvatarDisplay()}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading && (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            )}
          </div>
        </div>

        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleFileSelect}
                disabled={isUploading}
                className="h-8 w-8 rounded-full p-0 bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
          </Tooltip>

          {hasImage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsImageModalOpen(true)}
                  className="h-8 w-8 rounded-full p-0 bg-slate-700 border-slate-600 hover:bg-slate-600 text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          )}
        </div>

        {/* Hidden File Input */}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {/* Error Display */}
        {uploadError && (
          <div className="absolute top-full mt-2 left-0 right-0 text-xs text-red-400 bg-red-900/30 border border-red-800 rounded px-2 py-1 z-10">
            {uploadError}
          </div>
        )}

        {/* Profile Image Modal */}
        {hasImage && (
          <ProfileImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            user={user}
            imageUrl={user.avatar}
          />
        )}
      </div>
    </TooltipProvider>
  )
}

export default AvatarUpload
