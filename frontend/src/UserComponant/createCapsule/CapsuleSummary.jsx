"use client"
import { Calendar, Info, Loader2, Send } from "lucide-react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Separator } from "../../Componants/UiElements/separator"
import { Alert, AlertDescription, AlertTitle } from "../../Componants/UiElements/alert"
import { Button } from "../../Componants/UiElements/button"
import { Progress } from "../../Componants/UiElements/progress"
import { format } from "../../Utils/utils"

const CapsuleSummary = ({ capsuleData, files, uploading, progress, isValid }) => {
  const selectedDate = capsuleData.dateToUnlock ? new Date(capsuleData.dateToUnlock) : null

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white sticky top-4">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Capsule Summary</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Title</p>
            <p className="font-medium">{capsuleData.title || "Untitled Capsule"}</p>
          </div>

          <Separator className="bg-slate-700" />

          <div>
            <p className="text-sm text-slate-400">Recipients</p>
            <p className="font-medium">{capsuleData.recipientList || "No recipients selected"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Unlocks On</p>
            <p className="font-medium flex items-center">
              {selectedDate ? (
                <>
                  <Calendar className="h-4 w-4 mr-1 text-indigo-400" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </>
              ) : (
                "No date selected"
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-400">Content</p>
            <p className="font-medium">
              {files.length} {files.length === 1 ? "file" : "files"}
            </p>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Upload Progress</span>
                <span className="text-indigo-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-700" />
            </div>
          )}

          <Alert className="bg-indigo-900/30 border-indigo-800 text-white">
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription className="text-sm text-slate-300">
              Once created, the capsule will be locked until the specified unlock date.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={uploading || !isValid}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading... {progress}%
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Time Capsule
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CapsuleSummary
