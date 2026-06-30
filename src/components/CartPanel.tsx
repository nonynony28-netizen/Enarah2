import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingCart, MessageSquare } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'

export default function CartPanel() {
  const { isAr } = useLanguage()
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    sendOrderToWhatsApp
  } = useCart()

  const pricedTotal = cartItems.reduce((acc, item) => {
    return acc + (item.price ? item.price * item.quantity : 0)
  }, 0)

  const slideVariants = {
    hidden: { x: isAr ? '-100%' : '100%' },
    visible: { x: 0, transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } },
    exit: { x: isAr ? '-100%' : '100%', transition: { type: 'tween', ease: 'easeIn', duration: 0.25 } }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
          {/* Backdrop overlay خلفية معتمة ضبابية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Cart Sidebar السلة الجانبية */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-[88%] sm:w-full sm:max-w-md h-full bg-[#0a192f]/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between border-white/10 ${
              isAr ? 'border-l' : 'border-r'
            }`}
          >
            {/* نقوش الخلفية الثابتة للأداء العالي */}
            <div className="absolute inset-0 z-0 bg-animated-grid opacity-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              
              {/* رأس السلة Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0a192f]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="font-black text-lg text-white">
                    {isAr ? 'سلة المشتريات' : 'Shopping Cart'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 border border-blue-400/30 text-blue-300 text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all border border-white/5 cursor-pointer"
                  aria-label={isAr ? 'إغلاق السلة' : 'Close cart'}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* قائمة العناصر Items List */}
              <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <ShoppingCart className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {isAr ? 'السلة فارغة' : 'Your cart is empty'}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                      {isAr
                        ? 'تصفح معرض المنتجات وأضف ما ينقصك لتأسيس إنارة منزلك الفاخرة.'
                        : 'Explore our product gallery and add items to begin building your premium lighting setup.'}
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all duration-300 shadow-md group"
                    >
                      {/* صورة مصغرة */}
                      <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-white/10 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                        />
                      </div>

                      {/* تفاصيل المنتج */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-white font-bold text-sm truncate group-hover:text-blue-400 transition-colors duration-300">
                          {item.name}
                        </h4>
                        <p className="text-slate-400 text-xs truncate mt-0.5">
                          {item.description || (isAr ? 'لا يوجد وصف متاح' : 'No description')}
                        </p>

                        {/* سعر الصنف والعدد الإجمالي */}
                        {item.price ? (
                          <div className="mt-2 flex flex-wrap items-baseline gap-2">
                            <span className="text-blue-300 text-sm font-black">
                              {item.price.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-slate-400 text-xs font-semibold">
                                ({isAr ? 'المجموع:' : 'Subtotal:'} <span className="text-blue-200">{(item.price * item.quantity).toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</span>)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-bold mt-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md inline-block">
                            {isAr ? '🔍 السعر يحدد مع المبيعات' : '🔍 Price verified on checkout'}
                          </span>
                        )}

                        {/* معدلات الكميات */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center bg-[#0a192f] border border-white/10 rounded-lg p-0.5 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-md active:scale-95 transition-all"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white font-bold text-xs px-2.5 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-md active:scale-95 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* زر الحذف */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 active:scale-95"
                        title={isAr ? 'حذف المنتج' : 'Remove item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* الجزء السفلي للعمليات Checkout Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-[#0a192f]/90 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{isAr ? 'عدد الأصناف المطلوبة:' : 'Total items:'}</span>
                    <span className="text-white font-black text-lg">{cartCount}</span>
                  </div>

                  {/* إجمالي سعر المواد المسعرة */}
                  {pricedTotal > 0 && (
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-slate-300 font-bold">{isAr ? 'إجمالي المواد المسعرة:' : 'Total priced items:'}</span>
                      <span className="text-blue-300 font-black text-xl">
                        {pricedTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                      </span>
                    </div>
                  )}

                  {/* Trust Advice Banner */}
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs text-center leading-relaxed">
                    {isAr 
                      ? '⚡ سيتم مراجعة وتأكيد طلبك وتفاصيله مباشرة مع المبيعات فور إرسال رسالة الواتساب.'
                      : '⚡ Your order details will be directly verified and confirmed by sales upon sending the WhatsApp message.'}
                  </div>

                  {/* زر تأكيد الطلب للواتساب */}
                  <button
                    onClick={() => sendOrderToWhatsApp(isAr)}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <MessageSquare className="w-5 h-5 fill-current" />
                    <span>
                      {isAr ? 'تأكيد الطلب عبر الواتساب' : 'Confirm Order via WhatsApp'}
                    </span>
                  </button>

                  {/* زر إفراغ السلة */}
                  <button
                    onClick={clearCart}
                    className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95"
                  >
                    {isAr ? 'إفراغ سلة التسوق' : 'Clear Shopping Cart'}
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
