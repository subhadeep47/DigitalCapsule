"use client"

import EmailVerificationSection from "./EmailVerificationSection"
import ChangeEmailSection from "./ChangeEmailSection"
import ChangePasswordSection from "./ChangePasswordSection"
import { Separator } from "../../Componants/UiElements/separator"
import { updateProfile } from "../../actions/authAction"
import { ACTION_TYPES, dispatchAction } from "../../redux/actionDispatcher"
import { useDispatch } from "react-redux"
import { useState } from "react"

const AuthTab = ({ user }) => {

  const dispatch = useDispatch()

  const [successMessage, setSuccessMessage] = useState("")

  const onUserUpdate = (updatedUser) => {
    dispatchAction(dispatch, ACTION_TYPES.CURRENT_USER, updatedUser)
    setSuccessMessage("Profile update successfully")
  }

  const handleVerificationSuccess = () => {
    // Update user verification status
    const updatedUser = { ...user, verified: true }
    onUserUpdate(updatedUser)
  }

  const handleEmailChanged = (updatedData) => {
    // Update user with new email data
    const updatedUser = { ...user, ...updatedData }
    onUserUpdate(updatedUser)
  }

  const handlePasswordChanged = async (updatedData) => {
    // Password change doesn't update user object, just show success
    onUserUpdate(user)
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

      {successMessage && (
        <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
          {successMessage}
        </div>
      )}
    </div>
  )
}

export default AuthTab
