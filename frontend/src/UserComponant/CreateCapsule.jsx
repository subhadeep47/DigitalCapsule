"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../Componants/UiElements/button"
import BasicDetailsForm from "./createCapsule/BasicDetailsForm"
import ContentForm from "./createCapsule/ContentForm"
import CapsuleSummary from "./createCapsule/CapsuleSummary"
import { useDispatch, useSelector } from "react-redux"
import { ACTION_TYPES, dispatchAction } from "../redux/actionDispatcher"
import api from "../Utils/api"
import { useNavigate } from "react-router-dom"

const CreateCapsule = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { error } = useSelector((state) => state.capsules)

  const [capsuleData, setCapsuleData] = useState({
    title: "",
    description: "",
    dateToUnlock: "",
    recipientEmails: "",
    personalMessage: "",
  })

  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("content")

  const isValid = capsuleData.title && capsuleData.description && capsuleData.recipientEmails && capsuleData.dateToUnlock

  useEffect(() => {
    if(!user?.verified){
      alert("Verify you email to get full access of Digital Capsule Application!")
      navigate("/dashboard")
    }
  }, [ navigate, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    try {
      setUploading(true)
      setProgress(0)

      const formData = new FormData()

      // Append capsule data as JSON blob
      formData.append(
        "capsule",
        new Blob(
          [
            JSON.stringify({
              ...capsuleData,
              recipientEmails: capsuleData.recipientEmails
                .split(",")
                .map((email) => email.trim())
                .filter((email) => email),
            }),
          ],
          { type: "application/json" },
        ),
      )

      // Append files
      for (const file of files) {
        formData.append("files", file)
      }

      const response = await api.post("/api/capsules", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        },
      })

      dispatchAction(dispatch, ACTION_TYPES.ADD_CAPSULE, response.data)
      setUploading(false)

      // Navigate to dashboard
      alert("Time capsule created successfully!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating capsule:", error)
      dispatchAction(dispatch, ACTION_TYPES.SET_ERROR, error.message)
      setUploading(false)
      setProgress(0)
    }
  }

  const navigateBack = () => {
    navigate("/dashboard")
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
          <Button type='button' variant="ghost" onClick={navigateBack} className="text-slate-300 hover:text-white mb-4">
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
              type="button"
              onClick={() => dispatchAction(dispatch, ACTION_TYPES.CLEAR_ERROR)}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Forms */}
            <div className="md:col-span-2 space-y-6">
              <BasicDetailsForm capsuleData={capsuleData} setCapsuleData={setCapsuleData} />

              <ContentForm
                files={files}
                setFiles={setFiles}
                capsuleData={capsuleData}
                setCapsuleData={setCapsuleData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            {/* Right column - Summary */}
            <div className="space-y-6">
              <CapsuleSummary
                capsuleData={capsuleData}
                files={files}
                uploading={uploading}
                progress={progress}
                isValid={isValid}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCapsule

