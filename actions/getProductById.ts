import prisma from "@/prisma/client";

interface IParams {
  id: string;
}

export default async function getProductById(params: IParams) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error: any) {
    throw new Error(error);
  }
}
