import { createContext } from 'react';

interface CartContextType {
  denyPurchase: number
  setDenyPurchase: (value: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default CartContext;
