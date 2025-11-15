"use client"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Save, Loader2, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../Componants/UiElements/card"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Button } from "../../Componants/UiElements/button"
import { Switch } from "../../Componants/UiElements/switch"
import { dispatchAction, ACTION_TYPES } from "../../redux/actionDispatcher"
import api from "../../Utils/api"

const ProfileTab = ({ user }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    visibility: 'PUBLIC_VISIBLE'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        visibility: user.visibility || 'PUBLIC_VISIBLE'
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

  const handleVisibilityChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      visibility: value ? 'PUBLIC_VISIBLE' : 'ONLY_ME_VISIBLE',
    }))
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

      const updatedUser = {
        ...user,
        ...{
          name: formData.name.trim(),
          bio: formData.bio.trim(),
          visibility: formData.visibility
        }
      }

      await api.put("/user/update-profile", updatedUser)

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
    return ["name", "bio", "visibility"].some(
        key => (formData[key] ?? "") !== (user[key] ?? "")
      );
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

          <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Privacy Settings</h3>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-3">
              {formData.isProfilePublic ? (
                <Eye className="h-5 w-5 text-green-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-slate-400" />
              )}
              <div>
                <p className="font-medium text-white">Public Profile</p>
                <p className="text-sm text-slate-400">
                  {formData.isProfilePublic
                    ? "Your profile is visible to other users"
                    : "Your profile is private and only visible to you"}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <Switch
                checked={formData.visibility === 'PUBLIC_VISIBLE' ? true : false}
                onCheckedChange={(checked) => handleVisibilityChange(checked)} //handling seperately until friends features integrates
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-700 rounded-lg p-4">
            <div className="text-sm text-slate-300">
              <p className="font-semibold mb-2">When your profile is public:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Other users can find you in search</li>
                <li>Your name and basic stats are visible</li>
                <li>Your profile picture is shown</li>
                <li>Your bio (if set) is displayed</li>
              </ul>
              <p className="font-semibold mt-3 mb-2">Always private:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Your email address</li>
                <li>Your private capsules</li>
                <li>Personal messages in capsules</li>
              </ul>
            </div>
          </div>
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
