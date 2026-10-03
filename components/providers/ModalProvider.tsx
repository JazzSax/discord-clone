import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { InviteModal } from "@/components/modals/InviteModal";
import { EditServerModal } from "@/components/modals/EditServerModal";
import { MembersModal } from "@/components/modals/MembersModal";

export const ModalProvider = () => {

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
    </>
  );
};