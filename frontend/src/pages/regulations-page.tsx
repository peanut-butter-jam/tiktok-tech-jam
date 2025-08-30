import NavBar from "@/components/nav-bar";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/table";
import { Button } from "@/shared/ui/button";
import { Plus, FileText, Info, Trash2, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/pagination";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegulations } from "@/hooks/use-regulations";

import type { RegulationDTO } from "@/lib/api/regulation";

const RegulationsPage = () => {
    const navigate = useNavigate();

    // Fetch regulations using the API with auto-refresh for processing regulations
    const {
        data: regulations = [],
        isLoading,
        error,
    } = useRegulations({
        refetchInterval: (data) => {
            // Poll every 5 seconds if there are any regulations still processing
            if (!data || !Array.isArray(data)) return false;
            const hasProcessingRegulations = data.some(
                (reg) => reg.rous === null
            );
            return hasProcessingRegulations ? 5000 : false;
        },
        refetchIntervalInBackground: true,
        queryKey: [],
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Log API responses for debugging
    useEffect(() => {
        console.log("=== REGULATIONS API RESPONSE ===");
        console.log("Loading:", isLoading);
        console.log("Error:", error);
        console.log("Data:", regulations);
        console.log("================================");
    }, [regulations, isLoading, error]);

    // Calculate paginated data
    const totalPages = Math.ceil((regulations?.length || 0) / rowsPerPage);
    const paginatedData = regulations.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Updated handleView function
    const handleView = (regulation: RegulationDTO) => {
        navigate(`/regulations/${regulation.id}`, {
            state: { regulation },
        });
    };

    // Placeholder logic for handleDelete (no backend implementation yet)
    const handleDelete = (id: string) => {
        console.log(`Delete regulation placeholder: ${id}`);
        // TODO: Implement delete functionality when backend endpoint is available
    };

    return (
        <div>
            <NavBar />
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <FileText className="h-10 w-10" />
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        Regulations
                                    </h1>
                                    <p className="text-lg opacity-90">
                                        Manage regulatory requirements
                                    </p>
                                </div>
                            </div>
                            <Button asChild variant="secondary" size="lg">
                                <Link to="/regulations/upload">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Regulation
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl font-semibold mb-6">
                        All Regulations
                    </h2>

                    {isLoading && (
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-gray-500">
                                Loading regulations...
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center p-8 text-red-500">
                            <p>Error loading regulations: {error.message}</p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>File Object ID</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.map((regulation) => (
                                        <TableRow key={regulation.id}>
                                            <TableCell>
                                                {regulation.title}
                                            </TableCell>
                                            <TableCell>
                                                {regulation.rous === null ? (
                                                    <div className="flex items-center space-x-2 text-yellow-600">
                                                        <Clock className="h-4 w-4 animate-spin" />
                                                        <span className="text-sm font-medium">
                                                            Processing
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2 text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="text-sm font-medium">
                                                            Processed
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {regulation.id}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {regulation.file_object_id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleView(
                                                                regulation
                                                            )
                                                        }
                                                    >
                                                        <Info className="h-4 w-4 mr-1" />
                                                        Details
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                regulation.id.toString()
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Show message if no regulations */}
                            {regulations.length === 0 && (
                                <div className="text-center p-8 text-gray-500">
                                    No regulations found. Upload your first
                                    regulation to get started.
                                </div>
                            )}

                            {/* Pagination - Only show if there are regulations */}
                            {regulations.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegulationsPage;
