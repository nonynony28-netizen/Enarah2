import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: { id: string; name: string; description: string; image: string }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  sendOrderToWhatsApp: (isAr: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('enarah_cart');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('enarah_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: { id: string; name: string; description: string; image: string }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const sendOrderToWhatsApp = (isAr: boolean) => {
    const phone = '218916580068';
    let text = isAr
      ? 'السلام عليكم ورحمة الله وبركاته، أود تأكيد طلب المنتجات التالية من شركة الإنارة الحديثة:\n\n'
      : 'Hello, I would like to place an order for the following items from Enarah Modern:\n\n';

    cartItems.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (الكمية: ${item.quantity})\n`;
    });

    text += isAr
      ? `\nإجمالي عدد الأصناف: ${cartCount}\nيرجى التواصل معي لتأكيد الأسعار وتفاصيل التسليم.`
      : `\nTotal quantity: ${cartCount}\nPlease contact me to confirm the prices and delivery arrangements.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        sendOrderToWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
