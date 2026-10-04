import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { findServerWithChannelsAndMembersById } from "@/lib/server-service";
import { ChannelType, MemberRole } from "@/lib/generated/prisma/client";
import { ServerHeader } from "./ServerHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./ServerSearch";
import { ServerSection } from "./ServerSection";
import { Hash, Mic, Video, ShieldCheck, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServerChannel } from "./ServerChannel";
import { ServerMember } from "./ServerMember";
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
        <Separator className="bg-zinc-200 dark:bg-zinc-700 my-2"/>
        {
          !!textChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Text Channels" role={role} sectionType="channels" channelType={ChannelType.TEXT} />
              <div className="space-y-[2px]">
                {
                  textChannels.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                  ))
                }
              </div>
             
            </div>
          )
        }
        {
          !!audioChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Voice Channels" role={role} sectionType="channels" channelType={ChannelType.AUDIO} />
              {
                <div className="space-y-[2px]">
                  {
                    audioChannels.map((channel) => (
                      <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                    ))
                  }
                </div>
              }
            </div>
          )
        }
        {
          !!videoChannels?.length && (
            <div className="mb-2">
              <ServerSection label="Video Channels" role={role} sectionType="channels" channelType={ChannelType.VIDEO} />
              <div className="space-y-[2px]">
                {
                  videoChannels.map((channel) => (
                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          !!members?.length && (
            <div className="mb-2">
              <ServerSection label="Members" role={role} sectionType="members" server={server} />
              <div className="space-y-[2px]">
                {
                  members.map((member) => (
                    <ServerMember key={member.id} member={member} server={server} />
                  ))
                }
              </div>
            </div>
          )
        }
      </ScrollArea>
    </div>
  );
};