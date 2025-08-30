import NavBar from "@/components/nav-bar";
import { Button } from "@/shared/ui/button";
import { Plus, Settings } from "lucide-react";
import Pagination from "@/components/pagination";
import { useState } from "react";
import {
  useCreateFeatureMutation,
  useGetAllFeaturesQuery,
  useUpdateFeatureMutation,
} from "@/lib/api/feature-api/query";
import type { FeatureCreateDTO, FeatureDTOWithCheck } from "@/types/dto";
import FeatureDialog from "./feature-dialog";
import FeaturesTable from "./features-table";
import CreateFeatureDialog from "./create-feature-dialog";

const FeaturesPage = () => {
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureDTOWithCheck | null>(null);
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [openCreateFeatureDialog, setOpenCreateFeatureDialog] = useState(false);

  const { data: features = [] } = useGetAllFeaturesQuery();

  const { mutateAsync: createFeature } = useCreateFeatureMutation();
  const { mutateAsync: updateFeature } = useUpdateFeatureMutation();

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
  const handleSelectFeature = (feature: FeatureDTOWithCheck) => {
    setSelectedFeature(feature);
    setOpenFeatureDialog(true);
  };

  // Dummy logic for handleDelete
  const handleDelete = (feature: FeatureDTOWithCheck) => {
    console.log(`Deleting feature: ${feature.id}`);
  };

  const handleCreateFeature = async (feature: FeatureCreateDTO) => {
    createFeature(feature);
    setOpenCreateFeatureDialog(false);
  };

  const handleUpdateFeature = async (featureId: number, updatedData: FeatureCreateDTO) => {
    try {
      const updatedFeature = await updateFeature({ id: featureId, data: updatedData });
      // Update the selected feature state with the fresh data from the API
      if (selectedFeature && selectedFeature.id === featureId) {
        setSelectedFeature(updatedFeature);
      }
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error("Failed to update feature:", error);
    }
  };

  return (
    <>
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
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setOpenCreateFeatureDialog(true)}
              >
                <>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Feature
                </>
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">All Features</h2>
          <FeaturesTable
            features={paginatedData}
            onSelectFeature={handleSelectFeature}
            onDeleteFeature={handleDelete}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <FeatureDialog
        open={openFeatureDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenFeatureDialog(false);
            setSelectedFeature(null);
          }
        }}
        feature={selectedFeature}
        onUpdateFeature={handleUpdateFeature}
      />

      <CreateFeatureDialog
        open={openCreateFeatureDialog}
        onOpenChange={setOpenCreateFeatureDialog}
        onSubmit={handleCreateFeature}
      />
    </>
  );
};

export default FeaturesPage;
