import z from "zod";

export const createDivisionSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    thumbnail: z.string().optional(),
    description: z.string().optional(),

})