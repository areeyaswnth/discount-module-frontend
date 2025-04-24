"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/product-card";
import { Product } from "../interfaces/product";
import { Box, Typography, Button } from "@mui/material";
import DiscountCard from "../components/discount-card";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3000/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchDiscounts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:3000/discounts");
        setDiscounts(res.data);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchProducts();
    fetchDiscounts();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleUseDiscountCode = (discountCode: string, discountType: string) => {
    if (appliedDiscounts.includes(discountCode)) {
      alert(`You have already used the discount code: ${discountCode}`);
      return;
    }
    setAppliedDiscounts((prevDiscounts) => [...prevDiscounts, discountCode]);
  };

  const handleResetCart = () => {
    setCartItems([]);
    setAppliedDiscounts([]);
  };

  const getCartSummary = () => {
    const itemSummary = cartItems.reduce(
      (acc: { [key: string]: Product & { quantity: number } }, item: Product) => {
        if (acc[item._id]) {
          acc[item._id].quantity += 1;
        } else {
          acc[item._id] = { ...item, quantity: 1 };
        }
        return acc;
      },
      {}
    );
    return Object.values(itemSummary);
  };

  const cartSummary = getCartSummary();

  const handleProceedToCheckout = async () => {
    if (cartSummary.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        userId: "6809d749b594afbb18a53465",
        products: cartSummary.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        discounts: appliedDiscounts, 
      };

      alert(`Request Data:\n${JSON.stringify(orderData, null, 2)}`);

      const res = await axios.post("http://127.0.0.1:3000/orders", orderData);

      if (res.status === 201) {
        const orderId = res.data._id;
        setOrderNumber(orderId);
        handleResetCart();
        alert(`Order created! Order ID: ${orderId}`);
        router.push(`/orders/${orderId}`);
      } else {
        alert("Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error creating your order.");
    }
  };

  if (!isClient) return null;

  return (
    <Box p={8}>
      <Typography variant="h3" gutterBottom>
        🛍️ Our Products
      </Typography>

      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={4}>
        {/* Product List */}
        <Box flex={2}>
          <Typography variant="h5">Products</Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {products.map((product) => (
              <Box key={product._id} minWidth="200px" maxWidth="250px">
                <ProductCard
                  {...product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Discount List */}
        <Box flex={1}>
          <Typography variant="h5">Available Discounts</Typography>
          {discounts.map((discount) => (
            <DiscountCard
              key={discount._id}
              discountCode={discount.discountCode}
              type={discount.type}
              discountPayload={discount.discountPayload}
              onUseCode={() =>
                handleUseDiscountCode(discount.discountCode, discount.type)
              }
            />
          ))}
        </Box>

        {/* Cart Summary */}
        <Box flex={1}>
          <Typography variant="h5">Your Cart</Typography>
          {cartSummary.length === 0 ? (
            <Typography color="textSecondary">Your cart is empty.</Typography>
          ) : (
            <Box>
              {cartSummary.map((item) => (
                <Box key={item._id} mb={1}>
                  <Typography>
                    {item.name} (x{item.quantity}) — ฿
                    {(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              {appliedDiscounts.map((discountCode, i) => (
                <Typography key={i} color="error">
                  Discount Applied: {discountCode}
                </Typography>
              ))}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleResetCart}
              >
                Reset Order
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Order ID Display */}
      {orderNumber && (
        <Box mt={4}>
          <Typography variant="h5" color="primary">
            Your Order ID: {orderNumber}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
