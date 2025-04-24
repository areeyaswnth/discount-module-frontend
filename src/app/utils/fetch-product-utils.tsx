
import axios from 'axios';
import { Product } from '../interfaces/product'; 

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await axios.get("http://127.0.0.1:3000/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; 
  }
};

export const fetchDiscounts = async (): Promise<any[]> => {
  try {
    const res = await axios.get("http://127.0.0.1:3000/discounts");
    return res.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error; 
  }
};