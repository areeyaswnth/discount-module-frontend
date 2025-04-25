
import React from "react";
import { Box, Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const CATEGORY_LIST = ["Accessories", "Electronics", "Clothing"];

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  newProduct: { name: string; category: string; price: number };
  handleChangeNewProduct: (field: string, value: string) => void;
  handleSubmitProduct: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, newProduct, handleChangeNewProduct, handleSubmitProduct }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box p={4} bgcolor="background.paper" borderRadius={2} boxShadow={24} maxWidth="500px" mx="auto" mt={10} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Create New Product</Typography>
        <TextField label="Product Name" fullWidth value={newProduct.name} onChange={(e) => handleChangeNewProduct("name", e.target.value)} />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={newProduct.category} label="Category" onChange={(e) => handleChangeNewProduct("category", e.target.value)}>
            {CATEGORY_LIST.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Price (THB)" type="number" fullWidth value={newProduct.price} onChange={(e) => handleChangeNewProduct("price", e.target.value)} />
        <Button variant="contained" onClick={handleSubmitProduct}>Create Product</Button>
      </Box>
    </Modal>
  );
};

export default ProductModal;
