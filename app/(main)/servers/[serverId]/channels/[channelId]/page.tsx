import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findChannelById } from "@/lib/channel-service";
import { findMemberByServerIdAndProfileId } from "@/lib/member-service";
import { ChatHeader } from "@/components/chat";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChannelType } from "@/lib/generated/prisma/browser";
import { MediaRoom } from "@/components/MediaRoom";
interface ChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelPage = async({ params }: ChannelPageProps) => {
  const { serverId, channelId } = await params;
  const profile = await currentProfile();
  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  
  const channel = await findChannelById(channelId);
  const member = await findMemberByServerIdAndProfileId(serverId, profile.id);
  if(!channel || !member) {
    return redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />
      {
        channel.type === ChannelType.TEXT && (
          <>
           <ChatMessages name={channel.name} member={member} apiUrl="/api/messages" chatId={channel.id} socketUrl="/api/socket/messages" socketQuery={{ channelId, serverId }} paramKey="channelId" paramValue={channel.id} type="channel" />
           <ChatInput apiUrl={`/api/socket/messages`} query={{ channelId, serverId }} name={channel.name} type="channel" />
          </>
        )
      }
      {
        channel.type === ChannelType.AUDIO && (
          <MediaRoom chatId={channel.id} video={false} audio={true} />
        )
      }
      {
        channel.type === ChannelType.VIDEO && (
          <MediaRoom chatId={channel.id} video={true} audio={false} />
        )
      }
    </div>
  )
}

export default ChannelPage;