"use client";

import { Button } from "@base-ui/react/button";
import { PlusIcon } from "lucide-react";
import { ActionTooltip } from "../ActionTooltip";
export const NavigationAction = () => {
  return (
    <div>
      <ActionTooltip label="Add a server" side="right" align="center">

      <button className="group">
        <div className="flex mx-3 h-12 w-12 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-500">
          <PlusIcon className="w-5 h-5 transition text-emerald-500 group-hover:text-white dark:group-hover:text-white" />
        </div>
       
      </button>
      </ActionTooltip>
    </div>
  );
};