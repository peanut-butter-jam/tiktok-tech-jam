import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFeature,
  deleteFeatureById,
  getAllFeatures,
  getFeatureById,
  updateFeature,
  importFeaturesFromCsv,
  triggerFeatureCheckById,
} from "./request";
import { queryClient } from "@/contexts/react-query/react-query-provider";
import type { FeatureCreateDTO, FeatureDTOWithCheck } from "@/types/dto";
import { toast } from "sonner";

export const useGetAllFeaturesQuery = () => {
  return useQuery({ queryKey: ["features"], queryFn: getAllFeatures });
};

export const useGetFeatureByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["feature", id],
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

export const useUpdateFeatureMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FeatureCreateDTO }) =>
      updateFeature(id, data),
    onSuccess: (data: FeatureDTOWithCheck, variables) => {
      // Invalidate both the features list and the specific feature
      queryClient.invalidateQueries({ queryKey: ["features"] });
      queryClient.invalidateQueries({ queryKey: ["feature", variables.id] });
      toast.success(`Feature "${data.title}" updated successfully!`);
    },
    onError: (error) => {
      toast.error(`Error updating feature: ${error.message}`);
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
