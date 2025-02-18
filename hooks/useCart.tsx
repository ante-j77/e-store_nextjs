import { CartProductType } from "@/app/product/[id]/ProductDetails";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface CartContextType {
  cartTotalQuantity: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQuantityIncrease: (product: CartProductType) => void;
  handleCartQuantityDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (value: string | null) => void;
}

const CartContext = React.createContext<CartContextType>({} as CartContextType);

export default CartContext;

interface Props {
  [propName: string]: any;
  children: ReactNode;
}

export const CartContextProvider = ({ props, children }: Props) => {
  const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const cartItems: any = localStorage.getItem("eShopCartItems");

    const cProducts: CartProductType[] = cartItems ? JSON.parse(cartItems) : [];

    const eShopPaymentIntent: any = localStorage.getItem("eShopPaymentIntent");
    const paymentIntent: string | null = eShopPaymentIntent
      ? JSON.parse(eShopPaymentIntent)
      : null;

    setCartProducts(cProducts);

    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, quantity } = cartProducts.reduce(
          (accumulator, currentValue) => {
            const itemTotalPrice = currentValue.price * currentValue.quantity;

            accumulator.total = accumulator.total + itemTotalPrice;
            accumulator.quantity = accumulator.quantity + currentValue.quantity;

            return accumulator;
          },
          {
            total: 0,
            quantity: 0,
          }
        );
        setCartTotalQuantity(quantity);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }

      localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));

      return updatedCart;
    });
    toast.success("Product added to cart");
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter((item) => {
          return item.id != product.id;
        });

        setCartProducts(filteredProducts);

        localStorage.setItem(
          "eShopCartItems",
          JSON.stringify(filteredProducts)
        );
      }
      toast.success("Product removed");
    },
    [cartProducts]
  );

  const handleCartQuantityIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 99) {
        return toast.error("Ops! Maximum reached");
      }

      if (cartProducts) {
        updatedCart = [...cartProducts];
        updatedCart = cartProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        setCartProducts(updatedCart);
        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleCartQuantityDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) {
        return toast.error("Ops! Minimum reached");
      }

      if (cartProducts) {
        updatedCart = cartProducts.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );

        setCartProducts(updatedCart);
        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQuantity(0);

    localStorage.setItem("eShopCartItems", JSON.stringify(null));
  }, [cartProducts]);

  const handleSetPaymentIntent = useCallback(
    (value: string | null) => {
      setPaymentIntent(value);
      localStorage.setItem("eShopPaymentIntent", JSON.stringify(value));
    },
    [paymentIntent]
  );

  const value = {
    cartTotalQuantity,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQuantityIncrease,
    handleCartQuantityDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return (
    <CartContext.Provider value={value} {...props}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
