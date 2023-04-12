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
}
export default function useMutation<T>(url: string): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  async function mutation({ data = null, method }: MutationRequest) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: headers, // 헤더 정보 전달
      });
      const resData = await response.json();
      setState(prev => ({ ...prev, data: resData, loading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, error, loading: false }));
      console.error(error);
    }
  }

  return [mutation, { ...state }];
}
