import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma/browser";


export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { messageId, conversationId } = req.query;
    const { content } = req.body;
    if(!messageId || !conversationId) {
      return res.status(400).json({ error: "Missing messageId or conversationId" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    
    const member = conversation?.memberOne.profileId === profile.id ? conversation.memberOne : conversation?.memberTwo;
    if(!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: messageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if(!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if(req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: "This message has been deleted.",
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if(req.method === "PATCH") {
      if(!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
          updatedAt: new Date(),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversation?.id}:messages:update`;
    res.socket.server.io.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
    
  } catch (error) {
    console.log("[DIRECT_MESSAGES_MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}