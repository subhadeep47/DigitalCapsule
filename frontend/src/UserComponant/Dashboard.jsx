"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "../Componants/UiElements/button"
import { Input } from "../Componants/UiElements/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Componants/UiElements/tabs"
import StatsCard from "./dashboard/StatsCard"
import CapsuleGrid from "./dashboard/CapsuleGrid"
import EmptyState from "./dashboard/EmptyState"
import CapsuleDetailModal from "./CapsuleDetailModal"
import { useDispatch, useSelector } from "react-redux"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"
import api from "../Utils/api"


const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { myCapsules, receivedCapsules, selectedCapsule, isModalOpen, searchQuery, activeTab, error } = useSelector(
    (state) => state.capsules,
  )
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn) || localStorage.getItem("isLoggedIn")

  // Local loading states
  const [isLoadingMyCapsules, setIsLoadingMyCapsules] = useState(false)
  const [isLoadingReceivedCapsules, setIsLoadingReceivedCapsules] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      dispatchAction(dispatch, ACTION_TYPES.LOGIN)
      fetchCurrentUser()
      fetchCapsules()
    } else {
      navigate('/')
    }
  }, [isLoggedIn, dispatch])

  const fetchCurrentUser = async () => {
    try{
      //setting the current user
      setIsLoadingMyCapsules(true)
      const currentUser = await api.get("/auth/me")
      dispatchAction(dispatch, ACTION_TYPES.CURRENT_USER, currentUser.data)
      setIsLoadingMyCapsules(false)
    } catch (error) {
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error?.response?.data + '. Please try to perform logout and login. Also make sure third party cookie is allowed 🙂')
      setIsLoadingMyCapsules(false)
    }
  }

  const fetchCapsules = async () => {
    try {
      // Fetch my capsules
      setIsLoadingMyCapsules(true)
      const myCapsulesResponse = await api.get("/api/capsules/created")
      dispatchAction(dispatch, ACTION_TYPES.SET_MY_CAPSULES, myCapsulesResponse.data)
      setIsLoadingMyCapsules(false)

      // Fetch received capsules
      setIsLoadingReceivedCapsules(true)
      const receivedCapsulesResponse = await api.get("/api/capsules/received")
      dispatchAction(dispatch, ACTION_TYPES.SET_RECEIVED_CAPSULES, receivedCapsulesResponse.data)
      setIsLoadingReceivedCapsules(false)
    } catch (error) {
      console.error("Error fetching capsules:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error?.response?.data + '. Please try to perform logout and login. Also make sure third party cookie is allowed 🙂')
      setIsLoadingMyCapsules(false)
      setIsLoadingReceivedCapsules(false)
    }
  }

  // Filter capsules based on search query
  const filteredMyCapsules = myCapsules.filter(
    (capsule) =>
      capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredReceivedCapsules = receivedCapsules.filter(
    (capsule) =>
      capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const navigateToCreateCapsule = () => {
    navigate("/create")
  }

  const handleViewDetails = (capsule) => {
    dispatchAction(dispatch, ACTION_TYPES.SET_SELECTED_CAPSULE, capsule)
    dispatchAction(dispatch, ACTION_TYPES.SET_MODAL_OPEN, true)
  }

  const handleDeleteCapsule = async (capsuleId) => {
    if (!window.confirm("Are you sure you want to delete this capsule? This action cannot be undone.")) {
      return
    }
    try {
      setIsDeleting(true)
      await api.delete(`/api/capsules/${capsuleId}`)
      dispatchAction(dispatch, ACTION_TYPES.REMOVE_CAPSULE, capsuleId)
      setIsDeleting(false)
      alert("Capsule deleted successfully!")
    } catch (error) {
      console.error("Error deleting capsule:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error.message)
      setIsDeleting(false)
      alert("Failed to delete capsule. Please try again.")
    }
  }

  const handleSearchChange = (e) => {
    dispatchAction(dispatch, ACTION_TYPES.SET_SEARCH_QUERY, e.target.value)
  }

  const handleTabChange = (value) => {
    dispatchAction(dispatch, ACTION_TYPES.SET_ACTIVE_TAB, value)
  }

  const handleCloseModal = () => {
    dispatchAction(dispatch, ACTION_TYPES.SET_MODAL_OPEN, false)
  }

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold">Time Capsule Dashboard</h1>
            <p className="text-slate-300 mt-1">Preserve moments, unlock memories</p>
          </motion.div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search capsules..."
                className="pl-8 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button onClick={navigateToCreateCapsule} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Capsule
            </Button>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
            <p>Error: {error}</p>
            <button
              type="button"
              onClick={() => dispatchAction(dispatch, ACTION_TYPES.CLEAR_ERROR)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCard myCapsules={myCapsules} receivedCapsules={receivedCapsules} />

        {/* Tabs for My Capsules and Received Capsules */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="my-capsules">My Capsules ({filteredMyCapsules.length})</TabsTrigger>
            <TabsTrigger value="received">Shared With Me ({filteredReceivedCapsules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-capsules" className="mt-4">
            {isLoadingMyCapsules ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto"></div>
                <p className="text-slate-400 mt-2">Loading capsules...</p>
              </div>
            ) : filteredMyCapsules.length > 0 ? (
              <CapsuleGrid
                capsules={filteredMyCapsules}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteCapsule}
                isDeleting={isDeleting}
                canDelete={true}
              />
            ) : (
              <EmptyState type="created" onCreateCapsule={navigateToCreateCapsule} />
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-4">
            {isLoadingReceivedCapsules ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto"></div>
                <p className="text-slate-400 mt-2">Loading capsules...</p>
              </div>
            ) : filteredReceivedCapsules.length > 0 ? (
              <CapsuleGrid
                capsules={filteredReceivedCapsules}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteCapsule}
                isDeleting={isDeleting}
                canDelete={false}
              />
            ) : (
              <EmptyState type="received" />
            )}
          </TabsContent>
        </Tabs>

        {/* Capsule Detail Modal */}
        <CapsuleDetailModal capsule={selectedCapsule} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  )
}

export default Dashboard
