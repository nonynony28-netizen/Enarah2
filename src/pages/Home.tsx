      {/* 1. الواجهة الترحيبية بالفيديو */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* الفيديو الطولي باستخدام Streamable خفي وذكي */}
        <div className="absolute inset-0 w-full h-full z-0 bg-[#0a192f] overflow-hidden flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 w-[250vw] h-[150vh] md:w-[120vw] md:h-[150vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <iframe
              // رابط Streamable الخاص بك مع خصائص (تشغيل تلقائي، بدون تحكم، تكرار، كتم الصوت)
              src="https://streamable.com/e/lm701e?autoplay=1&nocontrols=1&muted=1&loop=1&title=0&byline=0&portrait=0"
              frameBorder="0"
              allow="autoplay; fullscreen"
              className="w-full h-full object-cover opacity-50"
              style={{ transform: "translateZ(0)" }}
            />
          </div>
          {/* تدرج لوني لدمج أطراف الفيديو مع الموقع وللحفاظ على وضوح النص */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/40 via-transparent to-[#0a192f] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-10 md:mt-20">
          <div className="p-6 md:p-12 transition-all">
            {/* عنوان بوهج أزرق نيون */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight" style={glowingTitleStyle}>
              الإنارة <span className="text-blue-300">الحديثة</span>
            </h1>
            <p className="text-base md:text-2xl text-blue-50/90 mb-10 max-w-3xl mx-auto leading-relaxed font-medium px-2 shadow-sm">
              كل ما تحتاجه من الإضاءة والتأسيس الكهربائي بجودة عالمية وحلول متكاملة تلبي تطلعاتك
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-5">
              <Link to="/products" className="group relative px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-blue-600 text-white font-bold text-base md:text-lg rounded-2xl transition-all duration-300 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] flex items-center justify-center gap-3">
                استعرض المنتجات
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </Link>
              <Link to="/contact" className="px-6 py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-white/5 border border-white/10 text-white font-bold text-base md:text-lg rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>
