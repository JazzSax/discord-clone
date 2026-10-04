import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import { findServerWithGeneralChannelById } from "@/lib/server-service";
import { redirect } from "next/navigation";
interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}
const ServerIdPage = async({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  const { serverId } = await params;
  const server = await findServerWithGeneralChannelById(serverId, profile.id);
  const initialChannel = server?.channels[0];

  if(initialChannel?.name !== "general") {
    return null;
  }
  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`);
 
};

export default ServerIdPage;