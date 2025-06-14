"use client"
import { Trash, Upload } from "lucide-react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Componants/UiElements/tabs"
import { Button } from "../../Componants/UiElements/button"

const ContentForm = ({ files, setFiles, capsuleData, setCapsuleData, activeTab, setActiveTab }) => {
  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleMessageChange = (value) => {
    setCapsuleData((prev) => ({
      ...prev,
      personalMessage: value,
    }))
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return "🖼️"
    if (file.type.startsWith("video/")) return "🎥"
    if (file.type === "application/pdf") return "📄"
    return "📁"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="content" className="data-[state=active]:bg-indigo-600">
              Content
            </TabsTrigger>
            <TabsTrigger value="message" className="data-[state=active]:bg-indigo-600">
              Message
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Add Files</Label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center bg-slate-900/30">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-slate-300 font-medium">Drag files here or click to upload</p>
                  <p className="text-slate-400 text-sm mt-1">Images, videos, and PDF documents</p>
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>
                  {files.length} {files.length === 1 ? "File" : "Files"} Selected
                </Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-slate-900/50 rounded-md p-3 border border-slate-700"
                    >
                      <div className="h-10 w-10 rounded bg-slate-800 mr-3 flex items-center justify-center flex-shrink-0 text-lg">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-white">{file.name}</p>
                        <p className="text-xs text-slate-400">
                          {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="text-slate-400 hover:text-white hover:bg-red-900/30"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="message" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="personalMessage">Personal Message</Label>
              <Textarea
                id="personalMessage"
                placeholder="Write a personal message to be revealed when the capsule unlocks..."
                value={capsuleData.personalMessage}
                onChange={(e) => handleMessageChange(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white min-h-[200px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default ContentForm
