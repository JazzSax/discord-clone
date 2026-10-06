"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "cn";
import { ActionTooltip } from "../ActionTooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();
  const isActive = params?.serverId === id;
  const onClick = () => {
    router.push(`/servers/${id}`);
  };
  return (
     <ActionTooltip label={name} side="right" align="center">
      <button className="group relative flex items-center" onClick={onClick}>
        <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all w-1", 
          !isActive && "group-hover:h-5",
          isActive ? "h-9" : "h-2")
          }/>
        <div className={cn("relative group flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          isActive && "bg-primary text-primary rounded-[16px] dark:bg-primary/90"
          )}>
            <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>

      </button>
     </ActionTooltip>
  );
};