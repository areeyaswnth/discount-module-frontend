import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
} from "@mui/material";

import ClothingImage from "@/assets/Clothing.jpg";
import ElectronicsImage from "@/assets/Electronics.jpg";
import AccessoriesImage from "@/assets/Accessories.jpg";
import { Product } from "../interfaces/product";

const categoryImages: Record<string, string> = {
  Clothing: ClothingImage.src,
  Electronics: ElectronicsImage.src,
  Accessories: AccessoriesImage.src,
};

interface ProductCardProps {
  _id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  onAddToCart?: () => void; 
}

export const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  name,
  category,
  price,
  onAddToCart, 
}) => {
  const fallbackImage = categoryImages[category] || ClothingImage.src;

  return (
    <Card
      sx={{
        maxWidth: 250,
        boxShadow: 3,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={fallbackImage}
        alt={name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category}
        </Typography>
        <Box mt={1}>
          <Typography variant="h6" color="primary">
            ฿{price.toLocaleString()}
          </Typography>
        </Box>
        {onAddToCart && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
