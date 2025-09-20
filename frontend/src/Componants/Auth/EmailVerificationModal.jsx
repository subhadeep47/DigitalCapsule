"use client"
import { useState } from "react"
import { AlertCircle, Mail } from "lucide-react"
import { Modal, ModalHeader, ModalContent } from "../UiElements/modal"
import { Button } from "../UiElements/button"
import OTPVerificationModal from "./OTPVerificationModal"
import api from "../../Utils/api"

const EmailVerificationModal = ({ isOpen, onClose, email, onVerificationSuccess }) => {
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSendOtp = async () => {
    try{
        setIsLoading(true)
        const response = await api.post("/auth/send-otp", {
            email
        })

        if (response.data) {
            setShowOtpModal(true)
        }
    } catch(error) {
        console.error("OTP sending error:", error)
        setError(error.response?.data?.message || "Error while sending otp. Please try again.")
    } finally {
        setIsLoading(false)
    }
  }

  const handleOtpSuccess = () => {
    setShowOtpModal(false)
    onVerificationSuccess()
  }

  const handleOtpModalClose = () => {
    setShowOtpModal(false)
  }

  return (
    <>
      <Modal isOpen={isOpen && !showOtpModal} onClose={onClose} className="bg-white max-w-md">
        <ModalHeader>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Not Verified</h2>
            <p className="text-gray-600 mt-2">Please verify your email address to continue</p>
          </div>
        </ModalHeader>

        <ModalContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-700 mb-2">Your account email:</p>
            <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg break-all">{email}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Why verify your email?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Secure your account</li>
                  <li>Receive important notifications</li>
                  <li>Enable password recovery</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
                {isLoading ? (
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending code....
                </div>
                ) : (
                <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                </>
                )}
            </Button>

            <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
              I'll verify later
            </Button>
          </div>
          {/* Error */}
            {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">{error}</div>
            )}

          <p className="text-xs text-gray-500 text-center">
            You can still browse, but some features may be limited until verification.
          </p>
        </ModalContent>
      </Modal>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOtpModal}
        onClose={handleOtpModalClose}
        email={email}
        onSuccess={handleOtpSuccess}
        title="Verify Your Email"
      />
    </>
  )
}

export default EmailVerificationModal
