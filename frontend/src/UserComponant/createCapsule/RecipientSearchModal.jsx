"use client"
import { useState, useEffect } from "react"
import { Search, User, Check, X } from "lucide-react"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../Componants/UiElements/modal"
import { Input } from "../../Componants/UiElements/input"
import { Button } from "../../Componants/UiElements/button"
import { Badge } from "../../Componants/UiElements/badge"
import { Separator } from "../../Componants/UiElements/separator"
import api from "../../Utils/api"

const RecipientSearchModal = ({ isOpen, onClose, selectedRecipients, onRecipientsSelect }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [tempSelectedRecipients, setTempSelectedRecipients] = useState([])

  useEffect(() => {
    if (isOpen) {
      setTempSelectedRecipients([...selectedRecipients])
      // Reset search state when modal opens
      setSearchQuery("")
      setSearchResults([])
      setHasSearched(false)
    }
  }, [isOpen, selectedRecipients])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term")
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const results = await api.get(`/auth/search-recipient?query=${searchQuery}`)
      setSearchResults(results.data)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchClick = () => {
    handleSearch()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const isRecipientSelected = (user) => {
    return tempSelectedRecipients.some((r) => r.email === user.email)
  }

  const toggleRecipient = (user) => {
    if (isRecipientSelected(user)) {
      setTempSelectedRecipients(tempSelectedRecipients.filter((r) => r.email !== user.email))
    } else {
      setTempSelectedRecipients([...tempSelectedRecipients, user])
    }
  }

  const handleConfirm = () => {
    onRecipientsSelect(tempSelectedRecipients)
    onClose()
  }

  const handleCancel = () => {
    setTempSelectedRecipients([...selectedRecipients])
    setSearchQuery("")
    setSearchResults([])
    setHasSearched(false)
    onClose()
  }

  const renderSearchResults = () => {
    if (!hasSearched) {
      return (
        <div className="text-center py-12 border border-slate-700 rounded-md">
          <Search className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Enter a search term and click search to find registered users</p>
        </div>
      )
    }

    if (isSearching) {
      return (
        <div className="text-center py-8 border border-slate-700 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="text-slate-400 mt-2 text-sm">Searching users...</p>
        </div>
      )
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-8 border border-slate-700 rounded-md">
          <User className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No users found matching "{searchQuery}"</p>
        </div>
      )
    }

    return (
      <div className="max-h-64 overflow-y-auto space-y-1 border border-slate-700 rounded-md">
        {searchResults.map((user) => (
          <div
            key={user.id}
            onClick={() => toggleRecipient(user)}
            className={`flex items-center justify-between p-3 hover:bg-slate-700/50 cursor-pointer transition-colors ${
              isRecipientSelected(user) ? "bg-indigo-600/20 border-l-2 border-indigo-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            {isRecipientSelected(user) && <Check className="h-4 w-4 text-indigo-400 flex-shrink-0 ml-2" />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} className="bg-slate-800 border-slate-700 text-white max-w-2xl">
      <ModalHeader>
        <h2 className="text-xl font-bold text-white">Select Recipients</h2>
        <p className="text-slate-300 text-sm mt-1">Choose from registered users to share your time capsule</p>
      </ModalHeader>

      <ModalContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 pl-9"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearchClick}
            disabled={isSearching || !searchQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Selected Recipients */}
        {tempSelectedRecipients.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-300">
              Selected Recipients ({tempSelectedRecipients.length})
            </h3>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-900/30 border border-slate-700 rounded-md max-h-24 overflow-y-auto">
              {tempSelectedRecipients.map((recipient) => (
                <Badge
                  key={recipient.email}
                  variant="secondary"
                  className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 flex items-center gap-1 max-w-full"
                >
                  <span className="text-xs truncate max-w-[120px]" title={recipient.name}>
                    {recipient.name}
                  </span>
                  <span className="text-xs opacity-70 truncate max-w-[150px]" title={recipient.email}>
                    ({recipient.email})
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRecipient(recipient)}
                    className="ml-1 hover:bg-indigo-500/30 rounded-full p-0.5 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Separator className="bg-slate-700" />
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-300">
            {hasSearched && searchResults.length > 0 ? `Search Results (${searchResults.length})` : "Search Results"}
          </h3>
          {renderSearchResults()}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={handleCancel}
          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={tempSelectedRecipients.length === 0}
        >
          Confirm Selection ({tempSelectedRecipients.length})
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default RecipientSearchModal
