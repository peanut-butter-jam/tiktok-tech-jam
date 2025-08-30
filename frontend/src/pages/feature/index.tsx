import NavBar from "@/components/nav-bar";
import { Button } from "@/shared/ui/button";
import { Download, Plus, RefreshCcw, Settings } from "lucide-react";
import Pagination from "@/components/pagination";
import { useEffect, useState } from "react";
import {
  useCreateFeatureMutation,
  useDeleteFeatureByIdMutation,
  useGetAllFeaturesQuery,
  useImportFeaturesFromCsvMutation,
  useTriggerFeatureCheckMutation,
  useUpdateFeatureMutation,
} from "@/lib/api/feature-api/query";
import type {
  FeatureCreateDTO,
  FeatureUpdateDTO,
  FeatureDTOWithCheck,
} from "@/types/dto";
import FeatureDialog from "./feature-dialog";
import FeaturesTable from "./features-table";
import CreateFeatureDialog from "./create-feature-dialog";

const FeaturesPage = () => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(
    null
  );
  const [openFeatureDialog, setOpenFeatureDialog] = useState(false);
  const [openCreateFeatureDialog, setOpenCreateFeatureDialog] = useState(false);

  const {
    data: features = [],
    isLoading,
    isFetching,
    refetch: refetchFeatures,
  } = useGetAllFeaturesQuery();

  const selectedFeature =
    features.find((feature) => feature.id === selectedFeatureId) || null;

  const { mutateAsync: createFeature } = useCreateFeatureMutation();
  const { mutateAsync: updateFeature } = useUpdateFeatureMutation();
  const { mutateAsync: deleteFeatureById } = useDeleteFeatureByIdMutation();
  const { mutateAsync: triggerFeatureCheck } = useTriggerFeatureCheckMutation();
  const { mutateAsync: importFeaturesFromCsv } =
    useImportFeaturesFromCsvMutation();

  const shouldPoll = features.some(
    (feature) =>
      !feature.latest_check || feature.latest_check.status === "pending"
  );

  useEffect(() => {
    if (shouldPoll) {
      const interval = setInterval(() => {
        refetchFeatures();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [shouldPoll, refetchFeatures]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate paginated data
  const totalPages = Math.ceil(features.length / rowsPerPage);
  const paginatedData = features.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDownloadJSON = () => {
    if (!features) return;
    const blob = new Blob(
      [
        JSON.stringify(
          features.map((feature) => {
            return {
              title: feature.title,
              description: feature.description,
              ...(feature.latest_check?.eval_result
                ? {
                    flag: feature.latest_check.eval_result.flag,
                    reasoning: feature.latest_check.eval_result.reasoning,
                    recommended_actions:
                      feature.latest_check.eval_result.recommended_actions,
                  }
                : {}),
            };
          }),
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Updated handleView function
  const handleSelectFeature = (feature: FeatureDTOWithCheck) => {
    setSelectedFeatureId(feature.id);
    setOpenFeatureDialog(true);
  };

  const handleDelete = (feature: FeatureDTOWithCheck) => {
    deleteFeatureById(feature.id);
  };

  const handleTriggerFeatureCheck = (feature: FeatureDTOWithCheck) => {
    triggerFeatureCheck(feature.id);
  };

  const handleCreateFeature = async (feature: FeatureCreateDTO) => {
    createFeature(feature);
    setOpenCreateFeatureDialog(false);
  };

  const handleBulkUpload = async (file: File) => {
    try {
      console.log(file);
      await importFeaturesFromCsv(file);
      setOpenCreateFeatureDialog(false);
    } catch (error) {
      console.error("Failed to import features:", error);
    }
  };

  const handleUpdateFeature = async (
    featureId: number,
    updatedData: FeatureUpdateDTO
  ) => {
    await updateFeature({
      id: featureId,
      data: updatedData,
    });
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white py-12">
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
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold">All Features</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchFeatures()}
            >
              <RefreshCcw
                className={`w-4 h-4 mr-2 ${
                  isFetching || isLoading ? "animate-spin" : ""
                }`}
              />
              Reload
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadJSON}
              title="Download JSON"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>

          <FeaturesTable
            features={paginatedData}
            onSelectFeature={handleSelectFeature}
            onDeleteFeature={handleDelete}
            onTriggerFeatureCheck={handleTriggerFeatureCheck}
            isLoading={isLoading}
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
            setSelectedFeatureId(null);
          }
        }}
        feature={selectedFeature}
        onUpdateFeature={handleUpdateFeature}
        onTriggerFeatureCheck={handleTriggerFeatureCheck}
      />

      <CreateFeatureDialog
        open={openCreateFeatureDialog}
        onOpenChange={setOpenCreateFeatureDialog}
        onSubmit={handleCreateFeature}
        onBulkSubmit={handleBulkUpload}
      />
    </>
  );
};

export default FeaturesPage;
