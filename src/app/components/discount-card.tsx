import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

interface DiscountCardProps {
  discountCode: string;
  type: string;
  discountPayload: any;
  onClick?: () => void;
  onUseCode?: (discountCode: string) => void;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  discountCode,
  type,
  discountPayload,
  onClick,
  onUseCode,
}) => {
  const handleUseCode = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (onUseCode) {
      onUseCode(discountCode);
    }
  };

  const renderDiscountDetails = () => {
    switch (type) {
      case "onTop":
        if (discountPayload?.category) {
          return (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              Applicable on category: {discountPayload.category} with {discountPayload.discountPercent}% off
            </Typography>
          );
        }
        if (discountPayload?.discountAmount) {
          return (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              Fixed discount amount: ฿{discountPayload.discountAmount}
            </Typography>
          );
        }
        return null;
      case "coupon":
        if (discountPayload?.discountPercent) {
          return (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              {discountPayload.discountPercent}% off your order
            </Typography>
          );
        }
        if (discountPayload?.discountAmount) {
          return (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              Fixed discount amount: ฿{discountPayload.discountAmount}
            </Typography>
          );
        }
        return null;
      case "seasonal":
        if (discountPayload?.countPerPrice) {
          return (
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              Get ฿{discountPayload.discountAmount} off for every ฿{discountPayload.countPerPrice} spent
            </Typography>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return <Card
  variant="outlined"
  sx={{
    mb: 2,
    cursor: "pointer",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.03)", // scale น้อยลงหน่อยจะดูนุ่มนวล
      boxShadow: 2,
    },
    maxWidth: "180px", // ปรับให้แคบลง
    minWidth: "140px",
  }}
  onClick={onClick}
>
  <CardContent sx={{ padding: "6px 12px" }}>
    <Typography variant="h6" sx={{ fontSize: "0.95rem", mb: 0.5 }}>
      {discountCode}
    </Typography>
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{ fontSize: "0.7rem", mb: 0.5 }}
    >
      {type} discount
    </Typography>
    {renderDiscountDetails()}
    <Button
      variant="contained"
      color="primary"
      fullWidth
      sx={{
        mt: 1,
        padding: "4px 0", // เตี้ยลงอีกนิด
        fontSize: "0.75rem", // ตัวหนังสือเล็กลงนิด
      }}
      onClick={handleUseCode}
    >
      Use Code
    </Button>
  </CardContent>
</Card>

};

export default DiscountCard;
