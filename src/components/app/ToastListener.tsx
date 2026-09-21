"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

function ToastInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [toastState, setToastState] = useState<{ message: string; isError: boolean } | null>(null);

  const toast = searchParams.get("toast");
  const toastError = searchParams.get("toastError");

  useEffect(() => {
    if (!toast && !toastError) return;
    // Freezing the message in local state (decoupled from the URL, which we
    // strip right below) is the point here, not a derivable render value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToastState(toast ? { message: toast, isError: false } : { message: toastError!, isError: true });

    const clean = new URLSearchParams(searchParams);
    clean.delete("toast");
    clean.delete("toastError");
    const cleanUrl = clean.size > 0 ? `${pathname}?${clean.toString()}` : pathname;
    router.replace(cleanUrl, { scroll: false });

    const timer = setTimeout(() => setToastState(null), 4500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, toastError]);

  if (!toastState) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold text-white shadow-lg ${
          toastState.isError ? "bg-negative" : "bg-accent-800"
        }`}
      >
        {toastState.isError ? (
          <AlertCircle size={18} strokeWidth={2.75} className="shrink-0" />
        ) : (
          <CheckCircle2 size={18} strokeWidth={2.75} className="shrink-0" />
        )}
        {toastState.message}
        <button
          type="button"
          onClick={() => setToastState(null)}
          aria-label="Fechar"
          className="ml-1 shrink-0 opacity-80 hover:opacity-100"
        >
          <X size={16} strokeWidth={2.75} />
        </button>
      </div>
    </div>
  );
}

export function ToastListener() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  );
}
