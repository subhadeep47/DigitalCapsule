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
import UserProfileHeader from "./dashboard/UserProfileHeader";


const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    myCapsules,
    receivedCapsules,
    myPagination,
    receivedPagination,
    selectedCapsule,
    isModalOpen,
    searchQuery,
    activeTab,
    error,
  } = useSelector((state) => state.capsules)
  const { isLoggedIn } = useSelector((state) => state.auth)

  // Local loading states
  const [isLoadingMyCapsules, setIsLoadingMyCapsules] = useState(false)
  const [isLoadingReceivedCapsules, setIsLoadingReceivedCapsules] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Pagination states
  const [myCurrentPage, setMyCurrentPage] = useState(1)
  const [receivedCurrentPage, setReceivedCurrentPage] = useState(1)
  const itemsPerPage = 6

  const fetchCurrentUser = async () => {
    try {
      setIsLoadingUser(true)
      const currentUser = await api.get("/auth/me")
      dispatchAction(dispatch, ACTION_TYPES.CURRENT_USER, currentUser.data)
      setIsLoadingUser(false)
    } catch (error) {
      dispatchAction(
        dispatch,
        ACTION_TYPES.SET_ERROR,
        error?.response?.data +
          ". Please try to perform logout and login. Also make sure third party cookie is allowed 🙂",
      )
      setIsLoadingUser(false)
    }
  }

  const fetchMyCapsules = async (page = 1) => {
    try {
      setIsLoadingMyCapsules(true)
      const response = await api.get(`/api/capsules/created?page=${page}&limit=${itemsPerPage}`)
      dispatchAction(dispatch, ACTION_TYPES.SET_MY_CAPSULES, response.data)
      setIsLoadingMyCapsules(false)
    } catch (error) {
      console.error("Error fetching my capsules:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error.message)
      setIsLoadingMyCapsules(false)
    }
  }

  const fetchReceivedCapsules = async (page = 1) => {
    try {
      setIsLoadingReceivedCapsules(true)
      const response = await api.get(`/api/capsules/received?page=${page}&limit=${itemsPerPage}`)
      dispatchAction(dispatch, ACTION_TYPES.SET_RECEIVED_CAPSULES, response.data)
      setIsLoadingReceivedCapsules(false)
    } catch (error) {
      console.error("Error fetching received capsules:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error.message)
      setIsLoadingReceivedCapsules(false)
    }
  }

  // Initial load
  useEffect(() => {
    const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn")
    if (loggedIn) {
      if (!isLoggedIn) {
        dispatchAction(dispatch, ACTION_TYPES.LOGIN)
      }
      fetchCurrentUser()
      fetchMyCapsules(1)
      fetchReceivedCapsules(1)
    } else {
      navigate("/")
    }
  }, [isLoggedIn, navigate, dispatch])

  // Handle pagination for my capsules
  const handleMyPageChange = (page) => {
    setMyCurrentPage(page)
    fetchMyCapsules(page)
  }

  // Handle pagination for received capsules
  const handleReceivedPageChange = (page) => {
    setReceivedCurrentPage(page)
    fetchReceivedCapsules(page)
  }

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

      // Refresh current page data after deletion
      if (activeTab === "my-capsules") {
        fetchMyCapsules(myCurrentPage)
      } else {
        fetchReceivedCapsules(receivedCurrentPage)
      }

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

  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn")
  if (!loggedIn) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-start mb-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold">Time Capsule Dashboard</h1>
            <p className="text-slate-300 mt-1">Preserve moments, unlock memories</p>
          </motion.div>

          {isLoadingUser ? (
            <div className="flex items-center space-x-3 p-2">
              <div className="h-10 w-10 rounded-full bg-slate-700 animate-pulse"></div>
              <div className="hidden sm:block">
                <div className="h-4 bg-slate-700 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <UserProfileHeader />
          )}
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search your time capsules..."
                className="pl-8 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Button
            onClick={navigateToCreateCapsule}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Capsule
          </Button>
        </div>

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
        <StatsCard
          myCapsules={myCapsules}
          receivedCapsules={receivedCapsules}
          myPagination={myPagination}
          receivedPagination={receivedPagination}
          isLoadingMyCapsules={isLoadingMyCapsules}
          isLoadingReceivedCapsules={isLoadingReceivedCapsules}
        />

        {/* Tabs for My Capsules and Received Capsules */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="my-capsules">
              My Capsules ({myPagination?.totalItems || filteredMyCapsules.length})
            </TabsTrigger>
            <TabsTrigger value="received">
              Shared With Me ({receivedPagination?.totalItems || filteredReceivedCapsules.length})
            </TabsTrigger>
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
                pagination={myPagination}
                onPageChange={handleMyPageChange}
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
                pagination={receivedPagination}
                onPageChange={handleReceivedPageChange}
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
