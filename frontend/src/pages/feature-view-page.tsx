import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, ArrowLeft, FileText } from "lucide-react";

import { Button } from "@/shared/ui/button";

// Define the Feature type
interface Feature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastChecked: string | null;
  category: string;
  status: string;
  reasoning: string;
  relatedDocuments: { name: string; size: number }[];
}

const FeatureView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [facts, setFacts] = useState<string[]>([]);

  // Dummy data
  const dummyFeatures: Feature[] = [
    {
      id: "1",
      name: "Example Feature 1",
      description: "This is the first example feature description.",
      createdAt: "2023-08-01",
      lastChecked: "2023-09-01",
      category: "User Interface",
      status: "Compliant",
      reasoning:
        "This feature adheres to all current accessibility guidelines and privacy regulations. It implements proper data handling and user consent mechanisms.",
      relatedDocuments: [
        { name: "Feature_Spec_1.pdf", size: 2048 },
        { name: "Design_Doc_1.docx", size: 1024 },
      ],
    },
    {
      id: "2",
      name: "Example Feature 2",
      description: "This is the second example feature description.",
      createdAt: "2023-07-15",
      lastChecked: "2023-08-20",
      category: "Backend",
      status: "Non-Compliant",
      reasoning:
        "This feature requires updates to meet the latest data retention policies. The current implementation stores user data longer than permitted under GDPR.",
      relatedDocuments: [],
    },
  ];

  const dummyFacts: string[] = [
    "This feature was implemented to improve user experience.",
    "It integrates with the existing authentication system.",
    "Performance testing shows 25% improvement in load times.",
  ];

  const loadFeature = () => {
    // Find the feature with the matching `id`
    const featureData = dummyFeatures.find((feature) => feature.id === id);

    // Set the feature data (or null if not found)
    setFeature(featureData || null);

    // Set dummy facts for now
    setFacts(dummyFacts);
  };

  useEffect(() => {
    loadFeature();
  }, [id]);

  // Handle download logic
  const handleDownload = (documentName: string) => {
    console.log(`Downloading file: ${documentName}`);
    // Add your download logic here (e.g., fetch the file from the server)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Settings className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">{feature?.name}</h1>
                <p className="text-lg opacity-90">Feature Details</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => navigate("/features")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Details */}
          <div className="border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Feature Name
              </h3>
              <p className="text-foreground bg-muted p-4 rounded-lg">
                {feature?.name}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Description
              </h3>
              <div className="text-foreground bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {feature?.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Added to System
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {feature?.createdAt || "Date not available"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Last Checked
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {feature?.lastChecked || "Not yet analyzed"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Category
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {feature?.category || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Status
                </h3>
                <p
                  className={`p-4 rounded-lg font-medium ${
                    feature?.status === "Compliant"
                      ? "text-green-700 bg-green-50 border border-green-200"
                      : feature?.status === "Non-Compliant"
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : "text-foreground bg-muted"
                  }`}
                >
                  {feature?.status || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Reasoning
              </h3>
              <div className="text-foreground bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {feature?.reasoning || "No reasoning provided"}
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Related Documents
            </h3>
            {feature?.relatedDocuments &&
            feature.relatedDocuments.length > 0 ? (
              <div className="space-y-2">
                {feature.relatedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 bg-muted rounded-lg"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(doc.name);
                      }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {doc.name}
                    </a>
                    <span className="text-xs text-muted-foreground">
                      {(doc.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No related documents uploaded</p>
              </div>
            )}
          </div>

          {/* Facts About the Feature */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Facts About the Feature
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {facts.map((fact, index) => (
                <li key={index} className="text-sm text-foreground">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureView;
