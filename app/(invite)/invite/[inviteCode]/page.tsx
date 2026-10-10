import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { findServerByInviteCode, joinServerFromInviteCode } from "@/lib/server-service";

interface InvitePageProps {
  params: Promise<{ inviteCode: string }>;
}
const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await initialProfile();

  const { inviteCode } = await params;
  if (!inviteCode) {
    return redirect("/");
  }

  const existingServer = await findServerByInviteCode(inviteCode, profile.id);
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await joinServerFromInviteCode(inviteCode, profile.id);
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return redirect("/");
};

export default InvitePage;