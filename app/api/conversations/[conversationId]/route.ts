import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

type IParams = {
  conversationId?: string;
};

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const existingConversation = await prismadb.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });
    const allMessages = await prismadb.message.findMany({
      where: {
        conversationId,
        imageId: {
          isSet: true,
        }
      },
    })
    if (!existingConversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }
    const deletedConversation = await prismadb.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });
    return NextResponse.json(allMessages);
  } catch (error: any) {
    console.log("ERROR_CONVERSATION_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
