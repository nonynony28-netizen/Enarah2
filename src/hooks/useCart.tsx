import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type CartItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price?: number;
};

type CartParticle = {
  id: number;
  x: number;
  y: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: { id: string; name: string; description: string; image: string; price?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  sendOrderToWhatsApp: (isAr: boolean) => void;
  triggerFlyAnimation: (x: number, y: number) => void;
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
  const [particles, setParticles] = useState<CartParticle[]>([]);

  useEffect(() => {
    localStorage.setItem('enarah_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: { id: string; name: string; description: string; image: string; price?: number }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
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

  const triggerFlyAnimation = (x: number, y: number) => {
    const id = Date.now() + Math.random();
    setParticles((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  };

  const sendOrderToWhatsApp = (isAr: boolean) => {
    const phone = '218916580068';
    let text = isAr
      ? 'السلام عليكم ورحمة الله وبركاته، أود تأكيد طلب المنتجات التالية من شركة الإنارة الحديثة:\n\n'
      : 'Hello, I would like to place an order for the following items from Enarah Modern:\n\n';

    let pricedTotal = 0;
    let hasPriced = false;

    cartItems.forEach((item, index) => {
      if (item.price) {
        hasPriced = true;
        const subtotal = item.price * item.quantity;
        pricedTotal += subtotal;
        text += `${index + 1}. *${item.name}* (الكمية: ${item.quantity}) - السعر: ${item.price.toFixed(2)} د.ل (الإجمالي: ${subtotal.toFixed(2)} د.ل)\n`;
      } else {
        text += `${index + 1}. *${item.name}* (الكمية: ${item.quantity}) - [السعر يحدد مع المبيعات]\n`;
      }
    });

    if (hasPriced) {
      text += isAr
        ? `\n💰 إجمالي المواد المسعرة: ${pricedTotal.toFixed(2)} د.ل\n`
        : `\n💰 Total for priced items: ${pricedTotal.toFixed(2)} LYD\n`;
    }

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
        triggerFlyAnimation,
      }}
    >
      {children}

      {/* flying particles renderer */}
      <AnimatePresence>
        {particles.map((p) => {
          const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
          const targetX = isRTL ? 75 : (typeof window !== 'undefined' ? window.innerWidth - 75 : 1200);
          const targetY = 28;

          return (
            <motion.div
              key={p.id}
              initial={{ x: p.x - 10, y: p.y - 10, scale: 1.2, opacity: 1 }}
              animate={{
                x: targetX,
                y: targetY,
                scale: 0.15,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
              className="fixed z-[9999] pointer-events-none w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_12px_rgba(59,130,246,0.8)] border border-blue-300/40"
            >
              +1
            </motion.div>
          );
        })}
      </AnimatePresence>
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
