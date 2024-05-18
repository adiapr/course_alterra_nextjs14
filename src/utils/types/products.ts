import * as z from "zod";

const MAX_MB = 2
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
]

export const productSchema = z.object({
    name: z.string().min(10,{
        message: "Nama product minimal 10 karakter",
    })
    .max(50, {
        message: "Nama product tidak boleh lebih dari 50  karakter",
    }),

    description: z.string().min(10, {
        message: "Minimal deskripisi adalah 10 karakter"
    }),

    price: z.string({
        message: 'Harga wajib diisi'
    }),

    image: z.instanceof(File).optional().refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, `Maksimal ukuiran pgambar adalah ${MAX_MB}`),

    category_id: z.string({
        message: 'Category is required',
    })
})

export type ProductSchema = z.infer<typeof productSchema>