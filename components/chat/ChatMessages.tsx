"use client";

import { Member } from "@/lib/generated/prisma/browser";
import { ChatWelcome } from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Message, Profile } from "@/lib/generated/prisma/browser";

type MessageWithMemberWithProfile = Message & { member: Member & { profile: Profile } };
interface ChatMessagesProps {
  name: string;
  member: Member;
  apiUrl: string;
  chatId: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}
export const ChatMessages = ({ name, member, apiUrl, chatId, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });
  if (status === "pending") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1"/>
       <ChatWelcome type={type} name={name} />
       <div className="flex flex-col-reverse mt-auto">
        {
          data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((message: MessageWithMemberWithProfile) => (
                <div key={message.id} className="flex flex-col gap-y-2">
                  {message.content}
                </div>
              ))}
            </Fragment>
          ))
        }
       </div>
    </div>
  );
};