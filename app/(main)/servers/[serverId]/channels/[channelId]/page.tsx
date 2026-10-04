import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { findChannelById } from "@/lib/channel-service";
import { findMemberByServerIdAndProfileId } from "@/lib/member-service";
import { ChatHeader } from "@/components/chat";
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
      <h1>Channel Page</h1>
    </div>
  )
}

export default ChannelPage;