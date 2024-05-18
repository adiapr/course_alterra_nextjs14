import { NextRequest, NextResponse } from "next/server";

import { productSchema } from "@/utils/types/products";

export async function GET(request: NextRequest) {
  // TODO: Create reusable function to handle query params
  const searchParams = request.nextUrl.searchParams;

  console.log(searchParams.get("page"));
  return NextResponse.json({ message: "Success Get", data: [] });
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Protect this endpoint (admin only)

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;
    const category_id = formData.get("category_id") as string;

    const validatedFields = productSchema.safeParse({
      name,
      description,
      price,
      image: image ?? undefined,
      category_id,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Add product failed, please check your input again",
          data: null,
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      // TODO: Upload image to cloudinary
    }

    // TODO: Create new record on database

    return NextResponse.json(
      {
        message: "Successfully added product to database",
        data: [],
        reason: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Add product failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
