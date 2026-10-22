"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  message: string;
};

export default function ErrorToast({ message }: Props) {
  useEffect(() => {
    toast.error(`Failed to fetch meeting stats. ${message}`, {
      position: "bottom-center",
      richColors: true,
    });
  }, [message]);

  return null;
}
