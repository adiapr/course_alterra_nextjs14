import * as z from "zod";

export const categorySchema = z.object({
    name: z.string().min(3,{
        message: "Nama kategori kurang banyak"
    }),
})

export type CategorySchema = z.infer<typeof categorySchema>