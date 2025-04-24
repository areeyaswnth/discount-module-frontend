import React from "react";
import { Button } from "@mui/material";

interface CreateDiscountButtonProps {
  onClick: () => void;
}

const CreateDiscountButton: React.FC<CreateDiscountButtonProps> = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={onClick}>
      Create Discount
    </Button>
  );
};

export default CreateDiscountButton;
