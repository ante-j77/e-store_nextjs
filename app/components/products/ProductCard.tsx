"use client";

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Rating } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface ProductCardProps {
  data: any;
}

const ProductCard = ({ data }: ProductCardProps) => {
  const productRating =
    data.reviews.reduce((acc: number, total: any) => acc + total.rating, 0) /
    data.reviews.length;

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/product/${data.id}`)}
      className="col-span-1 cursor-pointer border-[1px] border-slate-200 bg-slate-50 rounded-sm p-2 transition hover:scale-105 text-center text-sm"
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square relative overflow-hidden w-full">
          <Image
            src={data.images[0].image}
            alt={data.name}
            fill
            sizes="100%"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-4">{truncateText(data.name)}</div>
        <div>
          <Rating value={productRating} readOnly />
        </div>
        <div>{data.reviews.lenght} reviews</div>
        <div className="font-semibold">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
