"use client"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, User } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Componants/UiElements/tabs"
import ProfileHeader from "./ProfileHeader"
import ProfileTab from "./ProfileTab"
import AuthTab from "./AuthTab"

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { dashboardSummary } = useSelector((state) => state.capsules)

  const [activeTab, setActiveTab] = useState("profile")

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const getUserStats = () => {
    if (!dashboardSummary) return null

    return {
      totalCapsules: dashboardSummary.totalCapsules || 0,
      createdCapsules: dashboardSummary.createdCapsules || 0,
      receivedCapsules: dashboardSummary.receivedCapsules || 0,
    }
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
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToDashboard}
            className="text-slate-300 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-extrabold">Profile Settings</h1>
          <p className="text-slate-300 mt-1">Manage your account and preferences</p>
        </motion.div>

        <ProfileHeader user={user} userStats={getUserStats()} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="bg-slate-800/50 border-slate-700 w-full justify-start">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="auth" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Authentication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileTab user={user} />
            </TabsContent>
            <TabsContent value="auth" className="mt-6">
              <AuthTab user={user} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage
