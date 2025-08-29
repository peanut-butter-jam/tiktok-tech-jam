import NavBar from "@/components/nav-bar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/table";
import { Button } from "@/shared/ui/button";
import { Plus, FileText, Info, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const RegulationsPage = () => {
  const navigate = useNavigate();

  // Example data
  const regulations: Regulation[] = [
    {
      id: "1",
      name: "EU Digital Service Law",
      description: "REGULATION (EU) 2022/2065 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL",
      createdAt: "2023-08-01",
      details: [
        {
          id: "1",
          section: "Orders to act against illegal content",
          description: "This section mandates the removal of illegal content.",
        },
        {
          id: "2",
          section: "Compliance",
          description: "This section outlines the compliance requirements.",
        },
      ],
    },
    {
      id: "2",
      name: "California State Law",
      description: "CALIFORNIA CONSUMER PRIVACY ACT (CCPA)",
      createdAt: "2023-07-15",
      details: [
        {
          id: "1",
          section: "Overview",
          description: "This section provides an overview of the California State Law.",
        },
        {
          id: "2",
          section: "Compliance",
          description: "This section outlines the compliance requirements.",
        },
      ],
    },
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
  const handleView = (regulation: Regulation) => {
    navigate(`/regulations/${regulation.id}`, {
      state: { regulation },
    });
  };

  // Dummy logic for handleDelete
  const handleDelete = (id: string) => {
    console.log(`Deleting regulation: ${id}`);
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((regulation) => (
                <TableRow key={regulation.id}>
                  <TableCell>{regulation.name}</TableCell>
                  <TableCell>{regulation.description}</TableCell>
                  <TableCell>{regulation.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(regulation)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(regulation.id)}
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
