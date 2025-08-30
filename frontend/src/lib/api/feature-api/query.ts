import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFeature,
  deleteFeatureById,
  getAllFeatures,
  getFeatureById,
  importFeaturesFromCsv,
  triggerFeatureCheckById,
} from "./request";
import { queryClient } from "@/contexts/react-query/react-query-provider";
import type { FeatureDTOWithCheck } from "@/types/dto";
import { toast } from "sonner";

export const useGetAllFeaturesQuery = () => {
  return useQuery({ queryKey: ["features"], queryFn: getAllFeatures });
};

export const useGetFeatureByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["features", id],
    queryFn: () => getFeatureById(id),
    refetchInterval: 60000,
  });
};

export const useCreateFeatureMutation = () => {
  return useMutation({
    mutationFn: createFeature,
    onSuccess: (data: FeatureDTOWithCheck) => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success(`Feature "${data.title}" uploaded successfully!`);
    },
    onError: (error) => {
      toast.error(`Error uploading feature: ${error.message}`);
    },
  });
};

export const useImportFeaturesFromCsvMutation = () => {
  return useMutation({
    mutationFn: importFeaturesFromCsv,
    onSuccess: (data: FeatureDTOWithCheck[]) => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success(`Features imported successfully!`);
    },
    onError: (error) => {
      toast.error(`Error importing features: ${error.message}`);
    },
  });
};

export const useDeleteFeatureByIdMutation = () => {
  return useMutation({
    mutationFn: deleteFeatureById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success(`Feature deleted successfully!`);
    },
    onError: (error) => {
      toast.error(`Error deleting feature: ${error.message}`);
    },
  });
};

export const useTriggerFeatureCheckMutation = () => {
  return useMutation({
    mutationFn: triggerFeatureCheckById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success(`Feature check triggered successfully!`);
    },
    onError: (error) => {
      toast.error(`Error triggering feature check: ${error.message}`);
    },
  });
};
