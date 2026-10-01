"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import type { ReactElement } from "react";

interface ActionTooltipProps {
  label: string;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const ActionTooltip = ({
  label,
  children,
  side = "top",
  align = "center",
}: ActionTooltipProps) => {
  return (
    <Tooltip.Provider delay={50}>
      <Tooltip.Root>
        <Tooltip.Trigger render={children} />
        <Tooltip.Portal>
          <Tooltip.Positioner side={side} align={align} sideOffset={8}>
            <Tooltip.Popup className="z-50 rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white capitalize">
              {label.toLowerCase()}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
