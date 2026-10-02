import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { findServerById } from "@/lib/server-service";
import { ServerSidebar } from "@/components/server";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) => {
  const { serverId } = await params;
  const profile = await currentProfile();

  if (!profile) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const server = await findServerById(serverId, profile.id);

  if (!server) {
    redirect("/");
  }

  return (<div className="h-full">
    <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
      <ServerSidebar serverId={serverId} />
    </div>
    <main className="h-full md:pl-60">{children}</main>
  </div>);
};

export default ServerIdLayout; 