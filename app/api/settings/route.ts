import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image, imageId } = await req.json();
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const updatedUser = await prismadb.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
        imageId,
      },
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.log("ERROR_SETTINGS", error);
    return new NextResponse("INTERNAL_ERROR", { status: 500 });
  }
}
