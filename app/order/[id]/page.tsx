import Container from "@/app/components/Container";
import React from "react";
import OrderDetails from "./OrderDetails";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";

interface Props {
  params: Promise<{ id: string }>;
}

const Order = async ({ params }: Props) => {
  const order = await getOrderById(params);

  if (!order) return <NullData title="No order" />;

  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order} />
      </Container>
    </div>
  );
};

export default Order;
