import React, { useState } from "react";
import { DropBox } from "@/components/drop-box";
import { SubmitButton } from "@/components/button";
import NavBar from "@/components/nav-bar";
import { Upload } from "lucide-react";
import { useRegulationUploadFlow } from "@/hooks/use-regulations";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const RegulationUpload: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const { uploadRegulationWithFile, isLoading, error, reset } = useRegulationUploadFlow();
  const navigate = useNavigate();

  const handleFileUpload = (files: FileList) => {
    if (files.length > 0) {
      setUploadedFile(files[0]); // Only take the first file
      // Auto-generate title from filename if not already set
      if (!title && files[0].name) {
        const nameWithoutExtension = files[0].name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExtension);
      }
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("Please upload a file before submitting.");
      return;
    }

    if (!title.trim()) {
      alert("Please provide a title for the regulation.");
      return;
    }

    try {
      const regulation = await uploadRegulationWithFile(uploadedFile, title.trim());
      alert(`Regulation "${regulation.title}" uploaded successfully!`);
      
      // Reset form
      setUploadedFile(null);
      setTitle("");
      reset();
      
      // Navigate back to regulations page
      navigate("/regulations");
    } catch (err) {
      console.error("Upload error:", err);
      // Error is already handled by the hook, but we can show additional UI feedback
    }
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4">
              <Upload className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Upload Regulations</h1>
                <p className="text-lg opacity-90">
                  Add new regulatory requirements to the system
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-md p-8 border border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                Upload New Regulation
              </h2>

              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="regulation-title">Regulation Title</Label>
                  <Input
                    id="regulation-title"
                    type="text"
                    placeholder="Enter regulation title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload */}
                <DropBox
                  onFileUpload={handleFileUpload}
                  acceptedFileTypes=".pdf,.txt,.doc,.docx"
                  multiple={false}
                  maxFileSize={50}
                />

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="font-medium">Upload failed:</p>
                    <p className="text-sm">{error.message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <SubmitButton
                    disabled={!uploadedFile || !title.trim() || isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Uploading..." : "Upload Regulation"}
                  </SubmitButton>
                </div>

                {/* File Info */}
                {uploadedFile && (
                  <div className="text-sm text-muted-foreground text-center bg-gray-50 p-3 rounded-lg">
                    <p><strong>Selected file:</strong> {uploadedFile.name}</p>
                    <p><strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationUpload;
