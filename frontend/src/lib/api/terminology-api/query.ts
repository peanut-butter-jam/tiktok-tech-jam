import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTerminology,
  getAllTerminologies,
  getTerminologyById,
  importTerminologiesFromCsv,
  deleteTerminologyById,
} from "./request";
import { queryClient } from "@/contexts/react-query/react-query-provider";
import type { TerminologyDTO } from "@/types/dto";
import { toast } from "sonner";

export const useGetAllTerminologiesQuery = () => {
  return useQuery({ queryKey: ["terminologies"], queryFn: getAllTerminologies });
};

export const useGetTerminologyByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["terminology", id],
    queryFn: () => getTerminologyById(id),
    refetchInterval: 60000,
  });
};

export const useCreateTerminologyMutation = () => {
  return useMutation({
    mutationFn: createTerminology,
    onSuccess: (data: TerminologyDTO) => {
      queryClient.invalidateQueries({ queryKey: ["terminologies"] });
      toast.success(`Terminology "${data.key}" created successfully!`);
    },
    onError: (error) => {
      toast.error(`Error creating terminology: ${error.message}`);
    },
  });
};

export const useImportTerminologiesFromCsvMutation = () => {
  return useMutation({
    mutationFn: importTerminologiesFromCsv,
    onSuccess: (data: TerminologyDTO[]) => {
      queryClient.invalidateQueries({ queryKey: ["terminologies"] });
      toast.success(`${data.length} terminologies imported successfully!`);
    },
    onError: (error) => {
      toast.error(`Error importing terminologies: ${error.message}`);
    },
  });
};

export const useDeleteTerminologyByIdMutation = () => {
  return useMutation({
    mutationFn: deleteTerminologyById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terminologies"] });
      toast.success(`Terminology deleted successfully!`);
    },
    onError: (error) => {
      toast.error(`Error deleting terminology: ${error.message}`);
    },
  });
};