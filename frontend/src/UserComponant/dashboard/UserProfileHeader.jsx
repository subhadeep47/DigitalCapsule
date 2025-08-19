"use client"
import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { useNavigate } from "react-router-dom"

const UserProfileHeader = () => {
  const { user } = useSelector((state) => state.auth)
  const [isExpanded, setIsExpanded] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const getDisplayName = () => {
    if (!user) return "User"
    return user.name || user.email?.split("@")[0] || "User"
  }

  const getAvatarDisplay = () => {
    if (user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))) {
      return (
        <img src={user.avatar || "/placeholder.svg"} alt={getDisplayName()} className="w-full h-full object-cover" />
      )
    }
    const initials = user?.avatar || getDisplayName().charAt(0).toUpperCase()
    return (
      <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg overflow-hidden">
        {initials}
      </div>
    )
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded])

  const handleProfileSettings = () => {
    setIsExpanded(false)
    navigate("/profile")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        {/* Avatar */}
        <div className="relative h-12 w-12 rounded-full overflow-hidden border-4 border-slate-600 group-hover:border-indigo-500 transition-colors">
          {getAvatarDisplay()}
        </div>

        {/* User Info - Show name on desktop, hide on mobile */}
        <div className="text-left hidden sm:block">
          <p className="text-white font-medium text-sm">{getDisplayName()}</p>
          <p className="text-slate-400 text-xs truncate max-w-[150px]">{user?.email}</p>
        </div>

        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </Button>

      {isExpanded && (
        <div
          className="absolute top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl z-50 w-[280px] right-0 sm:right-0 
                        max-[480px]:right-0 max-[480px]:translate-x-0 max-[480px]:w-[260px]
                        max-[360px]:right-0 max-[360px]:translate-x-2 max-[360px]:w-[240px]"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-slate-600 group-hover:border-indigo-500 transition-colors">
              {getAvatarDisplay()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-base truncate">{getDisplayName()}</p>
              <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Account Status</span>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Member Since</span>
              <span className="text-slate-400 text-sm">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
              </span>
            </div>

            <div className="border-t border-slate-700 pt-3 mt-3">
              <Button
                onClick={handleProfileSettings}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileHeader
