"use client"
import { useState, useEffect, useRef } from "react"
import { CheckCircle, Mail, RotateCcw } from "lucide-react"
import { Modal, ModalHeader, ModalContent } from "../UiElements/modal"
import { Button } from "../UiElements/button"
import { Input } from "../UiElements/input"
import api from "../../Utils/api"

const OTPVerificationModal = ({ isOpen, onClose, email, onSuccess, title = "Verify Your Email" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""])
      setError("")
      setTimeLeft(300)
      setCanResend(false)
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOtp(newOtp.join(""))
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("")
        const newOtp = [...otp]
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit
        })
        setOtp(newOtp)

        // Focus last filled input or next empty one
        const lastIndex = Math.min(digits.length - 1, 5)
        inputRefs.current[lastIndex]?.focus()

        // Auto-submit if complete
        if (digits.length === 6) {
          handleVerifyOtp(digits.join(""))
        }
      })
    }
  }

  const handleVerifyOtp = async (otpCode = otp.join("")) => {
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await api.post("/auth/verify-otp", {
        email,
        otp: otpCode,
      })

      if (response.data) {
        onSuccess()
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setError(error.response?.data?.message || "Invalid OTP code. Please try again.")
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsResending(true)
      setError("")

      const response = await api.post("/auth/resend-otp", { email })

      if (response.data.success) {
        setTimeLeft(300)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bg-white max-w-md">
      <ModalHeader>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to:</p>
          <p className="font-semibold text-gray-900 mt-1">{email}</p>
        </div>
      </ModalHeader>

      <ModalContent className="space-y-6">
        {/* OTP Input */}
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Code expires in: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="text-sm text-red-600 font-semibold">Code expired</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">{error}</div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => handleVerifyOtp()}
            disabled={isLoading || otp.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Code
              </>
            )}
          </Button>

          <Button
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
            variant="outline"
            className="w-full bg-transparent"
          >
            {isResending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                Sending...
              </div>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                {canResend ? "Resend Code" : `Resend in ${formatTime(timeLeft)}`}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Didn't receive the code? Check your spam folder or try resending.
        </p>
      </ModalContent>
    </Modal>
  )
}

export default OTPVerificationModal
