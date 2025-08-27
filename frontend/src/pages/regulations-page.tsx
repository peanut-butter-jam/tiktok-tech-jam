import NavBar from "@/components/nav-bar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/table";
import { Button } from "@/shared/ui/button";
import { Plus, FileText, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/pagination";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const RegulationsPage = () => {
  const navigate = useNavigate();

  // Example data
  const regulations = [
    { id: "1", title: "Regulation 1", createdDate: "2023-08-01" },
    { id: "2", title: "Regulation 2", createdDate: "2023-08-15" },
    { id: "3", title: "Regulation 3", createdDate: "2023-09-01" },
    { id: "4", title: "Regulation 4", createdDate: "2023-09-10" },
    { id: "5", title: "Regulation 5", createdDate: "2023-09-20" },
    { id: "6", title: "Regulation 6", createdDate: "2023-09-25" },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate paginated data
  const totalPages = Math.ceil(regulations.length / rowsPerPage);
  const paginatedData = regulations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Updated handleView function
  const handleView = (id: string) => {
    navigate(`/regulations/${id}`);
  };

  // Dummy logic for handleDelete
  const handleDelete = (title: string) => {
    console.log(`Deleting regulation: ${title}`);
    // Later, replace this with a call to your custom hook or API logic
  };

  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-glow text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <FileText className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold">Regulations</h1>
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
          <h2 className="text-2xl font-semibold mb-6">All Regulations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((regulation) => (
                <TableRow key={regulation.id}>
                  <TableCell>{regulation.title}</TableCell>
                  <TableCell>{regulation.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(regulation.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(regulation.title)}
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RegulationsPage;
