"use client";

import { categories } from "@/utils/Categories";
import Container from "../Container";
import Category from "./Category";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) return null;

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-4 grid grid-cols-2 gap-2 md:flex md:flex-row items-center justify-between overflow-x-auto">
          <Suspense>
            {categories.map((item) => (
              <Category
                key={item.label}
                label={item.label}
                icon={item.icon}
                selected={
                  category === item.label ||
                  (category === null && item.label === "All")
                }
              />
            ))}
          </Suspense>
        </div>
      </Container>
    </div>
  );
};

export default Categories;
