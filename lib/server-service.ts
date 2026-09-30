import { db } from "./db";

export const findServerByProfileId = async (profileId: string) => {
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
  return server;
};