import HomeBanner from "./components/HomeBanner";
import Container from "./components/Container";
import ProductCard from "./components/products/ProductCard";
import getProducts, { IProductParams } from "@/actions/getProducts";
import NullData from "./components/NullData";
import { Suspense } from "react";

interface HomeProps {
  searchParams: Promise<IProductParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(await searchParams);

  if (products.length === 0) {
    return (
      <NullData title="Oops! No products found. Click 'All' to clear filters" />
    );
  }

  function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const shuffleProducts = shuffleArray(products);

  return (
    <div className="p-8">
      <Container>
        <div>
          <HomeBanner />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <Suspense>
            {shuffleProducts.map((product: any) => {
              return (
                <div key={product.id}>
                  <ProductCard data={product} />
                </div>
              );
            })}
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
