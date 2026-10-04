import { currentProfile } from "@/lib/current-profile";
import { NavigationAction } from "./NavigationAction";
import { findServersByProfileId } from "@/lib/server-service";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./NavigationItem";
import { ModeToggle } from "@/components/ModeToggle";
import { UserButton } from "@clerk/nextjs";
export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const servers = await findServersByProfileId(profile.id);
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction/>
      <Separator className="data-horizontal:h-[2px] data-horizontal:w-10 bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {
          servers.map((server) => (
            <div key={server.id} className="mb-4">
              <NavigationItem id={server.id} imageUrl={server.imageUrl || ""} name={server.name || ""} />
            </div>
          ))
        }
      </ScrollArea>
      <div className="flex flex-col items-center gap-y-4 pb-3 mt-auto">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
};