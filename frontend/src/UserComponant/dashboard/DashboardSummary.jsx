"use client"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Calendar, Clock, TrendingUp, HardDrive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../Componants/UiElements/card"
import { Button } from "../../Componants/UiElements/button"
import { Progress } from "../../Componants/UiElements/progress"
import { Badge } from "../../Componants/UiElements/badge"
import api from "../../Utils/api"
import { dispatchAction, ACTION_TYPES } from "../../redux/actionDispatcher"

const DashboardSummary = ({ onViewCapsule }) => {
  const dispatch = useDispatch()
  const [summaryData, setSummaryData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardSummary()
  }, [])

  const fetchDashboardSummary = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/api/capsules/dashboard-summary")
      setSummaryData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard summary:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, "Failed to load dashboard summary")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const unlock = new Date(unlockDate)
    unlock.setHours(0, 0, 0, 0)
    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked!"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return "Tomorrow!"
    if (diffDays <= 30) return `${diffDays} days`
    return `${Math.ceil(diffDays / 30)} months`
  }

  const getUrgencyColor = (daysRemaining) => {
    if (daysRemaining <= 1) return "text-red-400 bg-red-900/20 border-red-800"
    if (daysRemaining <= 7) return "text-orange-400 bg-orange-900/20 border-orange-800"
    if (daysRemaining <= 30) return "text-yellow-400 bg-yellow-900/20 border-yellow-800"
    return "text-indigo-400 bg-indigo-900/20 border-indigo-800"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-64 bg-slate-800/50 border border-slate-700 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  if (!summaryData) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center text-slate-300">
              <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
              Total Capsules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.totalCapsules}</div>
            <p className="text-xs text-slate-400 mt-1">
              {summaryData.createdCapsules} created • {summaryData.receivedCapsules} received
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center text-slate-300">
              <Clock className="mr-2 h-4 w-4 text-orange-400" />
              Locked Capsules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.lockedCapsules}</div>
            <p className="text-xs text-slate-400 mt-1">{summaryData.upcomingUnlocks.thisWeek} unlock this week</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center text-slate-300">
              <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.upcomingUnlocks.thisMonth}</div>
            <p className="text-xs text-slate-400 mt-1">capsules unlocking</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center text-slate-300">
              <HardDrive className="mr-2 h-4 w-4 text-purple-400" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.storageUsed.percentageUsed.toFixed(1)}%</div>
            <Progress value={summaryData.storageUsed.percentageUsed} className="h-1.5 mt-2 bg-slate-700" />
            <p className="text-xs text-slate-400 mt-1">
              {summaryData.storageUsed.totalMB.toFixed(1)} MB of {summaryData.storageUsed.limitMB} MB
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Unlocks Section */}
      {summaryData.nextUnlocks && summaryData.nextUnlocks.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-400" />
              Upcoming Unlocks
            </CardTitle>
            <p className="text-slate-400 text-sm">
              {summaryData.upcomingUnlocks.next30Days} capsules unlocking in the next 30 days
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryData.nextUnlocks.slice(0, 6).map((capsule) => (
                <div
                  key={capsule.id}
                  className={`p-4 rounded-lg border transition-all hover:scale-105 cursor-pointer ${getUrgencyColor(capsule.daysRemaining)}`}
                  onClick={() => onViewCapsule && onViewCapsule(capsule)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white truncate flex-1 mr-2">{capsule.title}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${capsule.type === "created" ? "border-blue-500 text-blue-400" : "border-green-500 text-green-400"}`}
                    >
                      {capsule.type === "created" ? "Created" : "Received"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm opacity-90">
                      Unlocks:{" "}
                      {new Date(capsule.unlockDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-xs opacity-75">
                      {capsule.type === "received" && capsule.senderName
                        ? `From: ${capsule.senderName}`
                        : "Your capsule"}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm font-medium">{calculateTimeRemaining(capsule.unlockDate)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewCapsule && onViewCapsule(capsule)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {summaryData.nextUnlocks.length > 6 && (
              <div className="text-center mt-4">
                <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                  View All Upcoming ({summaryData.nextUnlocks.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Monthly Activity Chart */}
      {summaryData.monthlyStats && summaryData.monthlyStats.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryData.monthlyStats.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-sm font-medium w-20">{month.month}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Created: {month.created}</span>
                        <span>Received: {month.received}</span>
                        <span>Unlocked: {month.unlocked}</span>
                      </div>
                      <div className="flex space-x-1">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{
                            width: `${(month.created / Math.max(month.created + month.received + month.unlocked, 1)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="h-2 bg-green-500 rounded"
                          style={{
                            width: `${(month.received / Math.max(month.created + month.received + month.unlocked, 1)) * 100}%`,
                          }}
                        ></div>
                        <div
                          className="h-2 bg-yellow-500 rounded"
                          style={{
                            width: `${(month.unlocked / Math.max(month.created + month.received + month.unlocked, 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-slate-400">Created</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-slate-400">Received</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span className="text-slate-400">Unlocked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DashboardSummary
