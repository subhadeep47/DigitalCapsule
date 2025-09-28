"use client"

import { useState } from "react"
import { Mail, Eye, EyeOff } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Alert, AlertDescription } from "../../Componants/UiElements/alert"
import { changeEmail } from "../../actions/authAction"

const ChangeEmailSection = ({ currentEmail, onEmailChanged }) => {
  const [newEmail, setNewEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newEmail || !password) {
      setMessage("Please fill in all fields")
      setMessageType("error")
      return
    }

    if (newEmail === currentEmail) {
      setMessage("New email must be different from current email")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    const result = await changeEmail(newEmail, password)

    if (result.success) {
      setMessage("Email change request sent. Please check your new email for verification.")
      setMessageType("success")
      setNewEmail("")
      setPassword("")
      if (onEmailChanged) {
        onEmailChanged(newEmail)
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
        <h3 className="text-lg font-medium text-white mb-2">Change Email Address</h3>
        <p className="text-sm text-slate-400">
          Current email: <span className="font-medium">{currentEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="newEmail">New Email Address</Label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="currentPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter current password"
              className="bg-slate-800 border-slate-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
          <Mail className="mr-2 h-4 w-4" />
          {isLoading ? "Changing..." : "Change Email"}
        </Button>
      </form>
    </div>
  )
}

export default ChangeEmailSection
