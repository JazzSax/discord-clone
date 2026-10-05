"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endpoint: "serverImage" | "messageFile";
  value: string;
  onChange: (url?: string) => void;
}

const isPdfUpload = (file?: { name?: string; type?: string }) => {
  return file?.type === "application/pdf" || file?.name?.toLowerCase().endsWith(".pdf") === true;
};

export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const [isPdf, setIsPdf] = useState(false);
  const urlLooksLikePdf = value.split("?")[0]?.toLowerCase().endsWith(".pdf");

  const handleRemove = () => {
    setIsPdf(false);
    onChange("");
  };

  if (value && (isPdf || urlLooksLikePdf)) {
    return (
      <div className="relative flex items-center w-full min-w-0 max-w-full gap-2 p-2 pr-8 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-4 w-4 shrink-0" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="min-w-0 text-left text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all">
          {value}
        </a>
        <button type="button" className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm" onClick={handleRemove}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  if (value) {
    return (
      <div className="relative mx-auto h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full object-cover object-center" />
        <button type="button" className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-sm" onClick={handleRemove}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  
  return <UploadDropzone 
    endpoint={endpoint} 
    onClientUploadComplete={(res) => {
      const file = res?.[0];
      const pdf = isPdfUpload(file);
      setIsPdf(pdf);
      const url = file?.ufsUrl;
      if (!url) return;
      onChange(file?.name ? `${url}#${encodeURIComponent(file.name)}` : url);
    }} 
    onUploadError={(error: Error) => {
      console.log(error);
  }} />;
};
