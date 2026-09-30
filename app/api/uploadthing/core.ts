import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "@clerk/nextjs/server";
const f = createUploadthing();

const auth = async () => {
  const user = await currentUser();
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
};


export const ourFileRouter = {
 
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(auth)
  .onUploadComplete(() => {}),
  
  messageFile: f(['image', 'pdf'])
  .middleware(auth)
  .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
