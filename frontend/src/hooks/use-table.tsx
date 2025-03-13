"use client";

import { useAuthStore } from "@/state/AuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface UseTableServiceProps {
  fetchService: (email: string, token: number) => Promise<any>;
  deleteService?: (id: string, token: number) => Promise<any>;
  uploadService?: (formData: FormData, token: string) => Promise<any>; // Optional
  queryKey: string;
}

export const useTableService = ({
  fetchService,
  deleteService,
  uploadService,
  queryKey,
}: UseTableServiceProps) => {
  const queryClient = useQueryClient();

  const { userInfo }:any = useAuthStore();
  const toastMessages = useTranslations("messages.file")
  // Fetch Documents
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // const result = await fetchService(userInfo.user?.email, userInfo.user?.access_token);
      const result = await fetchService(userInfo.email, userInfo.accessToken);
      return result.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!deleteService) return;
      await deleteService(id, userInfo.user?.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(toastMessages("deleteSuccess"));
    },
    onError: () => {
      toast.error(toastMessages("deleteError"));
    },
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!uploadService) return;
      await uploadService(formData, userInfo.user?.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(toastMessages("uploadSuccess"));
    },
    onError: () => {
      toast.error(toastMessages("uploadError"));
    },
  });

  return {
    data,
    isLoading,
    deleteMutation,
    uploadMutation,
  };
};
