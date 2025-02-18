import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import getProductById from "@/actions/getProductById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface Props {
  params: Promise<{ id: string }>;
}

const Product = async ({ params }: Props) => {
  const product = await getProductById({ id: (await params).id });
  const user = await getCurrentUser();

  if (!product) {
    return <NullData title="Oops! Product with the giver ID does not exist" />;
  }

  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col gap-4 mt-20">
          <AddRating product={product} user={user} />
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default Product;
