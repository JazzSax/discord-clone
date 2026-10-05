"use client";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,

} from "@/components/ui/form";
import { Plus, Smile } from "lucide-react";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/useModalStore";

interface ChatInputProps {
  apiUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});
export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="border-t px-4 py-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button 
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    type="button" 
                    className="absolute top-7 left-8 h-6 w-6 p-1 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full flex items-center justify-center">
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    type="text"
                    disabled={isLoading}
                    {...field}
                    placeholder={`Message ${type=== "conversation"? `${name}` : `#${name}`}`}
                    className="px-14 py-6 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-200/90 dark:bg-zinc-700/75 text-zinc-600 dark:text-zinc-200"
                  />
                  <div className="absolute right-8 top-7">
                    <Smile className="h-6 w-6 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};