import axios from 'axios';
import { Product } from '../interfaces/product'; 

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/products`);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; 
  }
};

export const fetchDiscounts = async (): Promise<any[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/discounts`);
    return res.data;
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error; 
  }
};
