import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional()
    .nullable(),
  price: z
    .string()
    .min(1, "El precio es requerido")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "El precio debe ser un número mayor a 0",
    ),
  stock: z
    .string()
    .min(1, "El stock es requerido")
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
      "El stock debe ser un número mayor o igual a 0",
    ),
  sizes: z.array(z.string()).optional().default([]),
  categoryId: z.string().optional().nullable(),
  gender: z.string().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
