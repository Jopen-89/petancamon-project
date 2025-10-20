import { z } from 'zod'

export const updateorCreateMatchValidation = z.object({
    level: z.enum(["top", "middle", "low"]),
    location: z.string().trim().min(1, "Location is required"),
    date: z.coerce.date(), //obligar a que venga como date de JS
    maxPlayers: z.number().int().min(2),
    players: z.array(z.string()).optional().default([]),
    comment: z.array(z.string()).optional().default([])
    //optional (campo no obligatorio), zod no lanzaria error si no esta.
    //default se pone valor por defecto en este caso array vacio

})