import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Settings, ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/table";
import Pagination from "@/components/pagination";

// Define the Regulation type
interface Regulation {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  details: {
    id: string;
    section: string;
    description: string;
  }[];
}

const RegulationView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the regulation object passed from the regulations page
  const regulation: Regulation | null = location.state?.regulation || null;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 5 details per page

  // Calculate pagination
  const totalItems = regulation?.details?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDetails = regulation?.details?.slice(startIndex, endIndex) || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!regulation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Regulation not found</p>
          <Button onClick={() => navigate("/regulations")} className="mt-4">
            Back to Regulations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Settings className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">{regulation.name}</h1>
                <p className="text-lg opacity-90">Regulation</p>
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
                {regulation.name}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Description
              </h3>
              <div className="text-foreground bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {regulation.description}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Date Added
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {regulation.createdAt
                    ? new Date(regulation.createdAt).toLocaleDateString()
                    : "Date not available"}
                </p>
              </div>
            </div>

            {/* Regulation Details */}
            {regulation.details && regulation.details.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Details ({totalItems} total)
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Section</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDetails.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.section}</TableCell>
                        <TableCell>{detail.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulationView;
