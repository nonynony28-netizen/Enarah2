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
      className={`fixed inset-0 z-[3000] flex justify-end transition-all duration-500 ${
        isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop overlay خلفية معتمة سريعة */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`absolute inset-0 bg-black/75 transition-opacity duration-300 cursor-pointer ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Cart Sidebar السلة الجانبية الزجاجية */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-[90%] sm:w-full sm:max-w-md h-full bg-[#071325] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between border-white/10 transition-transform duration-300 ease-out ${
          isAr 
            ? `border-l ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}` 
            : `border-r ${isCartOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* لمسات الضوء الجانبية */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f605_1px,transparent_1px),linear-gradient(to_bottom,#3b82f605_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* رأس السلة Header */}
          <div className="flex flex-col border-b border-white/10 bg-[#0a1b36] px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/30">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-xl text-white tracking-wide">
                    {isAr ? 'سلة المشتريات' : 'Shopping Cart'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-slate-300">
                      {isAr ? 'تنتهي المهلة بعد 60 دقيقة غياب ⏱️' : 'Auto-expires in 60m of inactivity ⏱️'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                  {cartCount} {isAr ? 'قطع' : 'items'}
                </span>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white active:scale-95 transition-all border border-white/10 cursor-pointer"
                  aria-label={isAr ? 'إغلاق السلة' : 'Close cart'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* قائمة العناصر Items List */}
          <div className="flex-grow overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  <ShoppingCart className="w-12 h-12 text-blue-400/60" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {isAr ? 'السلة فارغة حالياً' : 'Your cart is currently empty'}
                </h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-b from-[#0e2246]/90 to-[#091830]/90 border border-blue-500/15 hover:border-blue-500/40 transition-all duration-300 shadow-lg group hover:shadow-[0_4px_25px_rgba(59,130,246,0.15)] relative overflow-hidden"
                  >
                    {/* خلفية تضيء عند التمرير */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* صورة مصغرة */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden flex-shrink-0 border border-blue-400/20 relative shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = '/images/default-product.jpg' }}
                      />
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-grow min-w-0 z-10">
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-blue-300 transition-colors duration-300">
                        {item.name}
                      </h4>
                      <p className="text-slate-400 text-xs truncate mt-0.5">
                        {item.description || (isAr ? 'لا يوجد وصف متاح' : 'No description')}
                      </p>

                      {/* سعر الصنف والعدد الإجمالي */}
                      {item.price ? (
                        <div className="mt-2 flex flex-wrap items-baseline gap-2">
                          <span className="text-emerald-400 text-sm font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                            {item.price.toFixed(2)} <span className="text-[10px] font-semibold text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-slate-400 text-xs font-bold">
                              ({isAr ? 'المجموع:' : 'Total:'} <span className="text-blue-300">{(item.price * item.quantity).toFixed(2)} {isAr ? 'د.ل' : 'LYD'}</span>)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-bold mt-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md inline-block">
                          {isAr ? '🔍 السعر يحدد مع المبيعات' : '🔍 Price upon request'}
                        </span>
                      )}

                      {/* معدلات الكميات */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center bg-[#071325] border border-blue-500/20 rounded-xl p-0.5 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded-lg active:scale-90 transition-all cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white font-black text-xs px-3 min-w-[24px] text-center">
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
                            className="p-1 text-slate-400 hover:text-white hover:bg-blue-500/20 rounded-lg active:scale-90 transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.stockQty !== undefined && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {isAr ? `(المتوفر: ${item.stockQty})` : `(Stock: ${item.stockQty})`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 active:scale-95 cursor-pointer z-10"
                      title={isAr ? 'حذف المنتج' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* تفاصيل الدفع والتحويل المصرفي - بطاقة فاخرة كرت مصممة بعناية */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-slate-950/60 border border-blue-500/20 space-y-3 shadow-lg text-right mt-5 relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-xs font-black text-blue-300">
                    <Wallet className="w-4 h-4 text-blue-400" />
                    <span>{isAr ? 'الحسابات المصرفية المعتمدة للتحويل والدفع:' : 'Approved Bank Transfer Accounts:'}</span>
                  </div>
                  
                  <div className="space-y-2.5 text-xs">
                    {/* الحساب الأول - مصرف الوحدة */}
                    <div className="p-2.5 rounded-xl bg-[#061224]/80 border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-blue-300 font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          {isAr ? 'مصرف الوحدة' : 'Al-Wahda Bank'}
                        </span>
                        <span className="text-slate-300 font-medium text-[10px]">{isAr ? 'معرض الانارة الحديثة-همالي قرقوم' : 'Modern Enarah Showroom'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-blue-500/10">
                        <span className="font-mono font-black text-cyan-300 tracking-wider text-xs">115007000090012</span>
                        <button
                          onClick={() => handleCopy('115007000090012')}
                          className="px-2 py-1 rounded-md text-slate-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === '115007000090012' ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-300">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-blue-300" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* الحساب الثاني - مصرف التجارة والتنمية */}
                    <div className="p-2.5 rounded-xl bg-[#061224]/80 border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-blue-300 font-bold flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400" />
                          {isAr ? 'مصرف التجارة والتنمية' : 'Bank of Commerce & Development'}
                        </span>
                        <span className="text-slate-300 font-medium text-[10px]">{isAr ? 'مصطفي محمد سليمان قرقوم' : 'Mustafa Mohamed Qarqoum'}</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-blue-500/10">
                        <span className="font-mono font-black text-cyan-300 tracking-wider text-xs">0014264755001</span>
                        <button
                          onClick={() => handleCopy('0014264755001')}
                          className="px-2 py-1 rounded-md text-slate-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 transition-all text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedText === '0014264755001' ? (
                            <>
                              <Check className="w-3 h-3 text-green-400" />
                              <span className="text-green-300">{isAr ? 'تم النسخ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-blue-300" />
                              <span>{isAr ? 'نسخ' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* الملاحظة الجانبية الهامة */}
                  <div className="pt-2 border-t border-white/10 text-[11px] text-amber-300 flex items-center gap-2 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                    <p className="font-bold text-slate-200 text-right">
                      {isAr 
                        ? 'نرجو تأكيد الطلب وإرسال قسيمة التحويل للمبيعات لتسجيل الحجز فوراً.'
                        : 'Please confirm your order and send the transfer receipt to sales.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* الجزء السفلي للعمليات Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#071325]/95 backdrop-blur-2xl space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative z-20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-bold">{isAr ? 'عدد الأصناف المطلوبة:' : 'Total items:'}</span>
                <span className="text-white font-black text-lg bg-blue-500/20 border border-blue-400/30 px-3 py-0.5 rounded-full shadow-inner">
                  {cartCount}
                </span>
              </div>

              {/* إجمالي سعر المواد المسعرة */}
              {pricedTotal > 0 && (
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-slate-200 font-bold">{isAr ? 'إجمالي المواد المسعرة:' : 'Total priced items:'}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 font-black text-2xl drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                    {pricedTotal.toFixed(2)} <span className="text-xs font-normal text-slate-400">{isAr ? 'د.ل' : 'LYD'}</span>
                  </span>
                </div>
              )}

              {/* Trust Advice Banner */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs text-center leading-relaxed font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                <span>
                  {isAr 
                    ? 'سيتم مراجعة وتأكيد طلبك وتفاصيله مباشرة مع المبيعات فور إرسال الرسالة.'
                    : 'Your order details will be directly verified and confirmed by sales upon sending.'}
                </span>
              </div>

              {/* زر تأكيد الطلب للواتساب */}
              <button
                onClick={() => sendOrderToWhatsApp(isAr)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-2xl font-black text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.35)] border border-emerald-400/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 fill-current" />
                <span>
                  {isAr ? 'تأكيد الطلب عبر الواتساب' : 'Confirm Order via WhatsApp'}
                </span>
              </button>

              {/* زر إفراغ السلة */}
              <button
                onClick={clearCart}
                className="w-full py-2.5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/20 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer"
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
