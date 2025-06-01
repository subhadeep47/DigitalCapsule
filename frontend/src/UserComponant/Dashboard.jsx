"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "../Componants/UiElements/button"
import { Input } from "../Componants/UiElements/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Componants/UiElements/tabs"
import StatsCard from "./dashboard/StatsCard"
import CapsuleGrid from "./dashboard/CapsuleGrid"
import EmptyState from "./dashboard/EmptyState"
import CapsuleDetailModal from "./CapsuleDetailModal"

// Mock API with fixed data
const api = {
  get: async (url) => {
    return {
      data: url.includes("created")
        ? [
            {
              id: 1,
              title: "Graduation Memories",
              description: "A collection of memories from our graduation day",
              unlockDate: "2025-06-15T00:00:00",
              recipientEmail: "friend@example.com",
              status: "locked",
              createdAt: "2025-05-10T14:30:00",
              mediaCount: 5,
              message: "Hope you enjoy these memories from our special day!",
            },
            {
              id: 2,
              title: "Birthday Wishes 2024",
              description: "Birthday wishes for your 30th birthday",
              unlockDate: "2023-08-20T00:00:00", // Past date - unlocked
              recipientEmail: "family@example.com",
              status: "unlocked",
              createdAt: "2023-07-25T10:15:00",
              mediaCount: 3,
              message: "Happy 30th birthday! Here are some special memories for you.",
            },
          ]
        : [
            {
              id: 3,
              title: "Wedding Memories",
              description: "Special moments from our wedding day",
              unlockDate: "2024-07-10T00:00:00",
              senderEmail: "bestfriend@example.com",
              status: "locked",
              createdAt: "2023-07-10T09:45:00",
              mediaCount: 10,
              message: "Congratulations on your wedding! These are some beautiful moments from your special day.",
            },
          ],
    }
  },
}

const Dashboard = () => {
  const [myCapsules, setMyCapsules] = useState([])
  const [receivedCapsules, setReceivedCapsules] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCapsule, setSelectedCapsule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isLoggedIn = localStorage.getItem("isLoggedIn")

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoading(true)

      Promise.all([api.get("/api/capsules/created"), api.get("/api/capsules/received")])
        .then(([createdRes, receivedRes]) => {
          setMyCapsules(createdRes.data)
          setReceivedCapsules(receivedRes.data)
        })
        .catch((err) => console.error("Fetch error:", err))
        .finally(() => setIsLoading(false))
    } else {
      window.location.href = "/"
    }
  }, [isLoggedIn])

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
    window.location.href = "/create-capsule"
  }

  const handleViewDetails = (capsule) => {
    setSelectedCapsule(capsule)
    setIsModalOpen(true)
  }

  const handleDeleteCapsule = (capsuleId) => {
    // Implement delete functionality
    console.log("Delete capsule:", capsuleId)
    // Remove from state for demo
    setMyCapsules(myCapsules.filter((c) => c.id !== capsuleId))
    setReceivedCapsules(receivedCapsules.filter((c) => c.id !== capsuleId))
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={navigateToCreateCapsule} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Capsule
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <StatsCard myCapsules={myCapsules} receivedCapsules={receivedCapsules} />

        {/* Tabs for My Capsules and Received Capsules */}
        <Tabs defaultValue="my-capsules" className="mb-8">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="my-capsules" className="data-[state=active]:bg-indigo-600">
              My Capsules ({filteredMyCapsules.length})
            </TabsTrigger>
            <TabsTrigger value="received" className="data-[state=active]:bg-indigo-600">
              Shared With Me ({filteredReceivedCapsules.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-capsules" className="mt-4">
            {filteredMyCapsules.length > 0 ? (
              <CapsuleGrid
                capsules={filteredMyCapsules}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteCapsule}
              />
            ) : (
              <EmptyState type="created" onCreateCapsule={navigateToCreateCapsule} />
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-4">
            {filteredReceivedCapsules.length > 0 ? (
              <CapsuleGrid
                capsules={filteredReceivedCapsules}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteCapsule}
              />
            ) : (
              <EmptyState type="received" />
            )}
          </TabsContent>
        </Tabs>

        {/* Capsule Detail Modal */}
        <CapsuleDetailModal capsule={selectedCapsule} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  )
}

export default Dashboard
