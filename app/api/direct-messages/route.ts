import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DirectMessage } from "@/lib/generated/prisma/browser";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;
export async function GET(
  req: Request,
  { params }: { params: Promise<{ channelId: string }> }
) {
  try {
    const profile = await currentUser();
    if (!profile) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
 
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new Response("Conversation ID is required", { status: 400 });
    }
    
    let messages: DirectMessage[] = [];
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { conversationId: conversationId || "" },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: { conversationId: conversationId || "" },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      })
    }
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }
    return NextResponse.json({ items: messages, nextCursor });
  } catch (error) {
    console.error("[DIRECT_MESSAGES_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}