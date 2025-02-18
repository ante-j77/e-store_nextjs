"use client";

import Image from "next/image";
import { CartProductType } from "../product/[id]/ProductDetails";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import { truncateText } from "@/utils/truncateText";
import SetQuantity from "../components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";

interface ItemContentProps {
  item: CartProductType;
}

const ItemContent = ({ item }: ItemContentProps) => {
  const {
    handleRemoveProductFromCart,
    handleCartQuantityIncrease,
    handleCartQuantityDecrease,
  } = useCart();

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-y-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/product/${item.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex flex-col justify-between">
          <Link href={`/product/${item.id}`}>{truncateText(item.name)}</Link>
          <div>{item.selectedImg.color}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => handleRemoveProductFromCart(item)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="justify-self-center">{formatPrice(item.price)}</div>

      <div className="justify-self-center">
        <SetQuantity
          cartProduct={item}
          cartCounter={true}
          handleQtyIncrease={() => handleCartQuantityIncrease(item)}
          handleQtyDecrease={() => handleCartQuantityDecrease(item)}
        />
      </div>

      <div className="justify-self-end font-semibold">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

export default ItemContent;
