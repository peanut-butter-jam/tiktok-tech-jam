import { useMutation, useQuery } from "@tanstack/react-query";
import { createFeature, getAllFeatures, getFeatureById } from "./request";
import { queryClient } from "@/contexts/react-query/react-query-provider";
import type { FeatureDTOWithCheck } from "@/types/dto";
import { toast } from "sonner";

export const useGetAllFeaturesQuery = () => {
  return useQuery({ queryKey: ["features"], queryFn: getAllFeatures });
};

export const useGetFeatureByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["feature", id],
    queryFn: () => getFeatureById(id),
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
