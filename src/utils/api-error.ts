import axios from "axios";

type ApiErrorResponse = {
  error?: unknown;
  message?: unknown;
};

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = error.response?.data?.error;
    const responseFallback = error.response?.data?.message;

    if (typeof responseMessage === "string") return responseMessage;
    if (typeof responseFallback === "string") return responseFallback;

    return error.message;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  return "An unexpected error occurred.";
}
