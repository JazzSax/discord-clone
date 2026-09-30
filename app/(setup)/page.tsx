import { initialProfile } from "@/lib/initial-profile";

import { findServerByProfileId } from "@/lib/server-service";
const SetupPage = async() => {
  const profile = await initialProfile();
  const server = await findServerByProfileId(profile.id);
    

  return <div>SetupPage</div>;
};

export default SetupPage;