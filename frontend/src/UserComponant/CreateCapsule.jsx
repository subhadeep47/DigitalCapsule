"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../Componants/UiElements/button"
import BasicDetailsForm from "./createCapsule/BasicDetailsForm"
import ContentForm from "./createCapsule/ContentForm"
import CapsuleSummary from "./createCapsule/CapsuleSummary"
//import api from "../Utils/api"
import { useDispatch, useSelector } from "react-redux"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"

// Mock API
const api = {
  post: async (url, data) => {
    console.log("Creating capsule:", data)
    return { data: { ...data, id: Math.floor(Math.random() * 1000) } }
  },
}

const CreateCapsule = () => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { error } = useSelector((state) => state.capsules)

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [recipientEmails, setRecipientEmails] = useState("")
  const [unlockDate, setUnlockDate] = useState(undefined)
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState([])
  const [notifyRecipient, setNotifyRecipient] = useState(true)
  const [activeTab, setActiveTab] = useState("content")

  const isValid = title && description && recipientEmails && unlockDate

  const handleSubmit = async () => {
    if (!isValid) return

    try {
      setIsSubmitting(true)

      const emailList = recipientEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email)

      const capsuleData = {
        title,
        description,
        recipientEmails: emailList,
        unlockDate: unlockDate.toISOString(),
        message,
        mediaCount: files.length,
        status: "locked",
        createdAt: new Date().toISOString(),
        notifyRecipient,
      }

      const response = await api.post("/api/capsules", capsuleData)
      dispatchAction(dispatch, ACTION_TYPES.ADD_CAPSULE, response.data)
      setIsSubmitting(false)

      // Navigate to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error creating capsule:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error.message)
      setIsSubmitting(false)
    }
  }

  const navigateBack = () => {
    window.location.href = "/dashboard"
  }

  if (!isLoggedIn) {
    window.location.href = "/"
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={navigateBack} className="text-slate-300 hover:text-white mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-extrabold">Create New Time Capsule</h1>
          <p className="text-slate-300 mt-1">Preserve your memories for the future</p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
            <p>Error: {error}</p>
            <button
              onClick={() => dispatchAction(dispatch, ACTION_TYPES.CLEAR_ERROR)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Forms */}
          <div className="md:col-span-2 space-y-6">
            <BasicDetailsForm
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              recipientEmails={recipientEmails}
              setRecipientEmails={setRecipientEmails}
              unlockDate={unlockDate}
              setUnlockDate={setUnlockDate}
              notifyRecipient={notifyRecipient}
              setNotifyRecipient={setNotifyRecipient}
            />

            <ContentForm
              files={files}
              setFiles={setFiles}
              message={message}
              setMessage={setMessage}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Right column - Summary */}
          <div className="space-y-6">
            <CapsuleSummary
              title={title}
              recipientEmails={recipientEmails}
              unlockDate={unlockDate}
              files={files}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              isValid={isValid}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCapsule
