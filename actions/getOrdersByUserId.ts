import prisma from "@/prisma/client";

export default async function getOrdersByUserId(id: string) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdDate: "desc",
      },
      where: {
        userId: id,
      },
    });

    return orders;
  } catch (error: any) {
    throw new Error(error);
  }
}
