import React from "react";
import { Button } from "@mui/material";

interface CreateProductButtonProps {
  onClick: () => void;
}

const CreateProductButton: React.FC<CreateProductButtonProps> = ({ onClick }) => {
  return (
    <Button variant="contained"  sx={{ mb: 2 }} onClick={onClick}>
    Create Product
    </Button>
  );
};

export default CreateProductButton;
