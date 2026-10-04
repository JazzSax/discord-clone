import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/";
import { ServerSidebar } from "@/components/server/";

interface MobileToggleProps {
  serverId: string;
}

export const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu/>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="p-0 flex-row gap-0 overflow-hidden bg-transparent text-base data-[side=left]:w-auto data-[side=left]:border-0 data-[side=left]:sm:max-w-none"
      >
        <div className="w-18 shrink-0 h-full">
          <NavigationSidebar/>
        </div>
        <div className="w-60 shrink-0 h-full">
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};