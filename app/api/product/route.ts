import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  const { name, description, price, brand, category, inStock, images } = body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      brand,
      category,
      inStock,
      images,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id, inStock } = body;

  const product = await prisma.product.update({
    where: { id: id },
    data: { inStock },
  });

  return NextResponse.json(product);
}
