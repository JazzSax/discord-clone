import { db } from "./db";

export const findMemberByServerIdAndProfileId = async (serverId: string, profileId: string) => {
  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profileId,
    },
  });
  return member;
}