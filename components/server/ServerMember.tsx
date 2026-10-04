"use client";

import { Member, Profile, Server, MemberRole } from "@/lib/generated/prisma/browser";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";
interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server 
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-4 h-4 text-indigo-500 ml-2" />,
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 text-rose-500 ml-2" />,
}
export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const icon = roleIconMap[member.role];
  const params = useParams();
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push(`/servers/${params.serverId}/conversations/${member.id}`)} 
      className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        member.id === params.memberId && "bg-zinc-700/10 dark:bg-zinc-700/50"
      )}
    >
      <UserAvatar src={member.profile.imageUrl ?? ""} className="h-8 w-8 md:h-8 md:w-8" />
      {icon}
      <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
        member.id === params?.memberId && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>
        {member.profile.name}
      </p>
    </button>
  )
}