import { useEffect, useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingCart, MessageSquare, Copy, Check, Clock, ShieldCheck, Sparkles, Building2, Wallet } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useLanguage } from '../hooks/useLanguage'

export default function CartPanel() {
  const { isAr } = useLanguage()
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }
  
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

  // Auto close cart drawer if it is empty
  useEffect(() => {
    if (isCartOpen && cartItems.length === 0) {
      const timer = setTimeout(() => {
        setIsCartOpen(false)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [cartItems.length, isCartOpen, setIsCartOpen])

  const pricedTotal = cartItems.reduce((acc, item) => {
    return acc + (item.price ? item.price * item.quantity : 0)
  }, 0)

  return (
    <div 
      className={`fixed inset-0 z-[3000] flex justify-end transition-all duration-300 ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Cart Sidebar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-[90%] sm:w-full sm:max-w-md h-full bg-[#0d0d11] shadow-2xl flex flex-col justify-between border-zinc-800 transition-transform duration-300 ease-out ${
          isAr 
            ? `border-l ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}` 
            : `border-r ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Header */}
          <div className="flex flex-col border-b border-zinc-800 bg-[#111215] px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-white">
                    {isAr ? 'سلة المشتريات' : 'Shopping Cart'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span className="text-[11px] font-normal text-zinc-400">
                      {isAr ? 'تنتهي المهلة بعد 60 دقيقة غياب ⏱️' : 'Auto-expires in 60m of inactivity ⏱️'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
                  {cartCount} {isAr ? 'قطع' : 'items'}
                </span>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all border border-zinc-800 cursor-pointer"
                  aria-label={isAr ? 'إغلاق السلة' : 'Close cart'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-grow overflow-y-auto px-6 py-5 space-y-3.5 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-500">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {isAr ? 'السلة فارغة حالياً' : 'Your cart is currently empty'}
                </h3>
                <p className="text-zinc-400 text-xs max-w-xs leading-relaxed font-normal">
                  {isAr
                    ? 'تصفح معرض المنتجات وأضف ما ينقصك لتأسيس إنارة منزلك الفاخرة.'
                    : 'Explore our product gallery and add items to begin building your premium lighting setup.'}
                </p>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111215] border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 group"
                  >
                    {/* صورة مصغرة */}
                    <div className="w-14 h-14 rounded-lg bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-800 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                      />
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-grow min-w-0 z-10">
                      <h4 className="text-white font-bold text-xs truncate group-hover:text-blue-300 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-zinc-400 text-[11px] truncate mt-0.5 font-normal">
                        {item.description || (isAr ? 'لا يوجد وصف متاح' : 'No description')}
                      </p>

                      {/* سعر الصنف والعدد الإجمالي */}
                      {item.price ? (
                        <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                          <span className="text-emerald-400 text-xs font-bold">
                            {item.price.toFixed(2)} <span className="text-[10px] text-zinc-400">{isAr ? 'د.ل' : 'LYD'}</span>
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-zinc-400 text-[10px]">
                              ({isAr ? 'المجموع:' : 'Total:'} <span className="text-zinc-200 font-semibold">{(item.price * item.quantity).toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</span>)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-[10px] font-medium mt-1 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded inline-block">
                          {isAr ? '🔍 السعر يحدد مع المبيعات' : '🔍 Price upon request'}
                        </span>
                      )}

                      {/* معدلات الكميات */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded active:scale-90 transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-white font-bold text-xs px-2.5 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (item.stockQty !== undefined && item.quantity >= item.stockQty) {
                                alert(isAr
                                  ? `عذراً، تتوفر ${item.stockQty} قطعة فقط من هذا المنتج في المخزن حالياً.`
                                  : `Sorry, only ${item.stockQty} units of this product are currently available in stock.`);
                                return;
                              }
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded active:scale-90 transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        {item.stockQty !== undefined && (
                          <span className="text-[10px] text-zinc-400 font-normal">
                            {isAr ? `(المتوفر: ${item.stockQty})` : `(Stock: ${item.stockQty})`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                      title={isAr ? 'حذف المنتج' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* تفاصيل الدفع والتحويل المصرفي */}
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 text-right mt-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span>{isAr ? 'الحسابات المصرفية المعتمدة للتحويل والدفع:' : 'Approved Bank Transfer Accounts:'}</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    {/* الحساب الأول - مصرف الوحدة */}
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-300 font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          {isAr ? 'مصرف الوحدة' : 'Al-Wahda Bank'}
                        </span>
                        <span className="text-zinc-400 text-[10px]">{isAr ? 'معرض الانارة الحديثة-همالي قرقوم' : 'Modern Enarah Showroom'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-800">
                        <span className="font-mono font-bold text-zinc-200 tracking-wider text-xs">115007000090012</span>
                        <button
                          onClick={() => handleCopy('115007000090012')}
                          className="px-2 py-0.5 rounded text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === '115007000090012' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* الحساب الثاني - مصرف التجارة والتنمية */}
                    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-300 font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          {isAr ? 'مصرف التجارة والتنمية' : 'Bank of Commerce & Development'}
                        </span>
                        <span className="text-zinc-400 text-[10px]">{isAr ? 'مصطفي محمد سليمان قرقوم' : 'Mustafa Mohamed Qarqoum'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-800">
                        <span className="font-mono font-bold text-zinc-200 tracking-wider text-xs">0014264755001</span>
                        <button
                          onClick={() => handleCopy('0014264755001')}
                          className="px-2 py-0.5 rounded text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === '0014264755001' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* الملاحظة الجانبية الهامة */}
                  <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2 leading-relaxed font-normal">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    <p className="text-right">
                      {isAr 
                        ? 'نرجو تأكيد الطلب وإرسال قسيمة التحويل للمبيعات لتسجيل الحجز فوراً.'
                        : 'Please confirm your order and send the transfer receipt to sales.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-[#111215] space-y-3.5 relative z-20">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-400">{isAr ? 'عدد الأصناف المطلوبة:' : 'Total items:'}</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded">
                  {cartCount}
                </span>
              </div>

              {/* إجمالي سعر المواد المسعرة */}
              {pricedTotal > 0 && (
                <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
                  <span className="text-zinc-300 font-bold text-sm">{isAr ? 'إجمالي المواد المسعرة:' : 'Total priced items:'}</span>
                  <span className="text-white font-black text-xl">
                    {pricedTotal.toFixed(2)} <span className="text-xs font-normal text-zinc-400">{isAr ? 'د.ل' : 'LYD'}</span>
                  </span>
                </div>
              )}

              {/* Trust Advice Banner */}
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs text-center leading-relaxed font-normal flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  {isAr 
                    ? 'سيتم مراجعة وتأكيد طلبك وتفاصيله مباشرة مع المبيعات فور إرسال الرسالة.'
                    : 'Your order details will be directly verified and confirmed by sales upon sending.'}
                </span>
              </div>

              {/* زر تأكيد الطلب للواتساب */}
              <button
                onClick={() => sendOrderToWhatsApp(isAr)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>
                  {isAr ? 'تأكيد الطلب عبر الواتساب' : 'Confirm Order via WhatsApp'}
                </span>
              </button>

              {/* زر إفراغ السلة */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-zinc-400 hover:text-rose-400 rounded-lg text-xs transition-colors cursor-pointer"
              >
                {isAr ? 'إفراغ سلة التسوق' : 'Clear Shopping Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
