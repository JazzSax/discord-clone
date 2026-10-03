import type { Server, Member, Profile } from "@/lib/generated/prisma/browser";
export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[];
};