"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Alert, AlertDescription } from "../../Componants/UiElements/alert"
import { changePassword } from "../../actions/authAction"

const ChangePasswordSection = ({ onPasswordChanged }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields")
      setMessageType("error")
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match")
      setMessageType("error")
      return
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long")
      setMessageType("error")
      return
    }

    if (currentPassword === newPassword) {
      setMessage("New password must be different from current password")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    const result = await changePassword(currentPassword, newPassword)

    if (result.success) {
      setMessage("Password changed successfully")
      setMessageType("success")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      if (onPasswordChanged) {
        onPasswordChanged()
      }
    } else {
      setMessage(result.error)
      setMessageType("error")
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Change Password</h3>
        <p className="text-sm text-slate-400">Update your password to keep your account secure.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="bg-slate-800 border-slate-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-slate-800 border-slate-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-slate-800 border-slate-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {message && (
          <Alert className={messageType === "success" ? "border-green-500" : "border-red-500"}>
            <AlertDescription className={messageType === "success" ? "text-green-400" : "text-red-400"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
          <Lock className="mr-2 h-4 w-4" />
          {isLoading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  )
}

export default ChangePasswordSection
