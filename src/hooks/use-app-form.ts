import { useEffect, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DefaultValues, FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface IUseAppFormProps<T extends FieldValues> {
  defaultValues: DefaultValues<T> | undefined;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation >
  schema: z.ZodType<T, any, any>;
}

export const useAppForm = <T extends FieldValues>({
  defaultValues,
  schema,
}: IUseAppFormProps<T>) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: "onChange", // Validate on every change to clear errors immediately
    defaultValues,
  });

  const {
    formState: { errors },
    reset,
    setFocus,
    setValue,
  } = form;

  useEffect(() => {
    for (const error of Object.values(errors)) {
      if (error?.message && typeof error.message === "string")
        toast.error(error.message);
    }
  }, [errors]);

  return { isPending, startTransition, form, reset, setFocus, setValue };
};
