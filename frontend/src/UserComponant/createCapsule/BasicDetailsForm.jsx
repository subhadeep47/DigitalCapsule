"use client"
import { Calendar, User, X } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Switch } from "../../Componants/UiElements/switch"
import { Button } from "../../Componants/UiElements/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../Componants/UiElements/popover"
import { Calendar as CalendarComponent } from "../../Componants/UiElements/calendar"
import { format, cn } from "../../Utils/utils"
import { Badge } from "../../Componants/UiElements/badge"
import RecipientSearchModal from "./RecipientSearchModal"

const BasicDetailsForm = ({ capsuleData, setCapsuleData }) => {
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false)
  const [selectedRecipients, setSelectedRecipients] = useState([])


  const handleInputChange = (field, value) => {
    setCapsuleData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateSelect = (date) => {
    if (date) {
      const unlockDate = new Date(date)
      unlockDate.setHours(0, 0, 0, 0)

      const year = unlockDate.getFullYear()
      const month = String(unlockDate.getMonth() + 1).padStart(2, "0")
      const day = String(unlockDate.getDate()).padStart(2, "0")
      const dateString = `${year}-${month}-${day}`

      handleInputChange("dateToUnlock", dateString)
    } else {
      handleInputChange("dateToUnlock", "")
    }
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate <= today
  }

  const handleRecipientsSelect = (recipients) => {
    setSelectedRecipients(recipients)
    const emailList = recipients.map((r) => r.email).join(", ")
    handleInputChange("recipientEmails", emailList)
  }

  const removeRecipient = (emailToRemove) => {
    const updatedRecipients = selectedRecipients.filter((r) => r.email !== emailToRemove)
    setSelectedRecipients(updatedRecipients)
    const emailList = updatedRecipients.map((r) => r.email).join(", ")
    handleInputChange("recipientEmails", emailList)
  }

  const selectedDate = capsuleData.dateToUnlock ? new Date(capsuleData.dateToUnlock) : undefined

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Capsule Title</Label>
            <Input
              id="title"
              placeholder="Give your time capsule a name"
              value={capsuleData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this time capsule about?"
              value={capsuleData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipient Emails</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="recipients"
                      type="text"
                      placeholder="Search and select recipients..."
                      value=""
                      readOnly
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-indigo-500 pl-9 cursor-pointer"
                      onClick={() => setIsRecipientModalOpen(true)}
                    />
                  </div>
                </div>

                {/* Selected Recipients Display */}
                {selectedRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-900/30 border border-slate-700 rounded-md max-h-32 overflow-y-auto">
                    {selectedRecipients.map((recipient) => (
                      <Badge
                        key={recipient.email}
                        variant="secondary"
                        className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 flex items-center gap-1 max-w-full"
                      >
                        <span className="text-xs truncate max-w-[100px]" title={recipient.name}>
                          {recipient.name}
                        </span>
                        <span className="text-xs opacity-70 truncate max-w-[120px]" title={recipient.email}>
                          ({recipient.email})
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRecipient(recipient.email)}
                          className="ml-1 hover:bg-indigo-500/30 rounded-full p-0.5 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">Only registered users can receive capsules</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlock-date">Unlock Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    id="unlock-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800/50 hover:border-indigo-500",
                      !selectedDate && "text-slate-400",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select unlock date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                    className="bg-slate-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="notify"
              checked={capsuleData.notifyRecipient}
              onCheckedChange={(checked) => handleInputChange("notifyRecipient", checked)}
            />
            <Label htmlFor="notify" className="text-sm text-slate-300">
              Notify recipients that a capsule is waiting for them
            </Label>
          </div>
        </div>
      </CardContent>

      {/* Recipient Search Modal */}
      <RecipientSearchModal
        isOpen={isRecipientModalOpen}
        onClose={() => setIsRecipientModalOpen(false)}
        selectedRecipients={selectedRecipients}
        onRecipientsSelect={handleRecipientsSelect}
      />
    </Card>
  )
}

export default BasicDetailsForm
