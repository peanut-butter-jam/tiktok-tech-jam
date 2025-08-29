import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import type { Feature } from "@/types/feature";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

const FeatureView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [feature, setFeature] = useState<Feature | null>(null);

  const loadFeature = () => {
    // First, try to get feature data from navigation state
    const passedFeature = location.state?.feature;
    setFeature(passedFeature);
  };

  useEffect(() => {
    loadFeature();
  }, [id]);

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
                  Updated At
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {feature?.updatedAt || "Not yet analyzed"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Flag
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {feature?.flag ? "Yes" : "No"}
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

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Regulations Violated
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feature?.regulationsViolated?.map((regulation) => (
                    <TableRow key={regulation.id}>
                      <TableCell>{regulation.name}</TableCell>
                      <TableCell>{regulation.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureView;
