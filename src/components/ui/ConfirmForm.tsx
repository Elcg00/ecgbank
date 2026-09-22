"use client";

import { useRef, useState, type ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmForm({
  action,
  confirmMessage,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  className?: string;
  children: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const bypassRef = useRef(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <form
        ref={formRef}
        action={action}
        className={className}
        onSubmit={(e) => {
          if (bypassRef.current) {
            bypassRef.current = false;
            return;
          }
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </form>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar">
        <p className="text-[15px] text-ink">{confirmMessage}</p>
        <div className="mt-5 flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={() => {
              setOpen(false);
              bypassRef.current = true;
              formRef.current?.requestSubmit();
            }}
          >
            Confirmar
          </Button>
        </div>
      </Modal>
    </>
  );
}
