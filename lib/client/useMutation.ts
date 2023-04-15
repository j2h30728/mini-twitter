import { useState } from "react";
import { method } from "../server/withHandler";
export interface MutationResult {
  success: boolean;
  message: string;
  [key: string]: any;
}

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: unknown;
}
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];
interface MutationRequest {
  data: any;
  method: method;
  configHeader?: { [key: string]: string };
}
export default function useMutation<T>(url: string): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  async function mutation({
    data = null,
    method,
    configHeader,
  }: MutationRequest) {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...configHeader,
    });
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(
        url,
        method !== "DELETE"
          ? {
              method: method,
              body: JSON.stringify(data),
              headers: headers, // 헤더 정보 전달
            }
          : {
              method: "DELETE",
              headers: headers, // 헤더 정보 전달
            }
      );
      const resData =
        method !== "DELETE"
          ? await response.json()
          : { succes: true, message: "삭제" };
      setState(prev => ({ ...prev, data: resData, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error, loading: false }));
      console.error(error);
    }
  }

  return [mutation, { ...state }];
}
