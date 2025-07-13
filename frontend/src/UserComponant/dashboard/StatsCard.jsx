import { Calendar, Gift, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../Componants/UiElements/card"

const StatsCards = ({
  myCapsules,
  receivedCapsules,
  myPagination,
  receivedPagination,
  isLoadingMyCapsules,
  isLoadingReceivedCapsules,
}) => {
  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Start of today

    const unlock = new Date(unlockDate)
    unlock.setHours(0, 0, 0, 0) // Start of unlock day

    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`
  }

  const isCapsulelocked = (capsule) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const unlockDate = new Date(capsule.dateToUnlock)
    unlockDate.setHours(0, 0, 0, 0)
    return unlockDate > today
  }

  // Use pagination totals if available
  const totalMyCapsules = myPagination?.totalItems ?? myCapsules.length
  const totalReceivedCapsules = receivedPagination?.totalItems ?? receivedCapsules.length
  const totalCapsules = totalMyCapsules + totalReceivedCapsules

  // Calculate locked capsules from current page data
  const currentPageCapsules = [...myCapsules, ...receivedCapsules]
  const lockedCapsules = currentPageCapsules.filter(isCapsulelocked).length

  const getNextUnlockCapsule = () => {
    return currentPageCapsules
      .filter(isCapsulelocked)
      .sort((a, b) => new Date(a.dateToUnlock).getTime() - new Date(b.dateToUnlock).getTime())[0]
  }

  const nextUnlockCapsule = getNextUnlockCapsule()

  const isLoading = isLoadingMyCapsules || isLoadingReceivedCapsules

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Gift className="mr-2 h-5 w-5 text-indigo-400" />
            Total Capsules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold">{totalCapsules}</div>
              <p className="text-slate-400 text-sm">
                {totalMyCapsules} created · {totalReceivedCapsules} received
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Lock className="mr-2 h-5 w-5 text-indigo-400" />
            Locked Capsules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-32"></div>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold">{lockedCapsules}</div>
              <p className="text-slate-400 text-sm">
                {currentPageCapsules.length > 0 ? "From current page" : "Waiting to be unlocked"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-indigo-400" />
            Next Unlock
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-32"></div>
            </div>
          ) : nextUnlockCapsule ? (
            <>
              <div className="text-3xl font-bold">
                {new Date(nextUnlockCapsule.dateToUnlock).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <p className="text-slate-400 text-sm">{calculateTimeRemaining(nextUnlockCapsule.dateToUnlock)}</p>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">-</div>
              <p className="text-slate-400 text-sm">
                {currentPageCapsules.length > 0 ? "No locked capsules on this page" : "No upcoming unlocks"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards
