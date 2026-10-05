"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { FileUpload } from "@/components/FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required" }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const {apiUrl, query} = data;
  const isModalOpen = isOpen && type === "messageFile";
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      fileUrl: "",
    },
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      handleClose();
      router.refresh();
      
    } catch (error) {
      console.log(error);
    } 
  };

  
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Add an attachment</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex items-center justify-center w-full min-w-0 text-center">
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem className="w-full min-w-0">
                    <FileUpload
                      endpoint="messageFile"
                      value={field.value}
                      onChange={(url) => {
                        form.setValue("fileUrl", url ?? "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button disabled={isLoading} variant="primary" type="submit">Send</Button>
          </DialogFooter>
        </form>
       </Form>
      </DialogContent>
    </Dialog>
  );
};