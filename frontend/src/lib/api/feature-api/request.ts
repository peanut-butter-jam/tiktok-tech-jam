import {
  type CheckDTO,
  type FeatureCreateDTO,
  type FeatureUpdateDTO,
  type FeatureDTOWithCheck,
} from "@/types/dto";
import apiClient from "../client";

const featureBaseUrl = "/features";

export const getAllFeatures = async () => {
  return await apiClient.get<FeatureDTOWithCheck[]>(featureBaseUrl);
};

export const getFeatureById = async (id: number) => {
  return await apiClient.get<FeatureDTOWithCheck>(`${featureBaseUrl}/${id}`);
};

export const createFeature = async (data: FeatureCreateDTO) => {
  return await apiClient.post<FeatureDTOWithCheck>(featureBaseUrl, data);
};

export const updateFeature = async (id: number, data: FeatureUpdateDTO) => {
  return await apiClient.put<FeatureDTOWithCheck>(
    `${featureBaseUrl}/${id}`,
    data
  );
};

export const importFeaturesFromCsv = async (file: File) => {
  const formData = new FormData();
  console.log("File added to formdata: ", file);
  formData.append("csv_file", file);
  return await apiClient.uploadFile<FeatureDTOWithCheck[]>(
    `${featureBaseUrl}/csv`,
    formData
  );
};

export const deleteFeatureById = async (id: number) => {
  return await apiClient.delete<void>(`${featureBaseUrl}/${id}`);
};

export const triggerFeatureCheckById = async (featureId: number) => {
  return await apiClient.post<CheckDTO>(
    `${featureBaseUrl}/${featureId}/checks`
  );
};

export const reconcileFeatureCheck = async (
  featureId: number,
  data: { flag: "yes" | "no" | "unknown"; reasoning: string }
) => {
  return await apiClient.put<CheckDTO>(
    `${featureBaseUrl}/${featureId}/checks`,
    data
  );
};
