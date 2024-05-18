import { prisma } from "@/utils/configs/db"
import { nullIfError } from "@/utils/functions";
import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server"

interface Params {
    params: {category_id: string};
}

export async function GET(request: NextRequest, context: Params) {
    try {
        // console.log(context);
        const { category_id } = context.params;
        const data = await prisma.category.findUnique({ // findMany = get(), findFirst = first() jika di laravel
            // findUnique butuh where 
            where: {
                id: parseInt(category_id) //wajib dikonversi jadi string agar tipe datanya sama
            },
            // atur cache 
            cacheStrategy: {ttl: 60}
        })

        // jika datanya ada 
        if(!data){
            return NextResponse.json({
                message: 'Kategori tidak ada',
                data: null,
            }, {status: 404})
        }

        return NextResponse.json({
            message: 'Berhasil ambil 1 kategori',
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

export async function PUT(request: NextRequest, context: Params) {
    try {
      const { category_id } = context.params;
  
      // TODO: Protect this endpoint (admin only)
      const { name } = (await request.json()) as CategorySchema;
  
      const validatedFields = categorySchema.safeParse({
        name,
      });
  
      if (!validatedFields.success) {
        return NextResponse.json(
          {
            message: "Edit category failed, please check your input again",
            data: null,
            reason: validatedFields.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
  
      const data = await nullIfError(prisma.category.update)({
        where: {
          id: +category_id,
        },
        data: {
          name,
        },
      });
  
      if (!data) {
        return NextResponse.json(
          {
            message: "Edit category failed, data not found",
            reason:
              "The category you're trying to update might not have been created yet",
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "Successfully edited category",
        data,
        reason: null,
      });
    } catch (error) {
      console.error(error);
  
      return NextResponse.json(
        {
          message: "Edit category failed, please try again later",
          data: null,
          reason: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(request: NextRequest, context: Params) {
    try {
      const { category_id } = context.params;
      // TODO: Protect this endpoint (admin only)
  
      const data = await nullIfError(prisma.category.delete)({
        where: {
          id: +category_id,
        },
      });
  
      if (!data) {
        return NextResponse.json(
          {
            message: "Delete category failed, data not found",
            reason:
              "The category you're trying to delete might not have been created yet",
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json({
        message: "Successfully deleted category",
        data,
        reason: null,
      });
    } catch (error) {
      console.error(error);
  
      return NextResponse.json(
        {
          message: "Delete category failed, please try again later",
          data: null,
          reason: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
  