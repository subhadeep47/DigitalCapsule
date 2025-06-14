import { Calendar, Gift, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../Componants/UiElements/card"

const StatsCards = ({ myCapsules, receivedCapsules }) => {
  const calculateTimeRemaining = (unlockDate) => {
    const now = new Date()
    const unlock = new Date(unlockDate)
    const diffTime = unlock.getTime() - now.getTime()

    if (diffTime <= 0) return "Unlocked"

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 1 ? "1 day remaining" : `${diffDays} days remaining`
  }

  const lockedCapsulesCount =
    myCapsules.filter((c) => new Date(c.dateToUnlock) > new Date()).length +
    receivedCapsules.filter((c) => new Date(c.dateToUnlock) > new Date()).length

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
          <div className="text-3xl font-bold">{myCapsules.length + receivedCapsules.length}</div>
          <p className="text-slate-400 text-sm">
            {myCapsules.length} created · {receivedCapsules.length} received
          </p>
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
          <div className="text-3xl font-bold">{lockedCapsulesCount}</div>
          <p className="text-slate-400 text-sm">Waiting to be unlocked</p>
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
          {myCapsules.length > 0 || receivedCapsules.length > 0 ? (
            <>
              <div className="text-3xl font-bold">
                {(() => {
                  const allCapsules = [...myCapsules, ...receivedCapsules]
                    .filter((c) => new Date(c.dateToUnlock) > new Date())
                    .sort((a, b) => new Date(a.dateToUnlock).getTime() - new Date(b.dateToUnlock).getTime())

                  if (allCapsules.length === 0) return "None"

                  const nextUnlock = new Date(allCapsules[0].dateToUnlock)
                  return nextUnlock.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                })()}
              </div>
              <p className="text-slate-400 text-sm">
                {(() => {
                  const allCapsules = [...myCapsules, ...receivedCapsules]
                    .filter((c) => new Date(c.dateToUnlock) > new Date())
                    .sort((a, b) => new Date(a.dateToUnlock).getTime() - new Date(b.dateToUnlock).getTime())

                  if (allCapsules.length === 0) return "No upcoming unlocks"

                  return calculateTimeRemaining(allCapsules[0].dateToUnlock)
                })()}
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold">-</div>
              <p className="text-slate-400 text-sm">No capsules yet</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards
