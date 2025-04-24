"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import axios from "axios";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const router = useRouter(); 

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const res = await axios.get(`http://localhost:3000/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box p={8}>
        <CircularProgress />
        <Typography ml={2} component="span">Loading order...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box p={8}>
        <Typography color="error">Order not found or failed to load.</Typography>
      </Box>
    );
  }

  const handleBack = () => {
    router.push("/products"); // Navigate back to the products page
  };

  return (
    <Box p={8}>
      <Typography variant="h4" gutterBottom>Order ID: {order._id}</Typography>
      <Typography>Status: {order.status}</Typography>
      <Typography>Total: ฿{order.total.toLocaleString()}</Typography>

      <Box mt={4}>
        {order.products.map((p: any) => (
          <Typography key={p._id}>
            Product {p.productId} × {p.quantity} — ฿{(p.price * p.quantity).toLocaleString()}
          </Typography>
        ))}
      </Box>

      <Box mt={4}>
        {/* Button to go back to products page */}
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back to Products
        </Button>
      </Box>
    </Box>
  );
}
