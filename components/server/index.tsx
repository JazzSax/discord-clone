import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { findServerWithChannelsAndMembersById } from "@/lib/server-service";
import { ChannelType, MemberRole } from "@/lib/generated/prisma/client";
import { ServerHeader } from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./ServerSearch";
import { Hash, Mic, Video, ShieldCheck, ShieldAlert } from "lucide-react";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />,
  [MemberRole.GUEST]: null,
}
export const ServerSidebar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if ( !profile ) {
    return redirect('/');
  }
  const server = await findServerWithChannelsAndMembersById(serverId);

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter((member) => member.profileId !== profile.id);

  if ( !server ) {
    return redirect('/');
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                icon: iconMap[channel.type],
                name: channel.name,
                id: channel.id,
              }))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel) => ({
                icon: iconMap[channel.type],
                name: channel.name,
                id: channel.id,
              }))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                icon: iconMap[channel.type],
                name: channel.name,
                id: channel.id,
              }))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                icon: roleIconMap[member.role],
                name: member.profile.name,
                id: member.profileId,
              }))
            }
          ]} />

        </div>
      </ScrollArea>
    </div>
  );
};