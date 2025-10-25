"use client"
import { useState } from "react"
import { AlertTriangle, Mail, X } from "lucide-react"
import { Button } from "../../Componants/UiElements/button"
import EmailVerificationModal from "../../Componants/Auth/EmailVerificationModal"

const VerificationBanner = ({ userEmail, onVerificationSuccess, onDismiss }) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const handleVerifyClick = () => {
    setShowVerificationModal(true)
  }

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false)
    if (onVerificationSuccess) {
      onVerificationSuccess()
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <>
      <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-orange-200 font-semibold text-sm mb-1">Email Verification Required</h3>
              <p className="text-orange-300 text-sm mb-3">
                Some features are restricted until you verify your email address.
                <span className="font-medium"> {userEmail}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleVerifyClick} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Mail className="mr-2 h-4 w-4" />
                  Verify Now
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-orange-300 hover:text-orange-200 hover:bg-orange-900/30"
                >
                  I'll verify later
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="icon"
            className="text-orange-400 hover:text-orange-300 hover:bg-orange-900/30 h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={userEmail}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  )
}

export default VerificationBanner
