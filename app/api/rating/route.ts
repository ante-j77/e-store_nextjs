import { getCurrentUser } from "@/actions/getCurrentUser";
import prisma from "@/prisma/client";
import { Review } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { comment, rating, product, userId } = body;

  const deliveredOrder = currentUser?.orders.some(
    (order) =>
      order.deliveryStatus === "delivered" &&
      order.products.some((item) => item.id === product.id)
  );

  const userReview = product?.reviews.find((review: Review) => {
    return review.userId === currentUser.id;
  });

  if (userReview || !deliveredOrder) {
    return NextResponse.error();
  }

  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId: product.id,
      userId,
    },
  });

  return NextResponse.json(review);
}
