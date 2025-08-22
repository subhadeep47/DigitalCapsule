"use client"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Calendar, Gift, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Button } from "../../Componants/UiElements/button"
import ProfileImageModal from "../ProfileImageModal"
import api from "../../Utils/api"

const PublicProfilePage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [userId])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userData = await api.get(`community/public-profile?userId=${userId}`)
      setUser(userData.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError(error.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getAvatarDisplay = () => {
    if (user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))) {
      return (
        <img
          src={user.avatar || "/placeholder.svg"}
          alt={user?.name || user?.email?.split("@")[0] || "User"}
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setIsImageModalOpen(true)}
          loading="lazy"
        />
      )
    }
    const initials = user?.avatar || user?.name || user?.email?.split("@")[0] || "User".charAt(0).toUpperCase()
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-2xl">
        {initials}
      </div>
    )
  }

  const hasImage = user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/uploads"))

  const formatJoinDate = () => {
    if (!user?.createdAt) return "Recently"
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded w-48"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-slate-400 mb-6">{error || "This user profile doesn't exist or is private."}</p>
          <Button
            onClick={handleBack}
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button type="button" variant="ghost" onClick={handleBack} className="text-slate-300 hover:text-white mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-extrabold">User Profile</h1>
          <p className="text-slate-300 mt-1">Public profile information</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 text-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative group flex-shrink-0">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-slate-600 hover:border-indigo-500 transition-colors">
                        {getAvatarDisplay()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>

                  <div className="flex items-center text-slate-400">
                    <Mail className="mr-2 h-4 w-4" />
                    <span className="break-all">{user.email}</span>
                  </div>

                  {user.bio && <p className="text-slate-300 mb-2 leading-relaxed">{user.bio}</p>}

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-slate-400">
                      <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                      <div>
                        <div className="text-white font-medium">Joined {formatJoinDate()}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-400">
                      <Gift className="mr-2 h-4 w-4 text-green-400" />
                      <div>
                        <div className="text-white font-medium text-xl">{user.createdCapsulesCount}</div>
                        <div>Capsules Created</div>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-400">
                      <Gift className="mr-2 h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-white font-medium text-xl">{user.receivedCapsulesCount}</div>
                        <div>Capsules Received</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="bg-slate-800/30 border-slate-700 text-center p-8">
            <div className="flex flex-col items-center justify-center text-slate-400">
              <Gift className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Public Capsules</h3>
              <p>Public capsule sharing coming soon!</p>
            </div>
          </Card>
        </motion.div>

        {hasImage && (
          <ProfileImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            user={user}
            imageUrl={user.avatar}
          />
        )}

      </div>
    </div>
  )
}

export default PublicProfilePage
