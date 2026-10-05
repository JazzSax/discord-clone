"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}
export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent side="right" sideOffset={40} className="w-auto bg-transparent border-none p-0 shadow-none ring-0 drop-shadow-none mb-16">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Picker data={data} onEmojiSelect={(emoji: any) => onChange(emoji.native)} theme={resolvedTheme as "light" | "dark"} />
      </PopoverContent>
    </Popover>
    
  );
};