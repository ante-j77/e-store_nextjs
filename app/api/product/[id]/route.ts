import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const product = await prisma.product.findUnique({
    where: { id: (await params).id },
  });
  if (!product) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 404 });
  }

  await prisma.product.delete({
    where: { id: product.id },
  });

  return NextResponse.json({});
}
