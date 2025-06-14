"use client"
import { Calendar, User } from "lucide-react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Input } from "../../Componants/UiElements/input"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Switch } from "../../Componants/UiElements/switch"
import { Button } from "../../Componants/UiElements/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../Componants/UiElements/popover"
import { Calendar as CalendarComponent } from "../../Componants/UiElements/calendar"
import { format, cn } from "../../Utils/utils"

const BasicDetailsForm = ({ capsuleData, setCapsuleData }) => {
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)

  const handleInputChange = (field, value) => {
    setCapsuleData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDateSelect = (date) => {
    handleInputChange("dateToUnlock", date ? date.toISOString() : "")
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
              className="bg-slate-900/50 border-slate-700 text-white"
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
              className="bg-slate-900/50 border-slate-700 text-white min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipient Emails</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="recipients"
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  value={capsuleData.recipientEmails}
                  onChange={(e) => handleInputChange("recipientEmails", e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white pl-9"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">Separate multiple emails with commas</p>
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
                      "w-full justify-start text-left font-normal bg-slate-900/50 border-slate-700 text-white hover:bg-slate-800/50",
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
                    disabled={(date) => date < minDate}
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
    </Card>
  )
}

export default BasicDetailsForm
