export interface ProductModalProps {
    open: boolean;
    onClose: () => void;
    newProduct: {
      name: string;
      category: string;
      price: string;
    };
    handleChangeNewProduct: (field: string, value: string) => void;
    handleSubmitProduct: () => Promise<void>;
  }
  