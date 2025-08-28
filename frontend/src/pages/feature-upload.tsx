import React, { useState } from "react";
import { TextBox } from "../components/text-box";
import { SubmitButton } from "../components/button";
import NavBar from "@/components/nav-bar";
import { Plus } from "lucide-react";

export const FeatureUpload: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentation, setDocumentation] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !documentation.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          documentation: documentation.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Feature uploaded:", result);
      alert("Feature uploaded successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setDocumentation("");
    } catch (error) {
      console.error("Error uploading feature:", error);
      alert("Failed to upload feature. Please try again.");
    }
  };

  const isFormValid =
    title.trim() && description.trim() && documentation.trim();

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4">
              <Plus className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Upload Feature</h1>
                <p className="text-lg opacity-90">
                  Add new features to the compliance system
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
                Feature Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Title
                  </label>
                  <TextBox
                    value={title}
                    placeholder="Enter feature title"
                    onChange={setTitle}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Description
                  </label>
                  <TextBox
                    value={description}
                    placeholder="Enter feature description"
                    onChange={setDescription}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Documentation
                  </label>
                  <TextBox
                    value={documentation}
                    placeholder="Enter documentation details"
                    onChange={setDocumentation}
                    className="w-full"
                  />
                </div>

                <div className="text-center">
                  <SubmitButton disabled={!isFormValid} onClick={handleSubmit}>
                    Add Feature
                  </SubmitButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureUpload;
