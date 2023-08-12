import { NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { userId, isGroup, members, name } = await req.json();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid Data", { status: 400 });
    }
    if (isGroup) {
      const newConversation = await prismadb.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConversation, { status: 201 });
    }
    const existingConversations = await prismadb.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });
    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation, { status: 200 });
    }
    const newConversation = await prismadb.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    return NextResponse.json(newConversation, { status: 201 });
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
