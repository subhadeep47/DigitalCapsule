"use client"
import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"

const UserProfileHeader = () => {
  const { user } = useSelector((state) => state.auth)
  const [isExpanded, setIsExpanded] = useState(false)
  const dropdownRef = useRef(null)

  const getDisplayName = () => {
    if (!user) return "User"
    return user.name || user.email?.split("@")[0] || "User"
  }

  const displayName = getDisplayName()
  const avatar = user?.avatar || displayName.charAt(0).toUpperCase()

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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {avatar}
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-white font-medium text-sm">{displayName}</p>
          <p className="text-slate-400 text-xs truncate max-w-[150px]">{user?.email}</p>
        </div>

        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </Button>

      {isExpanded && (
        <div className="absolute left-0 sm:right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl z-50 w-[280px] sm:w-[300px]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-base">{displayName}</p>
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
              <p className="text-slate-400 text-xs text-center">🚀 Profile settings and more options coming soon!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileHeader
