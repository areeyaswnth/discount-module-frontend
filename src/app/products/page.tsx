"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Slider,
} from "@mui/material";
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
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [order, setOrder] = useState<any | null>(null);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openDiscountModal, setOpenDiscountModal] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    points: "0",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
  });
  const [newDiscount, setNewDiscount] = useState({
    discountCode: "",
    rule: "",
    type: "",
    discountPayload: {},
  });

  const [maxUsers, setMaxUsers] = useState(5);
  const [maxProducts, setMaxProducts] = useState(8);
  const [maxDiscounts, setMaxDiscounts] = useState(5);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [uRes, pRes, dRes] = await Promise.all([
        axios.get<User[]>(`${BASE_URL}/users`),
        fetchProducts(),
        fetchDiscounts(),
      ]);
      setUsers(uRes.data);
      setProducts(pRes);
      setDiscounts(dRes);
      // adjust sliders max to data length
      setMaxUsers(Math.min(maxUsers, uRes.data.length));
      setMaxProducts(Math.min(maxProducts, pRes.length));
      setMaxDiscounts(Math.min(maxDiscounts, dRes.length));
    } catch (err) {
      console.error(err);
    }
  }

  const handleAddToCart = (p: Product) =>
    setCartItems((c) => [...c, p]);

  const handleUseDiscountCode = (code: string) => {
    const disc = discounts.find((d) => d.discountCode === code);
    if (!disc) return alert("Invalid code");
    if (appliedDiscounts.includes(code)) return alert("Already used");
    if (
      appliedDiscounts.some((c) => {
        const used = discounts.find((d) => d.discountCode === c);
        return used?.type === disc.type;
      })
    )
      return alert("One discount per type");
    setAppliedDiscounts((c) => [...c, code]);
  };

  const handleResetCart = () => {
    setCartItems([]);
    setAppliedDiscounts([]);
  };
  const handleProceedToCheckout = async () => {
    if (!selectedUser) return alert("Select user");
    if (!cartItems.length) return alert("Cart empty");
    try {
      const ord = {
        userId: selectedUser._id,
        products: getCartSummary(cartItems).map((i) => ({
          productId: i._id,
          quantity: i.quantity,
        })),
        discounts: appliedDiscounts,
      };
      const res = await axios.post(`${BASE_URL}/orders`, ord);
      if (res.status === 201) {
        setOrder(res.data);
      }
    } catch {
      alert("Order failed");
    }
  };


  const handleOpenUserModal = () => setOpenUserModal(true);
  const handleCloseUserModal = () => setOpenUserModal(false);
  const handleChangeNewUser = (f: string, v: string) =>
    setNewUser((u) => ({ ...u, [f]: v }));
  const handleSubmitUser = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, newUser);
      if (res.status === 201) {
        handleCloseUserModal();
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          points: "0",
        });
        loadInitialData();
      }
    } catch {
      alert("Create user failed");
    }
  };

  const handleChangeNewProduct = (f: string, v: string) => {
    setNewProduct((p) => ({
      ...p,
      [f]: f === "price" ? parseFloat(v) || 0 : v,
    }));
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
      alert("Create product failed");
    }
  };

  const handleChangeNewDiscount = (f: string, v: any) =>
    setNewDiscount((d) => ({ ...d, [f]: v }));
  const handleSubmitDiscount = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/discounts`, newDiscount);
      if (res.status === 201) {
        setOpenDiscountModal(false);
        setNewDiscount({
          discountCode: "",
          rule: "",
          type: "",
          discountPayload: {},
        });
        loadInitialData();
      }
    } catch {
      alert("Create discount failed");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          MOCK UP UI FOR TEST API
        </Typography>

        <Box mb={4}>
          <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
            <CreateUserButton onClick={handleOpenUserModal} />
            <CreateProductButton onClick={() => setOpenProductModal(true)} />
            <CreateDiscountButton onClick={() => setOpenDiscountModal(true)} />
          </Box>
        </Box>

        {/* 3-Column Layout */}
        <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }} sx={{ height: "70vh" }}>
          <Box
            display="flex"
            gap={4}
            flexDirection={{ xs: "column", md: "row" }}
            sx={{ height: "70vh" }}
          >
            {/* Users and Products Section */}
            <Box
              display="row"
              flexDirection={{ xs: "row", md: "row" }}
              gap={4}
              flex={2}
              pr={1}
              sx={{ overflowY: "auto" }}
            >
              {/* Users Section */}
                 <Typography variant="h5" gutterBottom>
                  Users
                </Typography>
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ overflowY: "auto" }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {users.map((u) => (
                      <UserCard
                        key={u._id}
                        user={u}
                        onSelect={setSelectedUser}
                        isSelected={selectedUser?._id === u._id}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Products Section */}
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ overflowY: "auto" }}
              >
                <Typography variant="h5" gutterBottom>
                  Products
                </Typography>
                <Box sx={{ flexGrow: 2 }}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {products.map((p) => (
                      <Box key={p._id} minWidth="200px" maxWidth="250px">
                        <ProductCard {...p} onAddToCart={() => handleAddToCart(p)} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Coupons Section */}
            <Box flex={1} overflow="auto" pr={1} sx={{ flexGrow: 1 }}>
              <Typography variant="h5" gutterBottom>Coupons</Typography>
              {discounts.map((d) => (
                <DiscountCard
                  key={d._id}
                  discountCode={d.discountCode}
                  type={d.type}
                  discountPayload={d.discountPayload}
                  onUseCode={() => handleUseDiscountCode(d.discountCode)}
                />
              ))}
            </Box>

            {/* Order Detail and Cart Section */}
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              flex={1}
              pr={1}
              sx={{ overflowY: "auto" }}
            >

              {/* Cart Section */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  Cart
                </Typography>
                {cartItems.length === 0 ? (
                  <Typography color="textSecondary">Empty</Typography>
                ) : (
                  <Box>
                    {getCartSummary(cartItems).map((item) => (
                      <Typography key={item._id}>
                        {item.name} (x{item.quantity}) — ฿
                        {item.price * item.quantity}
                      </Typography>
                    ))}
                    {appliedDiscounts.map((code, i) => (
                      <Typography key={i} color="error">
                        Discount: {code}
                      </Typography>
                    ))}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={handleProceedToCheckout}
                    >
                      Checkout
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2 }}
                      onClick={handleResetCart}
                    >
                      Reset Cart
                    </Button>
                    {order && (
                      <Box mt={4} p={2} border="1px solid #ccc" borderRadius={2}>
                        <Typography variant="h6" gutterBottom>
                          Order Created Successfully
                        </Typography>
                        <Typography>User ID: {order.userId}</Typography>
                        <Typography>Order ID: {order._id}</Typography>

                      

                        <Box mt={2}>
                          <Typography fontWeight="bold">Total: ฿{order.total}</Typography>
                        </Box>

                        <Button
                          variant="outlined"
                          color="secondary"
                          sx={{ mt: 2 }}
                          onClick={() => {
                            handleResetCart();
                            setOrder(null);
                          }}
                        >
                          Clear Order
                        </Button>
                      </Box>
                    )}


                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Modals for User, Product, and Discount creation */}
        <UserModal
          open={openUserModal}
          onClose={handleCloseUserModal}
          newUser={newUser}
          handleChangeNewUser={handleChangeNewUser}
          handleSubmitUser={handleSubmitUser}
        />
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
    </ThemeProvider>
  );
}
