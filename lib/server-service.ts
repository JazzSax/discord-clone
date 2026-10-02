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

export const findServersByProfileId = async (profileId: string) => {
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
  return servers;
};

export const findServerById = async (serverId: string, profileId: string) => {
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
  return server;
};

export const findServerWithChannelsAndMembersById = async (serverId: string) => {
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
      }
  });
  return server;
};

export const findServerByInviteCode = async (inviteCode: string, profileId: string) => {
  const server = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profileId,
        },
      },
    },
  });
  return server;
};

export const joinServerFromInviteCode = async (inviteCode: string, profileId: string) => {
  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
    members: {
        create: [{
          profileId: profileId,
        }],
      },
    },
  });
  return server;
};