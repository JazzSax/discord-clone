import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
export async function PATCH(req: Request, { params }: { params: Promise<{ serverId: string }> }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { serverId } = await params;
    const { name, imageUrl } = await req.json();
    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    const server = await db.server.update({
      where: { id: serverId },
      data: { name, imageUrl },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: Promise<{ serverId: string }> }) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { serverId } = await params;
    if (!serverId) {
      return new NextResponse('Server ID is missing', { status: 400 });
    }

    const server = await db.server.delete({
      where: { id: serverId, profileId: profile.id },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}