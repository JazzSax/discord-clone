import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { findServerByProfileId } from "@/lib/server-service";
import { InitialModal } from "@/components/modals/InitialModal";
const SetupPage = async() => {
  const profile = await initialProfile();
  const server = await findServerByProfileId(profile.id);
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
    

  return <InitialModal />;
};

export default SetupPage;