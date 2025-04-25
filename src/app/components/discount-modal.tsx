import React, { useState } from "react";
import { Box, Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress } from "@mui/material";

export enum DiscountRules {
  FIXED_AMOUNT = 'fixed-amount', 
  PERCENTAGE_AMOUNT = 'percentage-amount', 
  POINTS = 'points', 
  PRICE = 'price',
  CATEGORY = 'category'
}

export enum DiscountTypes {
  COUPON = 'coupon',
  SEASONAL = 'seasonal',
  ONTOP = 'onTop'
}

const CATEGORY_LIST = ["Accessories", "Electronics", "Clothing"];

interface DiscountModalProps {
  open: boolean;
  onClose: () => void;
  newDiscount: any;
  handleChangeNewDiscount: (field: string, value: any) => void;
  handleSubmitDiscount: () => Promise<void>;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ open, onClose, newDiscount, handleChangeNewDiscount, handleSubmitDiscount }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayloadChange = (field: string, value: any) => {
    const currentPayload = newDiscount.discountPayload || {};
    
    const updatedPayload = { ...currentPayload, [field]: value };
    
    console.log(`Updating payload field ${field} to:`, value);
    console.log("New payload will be:", updatedPayload);
    
    handleChangeNewDiscount("discountPayload", updatedPayload);
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    const newType = e.target.value as DiscountTypes;
    handleChangeNewDiscount("type", newType);
    handleChangeNewDiscount("rule", "");  
    handleChangeNewDiscount("discountPayload", {});
  };

  const handleRuleChange = (e: SelectChangeEvent) => {
    const newRule = e.target.value as DiscountRules;
    handleChangeNewDiscount("rule", newRule);
    handleChangeNewDiscount("discountPayload", {});
  };
  const getRuleOptions = () => {
    switch (newDiscount.type) {
      case DiscountTypes.COUPON:
        return [DiscountRules.FIXED_AMOUNT, DiscountRules.PERCENTAGE_AMOUNT];
      case DiscountTypes.SEASONAL:
        return [DiscountRules.PRICE];
      case DiscountTypes.ONTOP:
        return [DiscountRules.POINTS, DiscountRules.CATEGORY];
      default:
        return [];
    }
  };
    

  const validateAndSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!newDiscount.discountCode) {
        throw new Error("Discount code is required");
      }
      
      if (!newDiscount.type) {
        throw new Error("Discount type is required");
      }
      
      if (!newDiscount.rule) {
        throw new Error("Discount rule is required");
      }
      
      switch (newDiscount.rule) {
        case DiscountRules.FIXED_AMOUNT:
          if (!newDiscount.discountPayload?.discountAmount && newDiscount.discountPayload?.discountAmount !== 0) {
            throw new Error("Discount amount is required");
          }
          break;
          
        case DiscountRules.PERCENTAGE_AMOUNT:
          if (!newDiscount.discountPayload?.discountPercent && newDiscount.discountPayload?.discountPercent !== 0) {
            throw new Error("Discount percentage is required");
          }
          break;
          
        case DiscountRules.POINTS:
          if (!newDiscount.discountPayload?.maxPercent || !newDiscount.discountPayload?.discountAmount) {
            throw new Error("Max percent and discount amount are required");
          }
          break;
          
        case DiscountRules.PRICE:
          if (!newDiscount.discountPayload?.countPerPrice || !newDiscount.discountPayload?.discountAmount) {
            throw new Error("Count per price and discount amount are required");
          }
          break;
          
        case DiscountRules.CATEGORY:
          if (!newDiscount.discountPayload?.category || !newDiscount.discountPayload?.discountPercent) {
            throw new Error("Category and discount percent are required");
          }
          break;
      }
      
      console.log("Form validated, submitting:", newDiscount);
      
      await handleSubmitDiscount();
      
      onClose();
    } catch (err) {
      console.error("Validation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box p={4} bgcolor="background.paper" borderRadius={2} boxShadow={24} maxWidth="500px" mx="auto" mt={10} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6">Create Discount</Typography>
        
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        
        <TextField 
          label="Discount Code" 
          fullWidth 
          value={newDiscount.discountCode || ""} 
          onChange={(e) => handleChangeNewDiscount("discountCode", e.target.value)} 
          required
        />
        
        {/* Discount Type Selection */}
        <FormControl fullWidth required>
          <InputLabel>Type</InputLabel>
          <Select value={newDiscount.type || ""} label="Type" onChange={handleTypeChange}>
            {Object.values(DiscountTypes).map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* Discount Rule Selection */}
        <FormControl fullWidth required>
          <InputLabel>Rule</InputLabel>
          <Select value={newDiscount.rule || ""} label="Rule" onChange={handleRuleChange}>
            {getRuleOptions().map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* แสดง input fields ตาม rule */}
        {newDiscount.rule === DiscountRules.FIXED_AMOUNT && (
          <TextField
            label="Discount Amount"
            type="number"
            fullWidth
            value={newDiscount.discountPayload?.discountAmount || ""}
            onChange={(e) => handlePayloadChange("discountAmount", parseInt(e.target.value) || 0)}
            required
          />
        )}
  
        {newDiscount.rule === DiscountRules.PERCENTAGE_AMOUNT && (
          <TextField
            label="Discount Percentage"
            type="number"
            fullWidth
            value={newDiscount.discountPayload?.discountPercent || ""}
            onChange={(e) => handlePayloadChange("discountPercent", parseInt(e.target.value) || 0)}
            required
          />
        )}
  
        {newDiscount.rule === DiscountRules.POINTS && (
          <>
            <TextField
              label="Max Percent"
              type="number"
              fullWidth
              value={newDiscount.discountPayload?.maxPercent || ""}
              onChange={(e) => handlePayloadChange("maxPercent", parseInt(e.target.value) || 0)}
              required
            />
            <TextField
              label="Discount Amount"
              type="number"
              fullWidth
              value={newDiscount.discountPayload?.discountAmount || ""}
              onChange={(e) => handlePayloadChange("discountAmount", parseInt(e.target.value) || 0)}
              required
            />
          </>
        )}
  
        {newDiscount.rule === DiscountRules.PRICE && (
          <>
            <TextField
              label="Count Per Price"
              type="number"
              fullWidth
              value={newDiscount.discountPayload?.countPerPrice || ""}
              onChange={(e) => handlePayloadChange("countPerPrice", parseInt(e.target.value) || 0)}
              required
            />
            <TextField
              label="Discount Amount"
              type="number"
              fullWidth
              value={newDiscount.discountPayload?.discountAmount || ""}
              onChange={(e) => handlePayloadChange("discountAmount", parseInt(e.target.value) || 0)}
              required
            />
          </>
        )}
  
        {newDiscount.rule === DiscountRules.CATEGORY && (
          <>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={newDiscount.discountPayload?.category || ""}
                onChange={(e) => handlePayloadChange("category", e.target.value)}
              >
                {CATEGORY_LIST.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Discount Percent"
              type="number"
              fullWidth
              value={newDiscount.discountPayload?.discountPercent || ""}
              onChange={(e) => handlePayloadChange("discountPercent", parseInt(e.target.value) || 0)}
              required
            />
          </>
        )}
  
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={validateAndSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creating...' : 'Create Discount'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DiscountModal;