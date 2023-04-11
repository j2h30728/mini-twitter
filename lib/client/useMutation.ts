import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: unknown;
}
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T>(url: string) {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  async function mutation(data: T) {
    setState(prev => ({ ...prev, loading: true }));
  }
}
