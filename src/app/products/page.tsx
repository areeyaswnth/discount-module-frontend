"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/product-card";
import { Product } from "../interfaces/product";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import DiscountCard from "../components/discount-card";
import { useRouter } from "next/navigation";
import CreateProductButton from "../components/create-product-button";
import { fetchDiscounts, fetchProducts } from "../utils/fetch-product-utils";
import { getCartSummary } from "../utils/cart-utils";
import ProductModal from "../components/product-modal";
import DiscountModal from "../components/discount-modal";
import { DiscountPayload } from "../interfaces/discountPayload";
import { DiscountRules, DiscountTypes } from "../components/discount-modal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [openProductModal, setOpenProductModal] = useState(false); 
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [openDiscountModal, setOpenDiscountModal] = useState(false); 
  const [newDiscount, setNewDiscount] = useState({
    discountCode: "",
    rule: "", 
    type: "",
    discountPayload: {}, 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    loadProducts();
    loadDiscounts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadDiscounts = async () => {
    try {
      const fetchedDiscounts = await fetchDiscounts();
      setDiscounts(fetchedDiscounts);
    } catch (error) {
      console.error("Error loading discounts:", error);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const handleUseDiscountCode = (discountCode: string) => {
    if (appliedDiscounts.includes(discountCode)) {
      alert(`You have already used the discount code: ${discountCode}`);
      return;
    }
    setAppliedDiscounts((prev) => [...prev, discountCode]);
  };

  const handleResetCart = () => {
    setCartItems([]);
    setAppliedDiscounts([]);
  };

  const cartSummary = getCartSummary(cartItems);

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

      const res = await axios.post("http://127.0.0.1:3000/orders", orderData);
      if (res.status === 201) {
        const orderId = res.data._id;
        setOrderNumber(orderId);
        handleResetCart();
        router.push(`/orders/${orderId}`);
      }
    } catch (error) {
      alert("There was an error creating your order.");
    }
  };

  const handleChangeNewProduct = (field: string, value: string) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitProduct = async () => {
    try {
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        price: parseInt(newProduct.price),
      };
      const res = await axios.post("http://127.0.0.1:3000/products", payload);
      if (res.status === 201) {
        loadProducts();
        setOpenProductModal(false);
        setNewProduct({ name: "", category: "", price: "" });
      }
    } catch (err) {
      alert("Failed to create product.");
    }
  };

  const handleChangeNewDiscount = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value);
    
    setNewDiscount(prev => {
      const updatedDiscount = JSON.parse(JSON.stringify(prev));
      
      if (field === "discountPayload") {
        updatedDiscount.discountPayload = value || {};
      } else {
        updatedDiscount[field] = value;
      }
      
      console.log("Updated discount:", updatedDiscount);
      return updatedDiscount;
    });
  };
  
  const handleSubmitDiscount = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting discount:", newDiscount);
      
      if (!newDiscount.discountCode || !newDiscount.rule || !newDiscount.type) {
        throw new Error("Missing required discount information");
      }
      
      const payload = {
        discountCode: newDiscount.discountCode,
        rule: newDiscount.rule,
        type: newDiscount.type,
        discountPayload: newDiscount.discountPayload || {}, 
      };
      
      console.log("Sending payload to API:", payload);
      
      const res = await axios.post("http://127.0.0.1:3000/discounts", payload);
      
      if (res.status === 201) {
        console.log("Discount created successfully:", res.data);
        
        alert("Discount created successfully!");
        
        await loadDiscounts();
        
        setOpenDiscountModal(false);
        setNewDiscount({
          discountCode: "",
          rule: "",
          type: "",
          discountPayload: {}, 
        });
      }
    } catch (err) {
      console.error("Error creating discount:", err);
      alert(`Failed to create discount: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDiscountModal = () => {
    setNewDiscount({
      discountCode: "",
      rule: "",
      type: "",
      discountPayload: {}, 
    });
    setOpenDiscountModal(true);
  };

  if (!isClient) return null;

  return (
    <Box p={8}>
      <Typography variant="h3" gutterBottom>
        🛍️ Our Products
      </Typography>

      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={4}>
        <Box flex={2}>
          <CreateProductButton onClick={() => setOpenProductModal(true)} />
          <Button variant="outlined" sx={{ mt: 2, ml: 2 }} onClick={handleOpenDiscountModal}>
            Create Discount
          </Button>
          <Typography variant="h5" sx={{ mt: 2 }}>Products</Typography>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {products.map((product) => (
              <Box key={product._id} minWidth="200px" maxWidth="250px">
                <ProductCard {...product} onAddToCart={() => handleAddToCart(product)} />
              </Box>
            ))}
          </Box>
        </Box>

        <Box flex={1}>
          <Typography variant="h5">Available Discounts</Typography>
          {discounts.map((discount) => (
            <DiscountCard
              key={discount._id}
              discountCode={discount.discountCode}
              type={discount.type}
              discountPayload={discount.discountPayload}
              onUseCode={() => handleUseDiscountCode(discount.discountCode)}
            />
          ))}
        </Box>

        <Box flex={1}>
          <Typography variant="h5">Your Cart</Typography>
          {cartSummary.length === 0 ? (
            <Typography color="textSecondary">Your cart is empty.</Typography>
          ) : (
            <Box>
              {cartSummary.map((item) => (
                <Box key={item._id} mb={1}>
                  <Typography>
                    {item.name} (x{item.quantity}) — ฿{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              {appliedDiscounts.map((discountCode, i) => (
                <Typography key={i} color="error">
                  Discount Applied: {discountCode}
                </Typography>
              ))}

              <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>
              <Button fullWidth variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={handleResetCart}>
                Reset Order
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <ProductModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        newProduct={newProduct}
        handleChangeNewProduct={handleChangeNewProduct}
        handleSubmitProduct={handleSubmitProduct}
      />

      <DiscountModal
        open={openDiscountModal}
        onClose={() => setOpenDiscountModal(false)}
        newDiscount={newDiscount}
        handleChangeNewDiscount={handleChangeNewDiscount}
        handleSubmitDiscount={handleSubmitDiscount}
      />
    </Box>
  );
}