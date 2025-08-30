import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Settings, ArrowLeft, FileText, Calendar, Database, Clock, CheckCircle } from "lucide-react";
import { useRegulation } from "@/hooks/use-regulations";
import type { RegulationDTO, RouDto } from "@/lib/api/regulation";

import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/table";
import Pagination from "@/components/pagination";


const RegulationView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Fetch the regulation data using the API with polling
  const { data: regulation, isLoading, error, isProcessing } = useRegulation(
    id ? parseInt(id) : 0
  );
  
  // Debug logging
  console.log('Regulation View - URL param id:', id);
  console.log('Regulation View - Parsed ID:', id ? parseInt(id) : 0);
  console.log('Regulation View - Loading:', isLoading);
  console.log('Regulation View - Error:', error);
  console.log('Regulation View - Data:', regulation);

  // Pagination state for ROUs
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination for ROUs
  const rous = regulation?.rous || [];
  const totalItems = rous.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRous = rous.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading regulation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !regulation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {error ? `Error: ${error.message}` : "Regulation not found"}
          </p>
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
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <FileText className="h-10 w-10" />
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold">{regulation.title}</h1>
                  {isProcessing ? (
                    <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Processed</span>
                    </div>
                  )}
                </div>
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
              <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Regulation Title
              </h3>
              <p className="text-foreground bg-muted p-4 rounded-lg">
                {regulation.title}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  ID
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {regulation.id}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Created
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {new Date(regulation.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Updated
                </h3>
                <p className="text-foreground bg-muted p-4 rounded-lg">
                  {new Date(regulation.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                File Object ID
              </h3>
              <p className="text-foreground bg-muted p-4 rounded-lg font-mono text-sm break-all">
                {regulation.file_object_id}
              </p>
            </div>

            {/* ROUs Section */}
            {rous.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Regulatory Obligation Units ({totalItems} total)
                </h3>
                <div className="space-y-4">
                  {paginatedRous.map((rou: RouDto) => (
                    <div key={rou.id} className="border rounded-lg p-4 bg-muted/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_3fr] gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-foreground">ID: {rou.id}</span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-foreground">Source ID: {rou.source_id}</span>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-foreground">Jurisdiction: {rou.jurisdiction}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Description:</span>
                          <p className="mt-1">{rou.desc}</p>
                        </div>

                        {rou.obligations && rou.obligations.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Obligations:</span>
                            <ul className="mt-1 space-y-1">
                              {rou.obligations.map((obligation, index) => (
                                <li key={index} className="text-sm flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {obligation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(rou.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                {isProcessing ? (
                  <>
                    <Clock className="h-12 w-12 mx-auto text-yellow-500 mb-4 animate-spin" />
                    <p className="text-lg text-yellow-600 font-medium">Processing regulation...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      We're extracting regulatory obligations from your document. This usually takes a few moments.
                    </p>
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-700">
                        💡 <strong>Tip:</strong> You can navigate away and come back later. The processing will continue in the background.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">No ROUs found for this regulation</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This regulation has been processed but contains no extractable regulatory obligations.
                    </p>
                  </>
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
