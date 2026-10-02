import { CreateServerModal } from "@/components/modals/CreateServerModal";
import { InviteModal } from "@/components/modals/InviteModal";


export const ModalProvider = () => {

  return (
    <>
      <CreateServerModal />
      <InviteModal />
    </>
  );
};