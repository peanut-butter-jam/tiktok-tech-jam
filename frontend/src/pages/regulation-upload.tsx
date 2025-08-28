import React, { useState } from "react";
import { DropBox } from "../components/drop-box";
import { SubmitButton } from "../components/button";
import NavBar from "@/components/nav-bar";
import { Upload } from "lucide-react";

const RegulationUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (files: FileList) => {
    setUploadedFiles(Array.from(files));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setUploadedFiles([]);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
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
                Upload Regulation Files
              </h2>

              <div className="space-y-6">
                <DropBox
                  onFileUpload={handleFileUpload}
                  acceptedFileTypes=".pdf,.txt"
                  multiple={true}
                  maxFileSize={50}
                />

                <div className="text-center">
                  <SubmitButton
                    disabled={uploadedFiles.length === 0 || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Uploading..." : "Submit Files"}
                  </SubmitButton>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground text-center">
                    {uploadedFiles.length} file(s) ready to upload
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
