import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { regulationApi } from "../lib/api/regulation";
import type {
  RegulationDTO,
  RegulationCreateDTO,
  FileUploadResponse,
} from "../lib/api/regulation";
import type { ApiError } from "../lib/api/client";
import { queryClient } from "@/contexts/react-query/react-query-provider";
import { toast } from "sonner";

// Query keys for React Query
export const regulationKeys = {
  all: ["regulations"] as const,
  lists: () => [...regulationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...regulationKeys.lists(), { filters }] as const,
  details: () => [...regulationKeys.all, "detail"] as const,
  detail: (id: number) => [...regulationKeys.details(), id] as const,
};

// Hook to get all regulations
export const useRegulations = (
  options?: UseQueryOptions<RegulationDTO[], ApiError>
) => {
  return useQuery({
    queryKey: regulationKeys.lists(),
    queryFn: regulationApi.getAllRegulations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook to get a single regulation by ID with polling for processing updates
export const useRegulation = (
  regulationId: number,
  options?: UseQueryOptions<RegulationDTO, ApiError>
) => {
  const result = useQuery({
    queryKey: regulationKeys.detail(regulationId),
    queryFn: () => regulationApi.getRegulationById(regulationId),
    enabled: !!regulationId,
    staleTime: 0, // Always consider data stale for polling
    refetchInterval: (data) => {
      // Poll every 3 seconds if regulation exists but ROUs are null (still processing)
      return data && data.rous === null ? 3000 : false;
    },
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
    ...options,
  });

  // Return additional processing state info
  return {
    ...result,
    isProcessing: result.data?.rous === null,
  };
};

// Hook to upload a regulation file
export const useUploadRegulationFile = () => {
  return useMutation<FileUploadResponse, ApiError, File>({
    mutationFn: regulationApi.uploadFile,
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });
};

export const useDeleteRegulationByIdMutation = () => {
  return useMutation({
    mutationFn: regulationApi.deleteRegulationById,
    onSuccess: () => {
      // Invalidate and refetch regulations list
      queryClient.invalidateQueries({ queryKey: regulationKeys.lists() });
      toast.success("Regulation deleted successfully.");
    },
    onError: (error) => {
      toast.error("Failed to delete regulation. Please try again.");
    },
  });
};

// Hook to create a new regulation
export const useCreateRegulation = () => {
  return useMutation<RegulationDTO, ApiError, RegulationCreateDTO>({
    mutationFn: regulationApi.createRegulation,
    onSuccess: (newRegulation) => {
      // Invalidate and refetch regulations list
      queryClient.invalidateQueries({ queryKey: regulationKeys.lists() });

      // Optionally add the new regulation to the cache
      queryClient.setQueryData(
        regulationKeys.detail(newRegulation.id),
        newRegulation
      );
    },
    onError: (error) => {
      console.error("Regulation creation failed:", error);
    },
  });
};

// Combined hook for the complete regulation upload flow
export const useRegulationUploadFlow = () => {
  const uploadFile = useUploadRegulationFile();
  const createRegulation = useCreateRegulation();

  const uploadRegulationWithFile = async (file: File, title: string) => {
    // First upload the file
    const fileUploadResult = await uploadFile.mutateAsync(file);

    console.log(fileUploadResult);

    // Type assertion since the generated API type is 'unknown'
    const uploadResponse = fileUploadResult as { id: string };

    console.log(uploadResponse);
    // Then create the regulation with the file ID
    const regulationData: RegulationCreateDTO = {
      title,
      file_object_id: uploadResponse.id,
    };

    const regulation = await createRegulation.mutateAsync(regulationData);

    // Immediately refetch the regulations list to show the new regulation
    queryClient.invalidateQueries({ queryKey: regulationKeys.lists() });

    return regulation;
  };

  return {
    uploadRegulationWithFile,
    isUploading: uploadFile.isPending,
    isCreating: createRegulation.isPending,
    isLoading: uploadFile.isPending || createRegulation.isPending,
    error: uploadFile.error || createRegulation.error,
    reset: () => {
      uploadFile.reset();
      createRegulation.reset();
    },
  };
};
