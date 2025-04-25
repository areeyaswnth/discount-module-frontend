import React from "react";
import { Button } from "@mui/material";

interface CreateUserButtonProps {
  onClick: () => void;
}

const CreateUserButton: React.FC<CreateUserButtonProps> = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={onClick}>
      Create User
    </Button>
  );
};

export default CreateUserButton;
