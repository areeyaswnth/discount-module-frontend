
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, TextField } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";

import { ProductCard } from "../components/product-card";
import DiscountCard from "../components/discount-card";
import ProductModal from "../components/product-modal";
import DiscountModal from "../components/discount-modal";
import CreateProductButton from "../components/create-product-button";
import CreateDiscountButton from "../components/create-discount-button";
import CreateUserButton from "../components/user-button";
import UserModal from "../components/user-modal";  

import { fetchDiscounts, fetchProducts } from "../utils/fetch-product-utils";
import { getCartSummary } from "../utils/cart-utils";
import theme from "../styles/theme";
import UserCard, { User } from "../components/user-card";
import { Product } from "../interfaces/product";

export default function ProductsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: 0 }); 
  const [newDiscount, setNewDiscount] = useState({ discountCode: "", rule: "", type: "", discountPayload: {} });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    points: "0"
  });

  const router = useRouter();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [products, discounts, userResponse] = await Promise.all([
        fetchProducts(),
        fetchDiscounts(),
        axios.get(`${BASE_URL}/users`)
      ]);
      setProducts(products);
      setDiscounts(discounts);
      setUsers(userResponse.data);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleUseDiscountCode = (discountCode: string) => {
    const selectedDiscount = discounts.find((d) => d.discountCode === discountCode);
    if (!selectedDiscount) return alert(`Invalid discount code: ${discountCode}`);

    const isTypeAlreadyUsed = appliedDiscounts.some((code) => {
      const used = discounts.find((d) => d.discountCode === code);
      return used?.type === selectedDiscount.type;
    });

    if (isTypeAlreadyUsed) return alert(`One discount per type allowed.`);
    if (appliedDiscounts.includes(discountCode)) return alert(`Already used this code.`);

    setAppliedDiscounts((prev) => [...prev, discountCode]);
  };

  const handleResetCart = () => {
    setCartItems([]);
    setAppliedDiscounts([]);
  };

  const handleProceedToCheckout = async () => {
    if (!selectedUser) return alert("Please select a user before checkout.");
    if (cartItems.length === 0) return alert("Cart is empty.");

    try {
      const orderData = {
        userId: selectedUser._id,
        products: getCartSummary(cartItems).map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        discounts: appliedDiscounts,
      };

      const res = await axios.post(`${BASE_URL}/orders`, orderData);
      if (res.status === 201) {
        setOrderNumber(res.data._id);
        handleResetCart();
        router.push(`/orders/${res.data._id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create order.");
    }
  };

  const handleOpenUserModal = () => setOpenUserModal(true);
  const handleCloseUserModal = () => setOpenUserModal(false);

  const handleChangeNewUser = (field: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitUser = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, newUser);
      if (res.status === 201) {
        setOpenUserModal(false);
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          points: "0"
        });
        loadInitialData();
      }
    } catch {
      alert("Failed to create user.");
    }
  };

  const handleChangeNewProduct = (field: string, value: string) => {
    if (field === "price") {
      setNewProduct((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
    } else {
      setNewProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmitProduct = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/products`, newProduct);
      if (res.status === 201) {
        setOpenProductModal(false);
        setNewProduct({ name: "", category: "", price: 0 }); 
        loadInitialData();
      }
    } catch {
      alert("Failed to create product.");
    }
  };

  const handleSubmitDiscount = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/discounts`, newDiscount);
      if (res.status === 201) {
        setOpenDiscountModal(false);
        setNewDiscount({ discountCode: "", rule: "", type: "", discountPayload: {} });
        loadInitialData();
      }
    } catch {
      alert("Failed to create discount.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={8}>
        <Typography variant="h3" gutterBottom>🛍️ Our Products</Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          {users.length === 0 ? (
            <CircularProgress />
          ) : (
            users.map((u) => (
              <UserCard 
                key={u._id} 
                user={u} 
                onSelect={setSelectedUser} 
                isSelected={selectedUser?._id === u._id} 
              />
            ))
          )}
        </Box>

        <CreateProductButton onClick={() => setOpenProductModal(true)} />
        <CreateDiscountButton onClick={() => setOpenDiscountModal(true)} />
        <CreateUserButton onClick={handleOpenUserModal} />

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={4}>
          <Box flex={2}>
            <Typography variant="h5" mt={2}>Products</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {products.map((product) => (
                <Box key={product._id} minWidth="200px" maxWidth="250px">
                  <ProductCard {...product} onAddToCart={() => handleAddToCart(product)} />
                </Box>
              ))}
            </Box>
          </Box>

          <Box flex={1}>
            <Typography variant="h5">Discounts</Typography>
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
            <Typography variant="h5">Cart</Typography>
            {cartItems.length === 0 ? (
              <Typography color="textSecondary">Empty</Typography>
            ) : (
              <Box>
                {getCartSummary(cartItems).map((item) => (
                  <Typography key={item._id}>
                    {item.name} (x{item.quantity}) — ฿{item.price * item.quantity}
                  </Typography>
                ))}
                {appliedDiscounts.map((code, i) => (
                  <Typography key={i} color="error">Discount: {code}</Typography>
                ))}
                <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleProceedToCheckout}>
                  Checkout
                </Button>
                <Button fullWidth variant="outlined" color="primary" sx={{ mt: 2 }} onClick={handleResetCart}>
                  Reset
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
          handleChangeNewDiscount={(field, value) => setNewDiscount(prev => ({ ...prev, [field]: value }))}
          handleSubmitDiscount={handleSubmitDiscount}
        />

        <UserModal
          open={openUserModal}
          onClose={handleCloseUserModal}
          newUser={newUser}
          handleChangeNewUser={handleChangeNewUser}
          handleSubmitUser={handleSubmitUser}
        />
      </Box>
    </ThemeProvider>
  );
}
