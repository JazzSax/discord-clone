"use client";
import { Member, Profile, MemberRole } from "@/lib/generated/prisma/browser";
import { UserAvatar } from "@/components/UserAvatar";
import { ActionTooltip } from "@/components/ActionTooltip";
import { ShieldCheck, ShieldAlert, FileIcon, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import { useRouter, useParams } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & { profile: Profile };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />,
  "MODERATOR": <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  "GUEST": null
}

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Message cannot be empty.",
  }),
});

export const ChatItem = ({ id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();

  const onMemberClick = () => {
    if(member.id === currentMember.id) return;
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
   try{
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });
    await axios.patch(url, {
      content: values.content,
    });
    form.reset();
    setIsEditing(false);
   } catch (error) {
    console.log(error);
   }
  };

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isModerator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = !!fileUrl && fileUrl.split("?")[0].toLowerCase().endsWith(".pdf");
  const isImage = !!fileUrl && !isPdf;
  const roleIcon = roleIconMap[member.role];
  
  return (
    <div className="relative group flex w-full gap-x-3 p-4 hover:bg-black/5 transition">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl || ""} className="h-12 w-12" />

        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-xs hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              {roleIcon && (
                <ActionTooltip label={member.role}>
                  {roleIcon}
                </ActionTooltip>
              )}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {
            isImage && (
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative aspect-square h-48 w-48 mt-2 bg-secondary rounded-md overflow-hidden border flex items-center justify-center"
              >
                <Image src={fileUrl} alt="Image" fill className="object-cover" />
              </a>
            )
          }
          {
            isPdf && (
              <div className="relative flex items-center w-full min-w-0 max-w-full gap-2 p-2 pr-8 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 shrink-0" />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 text-left text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all">
                  PDF File
                </a>
              </div>
            )
          }
          {
            !fileUrl  && !isEditing && (
              <p 
                className={cn(
                "text-sm text-zinc-500 dark:text-zinc-400", 
                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
               
              )}>
                {content}
                {
                  isUpdated && !deleted && (
                    <span className="text-xs mx-2 text-zinc-500 dark:text-zinc-400">
                      (edited)
                    </span>
                  )
                }
              </p>
            )
          }
          {
            !fileUrl  && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-x-2 pt-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input 
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-300" 
                              placeholder="Edited message"
                              {...field} 
                              
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="sm" variant="primary" disabled={isLoading}>
                    Save
                  </Button>
                </form>
                <span className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                  Press Esc to cancel, enter to save.
                </span>
              </Form>
            )
          }
        </div>
      </div>
      {
        canDeleteMessage && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            {
              canEditMessage && (
                <ActionTooltip label="Edit">
                  <Edit 
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition" 
                  />
                </ActionTooltip>
              )
            }
            {
              canDeleteMessage && (
                <ActionTooltip label="Delete">
                  <Trash 
                    onClick={() => onOpen("deleteMessage", { apiUrl: `${socketUrl}/${id}`, query: socketQuery })}
                    className="cursor-pointer ml-auto h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition" 
                  />
                </ActionTooltip>
              )
            }
          </div>
        )
      }
    </div>
  );
};