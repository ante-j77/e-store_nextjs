import prisma from "@/prisma/client";

export default async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdDate: "desc",
      },
    });

    return orders;
  } catch (error: any) {
    throw new Error(error);
  }
}
