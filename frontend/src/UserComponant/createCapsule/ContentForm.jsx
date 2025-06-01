"use client"
import { File, FileImage, FileText, Trash, Upload } from "lucide-react"
import { Card, CardContent } from "../../Componants/UiElements/card"
import { Label } from "../../Componants/UiElements/label"
import { Textarea } from "../../Componants/UiElements/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Componants/UiElements/tabs"
import { Button } from "../../Componants/UiElements/button"

const ContentForm = ({ files, setFiles, message, setMessage, activeTab, setActiveTab }) => {
  const handleFileUpload = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const id = Math.random().toString(36).substring(2, 9)
        const fileItem = {
          id,
          name: file.name,
          type: file.type,
          size: file.size,
        }

        if (file.type.startsWith("image/")) {
          fileItem.preview = URL.createObjectURL(file)
        }

        return fileItem
      })

      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (id) => {
    setFiles(files.filter((file) => file.id !== id))
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
                <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileUpload} />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-10 w-10 text-slate-400 mb-2" />
                  <p className="text-slate-300 font-medium">Drag files here or click to upload</p>
                  <p className="text-slate-400 text-sm mt-1">Photos, videos, documents, and more</p>
                </label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>
                  {files.length} {files.length === 1 ? "File" : "Files"} Added
                </Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center bg-slate-900/50 rounded-md p-2 border border-slate-700"
                    >
                      {file.preview ? (
                        <div className="h-12 w-12 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded bg-slate-800 mr-3 flex items-center justify-center flex-shrink-0">
                          {file.type.includes("image") ? (
                            <FileImage className="h-6 w-6 text-indigo-400" />
                          ) : file.type.includes("text") || file.type.includes("document") ? (
                            <FileText className="h-6 w-6 text-indigo-400" />
                          ) : (
                            <File className="h-6 w-6 text-indigo-400" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file.id)}
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
              <Label htmlFor="message">Personal Message</Label>
              <Textarea
                id="message"
                placeholder="Write a personal message to be revealed when the capsule unlocks..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
