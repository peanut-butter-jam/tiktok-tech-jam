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

const FeaturesPage = () => {
  const navigate = useNavigate();

  // Example data
  const features = [
    { id: "1", title: "Feature 1", createdDate: "2023-08-01" },
    { id: "2", title: "Feature 2", createdDate: "2023-08-15" },
    { id: "3", title: "Feature 3", createdDate: "2023-09-01" },
    { id: "4", title: "Feature 4", createdDate: "2023-09-10" },
    { id: "5", title: "Feature 5", createdDate: "2023-09-20" },
    { id: "6", title: "Feature 6", createdDate: "2023-09-25" },
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
  const handleView = (id: string) => {
    navigate(`/features/${id}`);
  };

  // Dummy logic for handleDelete
  const handleDelete = (title: string) => {
    console.log(`Deleting feature: ${title}`);
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
                <TableHead>Title</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>{feature.title}</TableCell>
                  <TableCell>{feature.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(feature.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(feature.title)}
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