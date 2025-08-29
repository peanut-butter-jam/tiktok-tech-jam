import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextBox } from "../components/text-box";
import { SubmitButton } from "../components/button";
import NavBar from "@/components/nav-bar";
import { Plus, Loader2 } from "lucide-react";
import axios from "axios";

export const FeatureUpload: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pollFeatureDetails = async (featureId: string): Promise<any> => {
    const axiosInstance = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return new Promise((resolve) => {
      const poll = async () => {
        try {
          const response = await axiosInstance.get(`/features/${featureId}`);
          const feature = response.data;

          // Check if feature has been processed (has status and reasoning)
          if (feature.status && feature.reasoning) {
            resolve(feature);
          } else {
            // Continue polling every 2 seconds
            setTimeout(poll, 2000);
          }
        } catch (error) {
          // Continue polling on error
          setTimeout(poll, 2000);
        }
      };
      poll();
    });
  };

  const handleSubmit = async () => {
    const axiosInstance = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!title.trim() || !description.trim() || !documentation.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/features/upload", {
        title: title.trim(),
        description: description.trim(),
        documentation: documentation.trim(),
      });

      if (response.status === 200) {
        console.log("Feature uploaded successfully");

        // Get feature ID from response
        const featureId = response.data.id;

        // Start polling for feature details
        const featureData = await pollFeatureDetails(featureId);

        // Navigate to feature view page with data
        navigate(`/features/${featureId}`, {
          state: { feature: featureData },
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading feature:", error);
      alert("Failed to upload feature. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <div className="bg-card rounded-lg shadow-md p-8 border border-border relative">
              {/* Loading Overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-foreground font-medium">
                      Processing feature...
                    </p>
                  </div>
                </div>
              )}

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
                  <SubmitButton
                    disabled={!isFormValid || isSubmitting}
                    onClick={handleSubmit}
                  >
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
