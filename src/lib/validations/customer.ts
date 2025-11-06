import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z.string().email("El email no es válido").optional().nullable(),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "El número de teléfono no es válido",
    )
    .optional()
    .nullable(),
  address: z
    .string()
    .max(200, "La dirección no puede exceder 200 caracteres")
    .optional()
    .nullable(),
  clientTypeId: z.string().optional().nullable(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
