"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../Componants/UiElements/button"
import BasicDetailsForm from "./createCapsule/BasicDetailsForm"
import ContentForm from "./createCapsule/ContentForm"
import CapsuleSummary from "./createCapsule/CapsuleSummary"

// Mock API
const api = {
  post: async (url, data) => {
    console.log("Creating capsule:", data)
    return { data: { ...data, id: Math.floor(Math.random() * 1000) } }
  },
}

const CreateCapsule = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [recipientEmails, setRecipientEmails] = useState("")
  const [unlockDate, setUnlockDate] = useState(undefined)
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notifyRecipient, setNotifyRecipient] = useState(true)
  const [activeTab, setActiveTab] = useState("content")

  const isValid = title && description && recipientEmails && unlockDate

  const handleSubmit = async () => {
    if (!isValid) return

    setIsSubmitting(true)

    try {
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

      await api.post("/api/capsules", capsuleData)
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error creating capsule:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const navigateBack = () => {
    window.location.href = "/dashboard"
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
