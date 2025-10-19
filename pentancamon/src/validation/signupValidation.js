import { z } from 'zod'

export const signupValidationSchema = z.object({
    username: z.string()
        .min(3, "minimo 3 caracteres")
        .max(20, "Maximo de 20 caracteres"),
    email: z.string(),
    password: z.string()
        .min(6, "minimo 6 caracteres")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un numero"),
    level: z.enum(["low", "middle", "top"]).optional().default("low"),
})  