"use client"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../Componants/UiElements/card"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Button } from "../../Componants/UiElements/button"
import { dispatchAction, ACTION_TYPES } from "../../redux/actionDispatcher"
import api from "../../Utils/api"

const ProfileTab = ({ user }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }

    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Display name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Display name must be at least 2 characters"
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Display name must be less than 50 characters"
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      setErrors({})

      const updateData = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      }

      await api.put("/api/user/profile", updateData)
      const updatedUser = {
        ...user,
        ...updateData,
      }

      dispatchAction(dispatch, ACTION_TYPES.CURRENT_USER, updatedUser)
      setSuccessMessage("Profile updated successfully!")
    } catch (error) {
      console.error("Profile update error:", error)

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({
          submit: error.response?.data?.message || "Failed to update profile",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const hasChanges = () => {
    if (!user) return false
    return formData.name !== (user.name || "") || formData.bio !== (user.bio || "")
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="text-xl">Profile Information</CardTitle>
        <p className="text-slate-400 text-sm">Update your display name and bio information</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your display name"
              className={`bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
              maxLength={50}
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
            <p className="text-slate-500 text-xs">{formData.name.length}/50 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell others about yourself (optional)"
              className={`bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 min-h-[100px] resize-none ${
                errors.bio ? "border-red-500 focus:border-red-500" : ""
              }`}
              maxLength={500}
            />
            {errors.bio && <p className="text-red-400 text-sm">{errors.bio}</p>}
            <p className="text-slate-500 text-xs">{formData.bio.length}/500 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="bg-slate-900/30 border-slate-700 text-slate-400 cursor-not-allowed"
            />
            <p className="text-slate-500 text-xs">Email address cannot be changed from this page</p>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading || !hasChanges()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProfileTab
