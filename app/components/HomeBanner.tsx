import Image from "next/image";
import React from "react";
import banner from "@/public/banner.png";

const HomeBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-sky-700 mb-8">
      <div className="flex flex-col gap-2 py-12 px-8 mx-auto md:flex-row items-center justify-evenly">
        {/* TEXT */}
        <div className="mb-8 md:mb-0 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Summer Sale
          </h1>
          <p className="text-lg md:text-xl text-white mb-2">
            Enjoy discounts on selected items
          </p>
          <p className="text-2xl md:text-5xl text-yellow-400 font-bold">
            GET 50% OFF
          </p>
        </div>
        {/* IMAGE */}
        <div className="w-1/3 relative aspect-video">
          <Image
            src={banner}
            fill
            priority={true}
            sizes="100%"
            alt="Banner image"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
