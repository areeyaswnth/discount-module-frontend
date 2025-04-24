import { Product } from '../interfaces/product';

export const getCartSummary = (cartItems: Product[]) => {
  const summary: { [key: string]: Product & { quantity: number } } = {};
  cartItems.forEach((item) => {
    if (summary[item._id]) {
      summary[item._id].quantity += 1;
    } else {
      summary[item._id] = { ...item, quantity: 1 };
    }
  });
  return Object.values(summary);
};