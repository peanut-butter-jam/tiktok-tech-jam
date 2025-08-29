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
import { Plus, Settings, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Feature } from "@/types/feature";

const FeaturesPage = () => {
  const navigate = useNavigate();

  // Example data
  const features: Feature[] = [
    {
      id: "1",
      name: "Feature 1",
      description: "Description for Feature 1",
      createdAt: "2023-08-01",
      updatedAt: "2023-08-15",
      status: "Active",
      reasoning: "Feature is working as expected",
      flag: false,
      regulationsViolated: [],
    },
    {
      id: "2",
      name: "Feature 2",
      description: "Description for Feature 2",
      createdAt: "2023-08-15",
      updatedAt: "2023-08-20",
      status: "Active",
      reasoning: "Feature meets security requirements",
      flag: false,
      regulationsViolated: [],
    },
    {
      id: "3",
      name: "Feature 3",
      description: "Description for Feature 3",
      createdAt: "2023-09-01",
      updatedAt: null,
      status: "Inactive",
      reasoning: "Feature needs performance optimization",
      flag: false,
      regulationsViolated: [],
    },
    {
      id: "4",
      name: "Feature 4",
      description: "Description for Feature 4",
      createdAt: "2023-09-10",
      updatedAt: "2023-09-15",
      status: "Active",
      reasoning: "Feature improves user experience",
      flag: false,
      regulationsViolated: [],
    },
    {
      id: "5",
      name: "Feature 5",
      description: "Description for Feature 5",
      createdAt: "2023-09-20",
      updatedAt: "2023-09-25",
      status: "Active",
      reasoning: "API integration working correctly",
      flag: true,
      regulationsViolated: [{
        id: "1",
        name: "Regulation 1",
        description: "Description for Regulation 1",
      }],
    },
    {
      id: "6",
      name: "Feature 6",
      description: "Description for Feature 6",
      createdAt: "2023-09-25",
      updatedAt: null,
      status: "Inactive",
      reasoning: "Database optimization required",
      flag: false,
      regulationsViolated: [],
    },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate paginated data
  const totalPages = Math.ceil(features.length / rowsPerPage);
  const paginatedData = features.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Updated handleView function
  const handleView = (feature: Feature) => {
    navigate(`/features/${feature.id}`, { state: { feature } });
  };

  // Dummy logic for handleDelete
  const handleDelete = (name: string) => {
    console.log(`Deleting feature: ${name}`);
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
                <Settings className="h-10 w-10" />
                <div>
                  <h1 className="text-3xl font-bold">Features</h1>
                  <p className="text-lg opacity-90">
                    Manage application features
                  </p>
                </div>
              </div>
              <Button asChild variant="secondary" size="lg">
                <Link to="/features/upload">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Feature
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">All Features</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>{feature.name}</TableCell>
                  <TableCell>{feature.createdAt}</TableCell>
                  <TableCell>{feature.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(feature)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feature.name)}
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

export default FeaturesPage;