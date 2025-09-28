"use client"

import EmailVerificationSection from "./EmailVerificationSection"
import ChangeEmailSection from "./ChangeEmailSection"
import ChangePasswordSection from "./ChangePasswordSection"
import { Separator } from "../../Componants/UiElements/separator"

const AuthTab = ({ user, onUserUpdate }) => {
  const handleVerificationSuccess = () => {
    // Update user verification status
    const updatedUser = { ...user, verified: true }
    if (onUserUpdate) {
      onUserUpdate(updatedUser)
    }
  }

  const handleEmailChanged = (updatedData) => {
    // Update user with new email data
    const updatedUser = { ...user, ...updatedData }
    if (onUserUpdate) {
      onUserUpdate(updatedUser)
    }
  }

  const handlePasswordChanged = (updatedData) => {
    // Password change doesn't update user object, just show success
    if (onUserUpdate) {
      onUserUpdate(user) // Refresh user data
    }
  }

  return (
    <div className="space-y-8">
      {/* Email Verification Section */}
      <EmailVerificationSection user={user} onVerificationSuccess={handleVerificationSuccess} />

      <Separator className="bg-slate-700" />

      {/* Change Email Section */}
      <ChangeEmailSection currentEmail={user?.email} onEmailChanged={handleEmailChanged} />

      <Separator className="bg-slate-700" />

      {/* Change Password Section */}
      <ChangePasswordSection onPasswordChanged={handlePasswordChanged} />
    </div>
  )
}

export default AuthTab
