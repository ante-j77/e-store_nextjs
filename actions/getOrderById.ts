import prisma from "@/prisma/client";

export default async function getOrderById(params: Promise<{ id: string }>) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id: id },
    });

    if (!order) return null;

    return order;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
