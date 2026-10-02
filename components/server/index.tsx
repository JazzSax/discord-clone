import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { findServerWithChannelsAndMembersById } from "@/lib/server-service";
import { ChannelType } from "@/lib/generated/prisma/client";
import { ServerHeader } from "./ServerHeader";


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
    </div>
  );
};