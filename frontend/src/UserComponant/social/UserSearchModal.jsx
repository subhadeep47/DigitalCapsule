"use client"
import { useState, useEffect, useRef } from "react"
import { Search, Users, Eye } from "lucide-react"
import { Modal, ModalHeader, ModalContent } from "../../Componants/UiElements/modal"
import { Input } from "../../Componants/UiElements/input"
import { Button } from "../../Componants/UiElements/button"
import { useNavigate } from "react-router-dom"
import api from "../../Utils/api"

const UserSearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const searchTimeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSearchResults([])
      setHasSearched(false)
    }
  }, [isOpen])

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery.trim())
      }, 500)
    } else {
      setSearchResults([])
      setHasSearched(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const handleSearch = async (query) => {
    if (!query) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const results = await api.get(`/community/search-profile?query=${query}`)
      setSearchResults(results.data)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleUserClick = (user) => {
    onClose()
    navigate(`/profile/${user.userId}`)
  }

  const getAvatarDisplay = (user) => {
    if (user.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))) {
      return <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
    }

    const initials = user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
        {initials}
      </div>
    )
  }

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const renderSearchResults = () => {
    if (!hasSearched && searchQuery.length < 2) {
      return (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Type at least 2 characters to search users</p>
        </div>
      )
    }

    if (isSearching) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="text-slate-400 mt-2 text-sm">Searching users...</p>
        </div>
      )
    }

    if (searchResults.length === 0 && hasSearched) {
      return (
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No users found matching "{searchQuery}"</p>
        </div>
      )
    }

    return (
      <div className="max-h-96 overflow-y-auto space-y-2">
        {searchResults.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="flex items-center space-x-3 p-3 hover:bg-slate-700/50 cursor-pointer transition-colors rounded-lg"
          >
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-slate-600 flex-shrink-0">
              {getAvatarDisplay(user)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{user.name}</h3>
              <p className="text-slate-400 text-sm truncate">{user.email}</p>
              <p className="text-slate-500 text-xs">Joined {formatJoinDate(user.createdAt)}</p>
            </div>

            <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-slate-800 border-slate-700 text-white max-w-2xl">
      <ModalHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Discover Users</h2>
            <p className="text-slate-300 text-sm mt-1">Find other time capsule creators</p>
          </div>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 pl-10"
          />
        </div>

        <div className="border border-slate-700 rounded-lg">{renderSearchResults()}</div>
      </ModalContent>
    </Modal>
  )
}

export default UserSearchModal
