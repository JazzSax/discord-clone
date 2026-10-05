import type { Server, Member, Profile } from "@/lib/generated/prisma/browser";
import { Server as NetServer, Socket } from "net";
import { Server as IOServer } from "socket.io";
import { NextApiResponse } from "next";

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: IOServer;
    };
  };
};