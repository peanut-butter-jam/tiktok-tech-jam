import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, ArrowLeft, FileText } from "lucide-react";

import { Button } from "@/shared/ui/button";

// Define the Regulation type
interface Regulation {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastChecked: string | null;
  country: string;
  relatedDocuments: { name: string; size: number }[];
}

const RegulationView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [facts, setFacts] = useState<string[]>([]);

  // Dummy data
  const dummyRegulations: Regulation[] = [
    {
      id: "1",
      name: "Example Regulation 1",
      description: "This is the first example regulation description.",
      createdAt: "2023-08-01",
      lastChecked: "2023-09-01",
      country: "United States",
      relatedDocuments: [
        { name: "Document 1.pdf", size: 2048 },
        { name: "Document 2.docx", size: 1024 },
      ],
    },
    {
      id: "2",
      name: "Example Regulation 2",
      description: "This is the second example regulation description.",
      createdAt: "2023-07-15",
      lastChecked: "2023-08-20",
      country: "Canada",
      relatedDocuments: [],
    },
  ];

  const dummyFacts: string[] = [
    "This regulation was enacted to ensure data privacy.",
    "It applies to all companies handling user data.",
    "Non-compliance may result in significant fines.",
  ];

  const loadRegulation = () => {
    // Find the regulation with the matching `id`
    const regulationData = dummyRegulations.find(
      (regulation) => regulation.id === id
    );

    // Set the regulation data (or null if not found)
    setRegulation(regulationData || null);

    // Set dummy facts for now
    setFacts(dummyFacts);
  };

  useEffect(() => {
    loadRegulation();
  }, [id]);

  // Handle download logic
  const handleDownload = (documentName: string) => {
    console.log(`Downloading file: ${documentName}`);
    // Add your download logic here (e.g., fetch the file from the server)
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Settings className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">{regulation?.name}</h1>
                <p className="text-lg opacity-90">Regulation Details</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/regulations")}
              >
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
                Regulation Name
              </h3>
              <p className="text-foreground bg-muted p-4 rounded-lg">
                {regulation?.name}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Description
              </h3>
              <div className="text-foreground bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {regulation?.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Added to System
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {regulation?.createdAt || "Date not available"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Last Checked
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {regulation?.lastChecked || "Not yet analyzed"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Country/Region
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {regulation?.country || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Related Documents */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Related Documents
            </h3>
            {regulation?.relatedDocuments &&
            regulation.relatedDocuments.length > 0 ? (
              <div className="space-y-2">
                {regulation.relatedDocuments.map((doc, index) => (
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

          {/* Facts About the Regulation */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Facts About the Regulation
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

export default RegulationView;
