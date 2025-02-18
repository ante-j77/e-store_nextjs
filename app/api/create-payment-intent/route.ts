export const dynamic = "force-dynamic";

import Stripe from "stripe";
import prisma from "@/prisma/client";
import { CartProductType } from "@/app/product/[id]/ProductDetails";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc: any, item) => {
    const itemTotal = item.price * item.quantity;

    return acc + itemTotal;
  }, 0);
  const price: any = totalPrice.toFixed(2);

  return price;
};

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { items, payment_intent_id } = body;

  const total = calculateOrderAmount(items) * 100;

  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: "eur",
    status: "pending",
    deliveryStatus: "pending",
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        { amount: total }
      );

      const [existing_order, update_order] = await Promise.all([
        prisma.order.findFirst({
          where: { paymentIntentId: payment_intent_id },
        }),
        prisma.order.update({
          where: { paymentIntentId: payment_intent_id },
          data: {
            amount: total,
            products: items,
          },
        }),
      ]);

      if (!existing_order) {
        return NextResponse.json(
          { error: "Invalid Payment Intent" },
          { status: 400 }
        );
      }

      return NextResponse.json({ paymentIntent: updated_intent });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentId = paymentIntent.id;

    await prisma.order.create({
      data: orderData,
    });

    return NextResponse.json({ paymentIntent });
  }

  return NextResponse.error();
}
