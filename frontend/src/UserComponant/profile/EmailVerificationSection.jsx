"use client"

import { useState } from "react"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import { Alert, AlertDescription } from "../../Componants/UiElements/alert"
import { sendEmailVerificationOTP } from "../../actions/authAction"

const EmailVerificationSection = ({ user, onVerificationSuccess }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // 'success' or 'error'

  const handleSendVerification = async () => {
    setIsLoading(true)
    setMessage("")

    const result = await sendEmailVerificationOTP(user.email)

    if (result.success) {
      setMessage("Verification code sent to your email")
      setMessageType("success")
    } else {
      setMessage(result.error)
      setMessageType("error")
    }

    setIsLoading(false)
  }

  if (user?.verified) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Email Verified</span>
        </div>
        <p className="text-sm text-slate-400">
          Your email address <span className="font-medium">{user.email}</span> is verified.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-orange-400">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Email Not Verified</span>
      </div>

      <p className="text-sm text-slate-400">
        Your email address <span className="font-medium">{user.email}</span> needs verification. Some features are
        restricted until verification is complete.
      </p>

      {message && (
        <Alert className={messageType === "success" ? "border-green-500" : "border-red-500"}>
          <AlertDescription className={messageType === "success" ? "text-green-400" : "text-red-400"}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSendVerification} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700">
        <Mail className="mr-2 h-4 w-4" />
        {isLoading ? "Sending..." : "Send Verification Code"}
      </Button>
    </div>
  )
}

export default EmailVerificationSection
