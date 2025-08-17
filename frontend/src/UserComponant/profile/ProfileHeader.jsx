"use client"
import { Calendar, Gift, Clock } from "lucide-react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import AvatarUpload from "./AvatarUpload"

const ProfileHeader = ({ user, userStats }) => {
  if (!user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-slate-400">Unable to load profile information</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getDisplayName = () => {
    return user.name || user.email?.split("@")[0] || "User"
  }

  const formatJoinDate = () => {
    if (!user.createdAt) return "Recently"
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-shrink-0">
            <AvatarUpload user={user} />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white mb-2">{getDisplayName()}</h2>
            <p className="text-slate-400 mb-4 break-all">{user.email}</p>

            {user.bio && <p className="text-slate-300 mb-4 text-sm leading-relaxed">{user.bio}</p>}

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center text-slate-400">
                <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                <span>Joined {formatJoinDate()}</span>
              </div>

              {userStats && (
                <>
                  <div className="flex items-center text-slate-400">
                    <Gift className="mr-2 h-4 w-4 text-green-400" />
                    <span>{userStats.totalCapsules} Total Capsules</span>
                  </div>

                  <div className="flex items-center text-slate-400">
                    <Clock className="mr-2 h-4 w-4 text-orange-400" />
                    <span>{userStats.createdCapsules} Created</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileHeader
