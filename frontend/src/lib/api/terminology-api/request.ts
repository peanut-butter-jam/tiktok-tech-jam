import {
  type TerminologyCreateDTO,
  type TerminologyDTO,
} from "@/types/dto";
import apiClient from "../client";

const terminologyBaseUrl = "/terminologies";

export const getAllTerminologies = async () => {
  return await apiClient.get<TerminologyDTO[]>(terminologyBaseUrl);
};

export const getTerminologyById = async (id: number) => {
  return await apiClient.get<TerminologyDTO>(`${terminologyBaseUrl}/${id}`);
};

export const createTerminology = async (data: TerminologyCreateDTO) => {
  return await apiClient.post<TerminologyDTO>(terminologyBaseUrl, data);
};

export const importTerminologiesFromCsv = async (file: File) => {
  const formData = new FormData();
  console.log("File added to formdata: ", file);
  formData.append("csv_file", file);
  return await apiClient.uploadFile<TerminologyDTO[]>(
    `${terminologyBaseUrl}/csv`,
    formData
  );
};

export const deleteTerminologyById = async (id: number) => {
  return await apiClient.delete<void>(`${terminologyBaseUrl}/${id}`);
};