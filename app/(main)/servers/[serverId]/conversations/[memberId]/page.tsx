import { currentProfile } from "@/lib/current-profile";
import { getOrCreateConversation } from "@/lib/conversation";
import { auth } from "@clerk/nextjs/server";
import { findMemberProfile } from "@/lib/member-service";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";

interface ConversationPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const profile = await currentProfile();
  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }


  const { memberId, serverId } = await params;
  const currentMember = await findMemberProfile(serverId, profile.id);
  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId);
  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        imageUrl={otherMember.profile.imageUrl || undefined} 
        name={otherMember.profile.name} 
        serverId={serverId}
        type="conversation"
      />
      <ChatMessages 
        name={otherMember.profile.name}
        member={currentMember}
        apiUrl={"/api/direct-messages"}
        chatId={conversation.id}
        socketUrl={"/api/socket/direct-messages"}
        socketQuery={{
          conversationId: conversation.id,
        }}
        paramKey="conversationId"
        paramValue={conversation.id}
        type="conversation"
      />
      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl={"/api/socket/direct-messages"}
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  )
}