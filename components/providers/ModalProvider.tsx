import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { InviteModal } from "@/components/modals/InviteModal";
import { EditServerModal } from "@/components/modals/EditServerModal";

export const ModalProvider = () => {

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
    </>
  );
};