import { db } from "./db";

export const findChannelById = async (channelId: string) => {
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  return channel;
}