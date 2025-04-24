export interface DiscountModalProps {
    open: boolean;
    onClose: () => void;
    newDiscount: {
      discountCode: string;
      rule: string;
      type: string;
      discountPayload: string | object;
      typePayload: string;
    };
    handleChangeNewDiscount: (field: string, value: string) => void;
    handleSubmitDiscount: () => Promise<void>;
  }
  