import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, deliveryStatus } = body;

  const order = await prisma.order.update({
    where: { id: id },
    data: { deliveryStatus },
  });

  return NextResponse.json(order);
}
