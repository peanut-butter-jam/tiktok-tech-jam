import { apiClient } from './client';
import type { components, operations } from '../../types/api';

// Extract types from generated API schema
export type RegulationDTO = components['schemas']['RegulationDTO'];
export type RegulationCreateDTO = components['schemas']['RegulationCreateDTO'];
export type RouDto = components['schemas']['RouDto'];

// File upload response type (from the API operation)
export type FileUploadResponse = operations['upload_regulation_file_regulations_file_post']['responses'][200]['content']['application/json'];

export const regulationApi = {
  // Upload regulation file
  uploadFile: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile<FileUploadResponse>('/regulations/file', formData);
  },

  // Create a new regulation
  createRegulation: async (regulation: RegulationCreateDTO): Promise<RegulationDTO> => {
    return apiClient.post<RegulationDTO>('/regulations/', regulation);
  },

  // Get all regulations
  getAllRegulations: async (): Promise<RegulationDTO[]> => {
    return apiClient.get<RegulationDTO[]>('/regulations/');
  },

  // Get regulation by ID
  getRegulationById: async (regulationId: number): Promise<RegulationDTO> => {
    return apiClient.get<RegulationDTO>(`/regulations/${regulationId}`);
  },
};

export default regulationApi;