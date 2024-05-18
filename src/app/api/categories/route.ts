import { prisma } from "@/utils/configs/db";
import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await prisma.category.findMany({ // findMany = get(), findFirst = first() jika di laravel
            // atur cache 
            cacheStrategy: {ttl: 60}
        })
        return NextResponse.json({
            message: 'Berhasil ambi kategori',
            data
        })
    } catch (error) {
        return NextResponse.json({
            message: "Gagal, coba lagi ya",
            data: null,
            reason: (error as Error).message,
       }, {status: 500}) 
    }
}

export async function POST(request: NextRequest) {
    // TODO: admin only yooo (role wajib admin)
    try {
        const { name } = (await request.json()) as CategorySchema;

        const validateFields = categorySchema.safeParse({
            name,
        });
    
        if(!validateFields.success){
            return NextResponse.json({
                message: "Gagal karena tipe data salah",
                data: null,
                reason: validateFields.error.flatten().fieldErrors,
            },
            {status: 400})  
        }
    
        // console.log(name);
        // TODO : Create new record from database
        const data = await prisma.category.create({
            data: {
                name, //diambil dari const name diatas
            },
        });

        return NextResponse.json({
            message: "Berhasil mengambil data kategori",
            data,
            reason: null
        }, {status: 201}) 
    } catch (error) {
       console.error(error)
       return NextResponse.json({
            message: "Gagal, coba lagi ya",
            data: null,
            reason: (error as Error).message,
       }, {status: 500}) 
    }
    
}