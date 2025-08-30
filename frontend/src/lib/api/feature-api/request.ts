import type { FeatureCreateDTO, FeatureDTOWithCheck } from "@/types/dto";
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

export const updateFeature = async (id: number, data: FeatureCreateDTO) => {
    return await apiClient.put<FeatureDTOWithCheck>(
        `${featureBaseUrl}/${id}`,
        data
    );
};
