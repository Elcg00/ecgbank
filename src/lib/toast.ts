import "server-only";
import { redirect } from "next/navigation";

/** Redirects to `path` carrying a one-shot success message for ToastListener. */
export function redirectWithToast(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}toast=${encodeURIComponent(message)}`);
}

/** Redirects to `path` carrying a one-shot error message for ToastListener. */
export function redirectWithError(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}toastError=${encodeURIComponent(message)}`);
}
