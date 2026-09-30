"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
}
export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button type="button" className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-sm" onClick={() => onChange("")}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return <UploadDropzone 
    endpoint={endpoint} 
    onClientUploadComplete={(res) => {
      onChange(res?.[0]?.ufsUrl);
    }} 
    onUploadError={(error: Error) => {
      console.log(error);
  }} />;
};