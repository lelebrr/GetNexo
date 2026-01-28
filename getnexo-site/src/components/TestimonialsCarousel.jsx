import React, { useState, useEffect, useRef, useCallback } from 'react';

const testimonialsData = [
    {
        name: "Joao do Tenis",
        handle: "@joao_do_tenis",
        company: "Dono da Loja de Calçados",
        photo: "https://i.pravatar.cc/60?u=joao",
        quote: "O AR vendeu 200 pares em 1 dia. Nunca vi nada igual no meu checkout.",
        results: "+R$ 42k/mês",
        resultLabel: "faturamento extra",
        verifiedByGetNexo: true
    },
    {
        name: "Mariana Silva",
        handle: "@mari_modaplus",
        company: "CEO da ModaPlus",
        photo: "https://i.pravatar.cc/60?u=mari",
        quote: "Setup em 12 minutos e já estava vendendo automaticamente. Economia real de tempo e dinheiro.",
        results: "R$ 8.5k",
        resultLabel: "economia/mês",
        verifiedByGetNexo: true
    },
    {
        name: "Roberto Santos",
        handle: "@robertotech",
        company: "Proprietário TechStore",
        photo: "https://i.pravatar.cc/60?u=roberto",
        quote: "O PIX integrado é show! Clientes pagam direto no chat sem fricção.",
        results: "98%",
        resultLabel: "conversão",
        verifiedByGetNexo: true
    },
    {
        name: "Ana Oliveira",
        handle: "@ana_oliveira",
        company: "CEO da ScaleTech",
        photo: "https://i.pravatar.cc/60?u=ana",
        quote: "Com a IA generativa do GetNexo, meu WhatsApp atende 3.200% mais clientes sem contratar ninguém.",
        results: "+3.200%",
        resultLabel: "escalabilidade",
        verifiedByGetNexo: true
    },
    {
        name: "Pedro Lima",
        handle: "@pedro_lima",
        company: "Dono da Loja Digital",
        photo: "https://i.pravatar.cc/60?u=pedro",
        quote: "Instalação em 12 minutos, zero mensalidade. Meu negócio já fatura sozinho enquanto durmo.",
        results: "12 min",
        resultLabel: "setup",
        verifiedByGetNexo: true
    },
    {
        name: "Julia Costa",
        handle: "@julia_costa",
        company: "E-commerce Manager",
        photo: "https://i.pravatar.cc/60?u=julia",
        quote: "O PIX no chat fechou 98% das vendas. Clientes pagam direto sem sair do WhatsApp.",
        results: "Zero",
        resultLabel: "abandono",
        verifiedByGetNexo: true
    }
];

const TestimonialsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [prevTranslate, setPrevTranslate] = useState(0);
    const carouselRef = useRef(null);
    const autoPlayRef = useRef(null);

    // Responsive Layout
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(1);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate max index based on items per page
    // For 6 items:
    // Mobile (1 per page): 0 to 5 (6 dots)
    // Desktop (3 per page): 0 to 3 (Can scroll 4 times: 0-2, 1-3, 2-4, 3-5) OR 0 to 1 (2 pages)?
    // Standard carousel behavior: Scroll one by one or page by page?
    // User asked: "Mostre 3 depoimentos por vez no desktop".
    // Let's scroll one by one for smooth feeling.
    const maxIndex = Math.max(0, testimonialsData.length - itemsPerPage);

    // Navigation Logic
    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    const goToSlide = (index) => {
        // Clamp index
        const safeIndex = Math.min(Math.max(0, index), maxIndex);
        setCurrentIndex(safeIndex);
    };

    // Auto Play
    const startAutoPlay = useCallback(() => {
        stopAutoPlay();
        autoPlayRef.current = setInterval(nextSlide, 5000);
    }, [nextSlide]);

    const stopAutoPlay = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    }, []);

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, [startAutoPlay, stopAutoPlay]);

    // Touch / Swipe Logic
    const handleTouchStart = (e) => {
        stopAutoPlay();
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        // Optional: Add resistance or live preview of drag
    };

    const handleTouchEnd = (e) => {
        setIsDragging(false);
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) prevSlide();
            else nextSlide();
        }
        startAutoPlay();
    };

    // Main Container Style
    // We translate by percentage relative to one item width
    // Item width is 100% / itemsPerPage
    // So translate is currentIndex * (100 / itemsPerPage)

    return (
        <div
            className="relative w-full group"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Container */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1)"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
                    }}
                >
                    {testimonialsData.map((t, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 px-3 md:px-4 box-border"
                            style={{ width: `${100 / itemsPerPage}%` }}
                        >
                            <div className="h-full bg-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-300 flex flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <img
                                            src={t.photo}
                                            alt={t.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/30"
                                            loading="lazy"
                                        />
                                        {t.verifiedByGetNexo && (
                                            <div className="absolute -bottom-1 -right-1 bg-cyan-400 text-black rounded-full p-0.5" title="Verificado">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight">{t.name}</h3>
                                        <span className="text-cyan-400 text-sm">{t.handle}</span>
                                    </div>
                                </div>

                                <div className="mb-4 pt-4 border-t border-white/5">
                                    <span className="block text-3xl font-black text-white tracking-tight">{t.results}</span>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t.resultLabel}</span>
                                </div>

                                <p className="text-slate-300 italic text-sm md:text-base leading-relaxed flex-grow">
                                    "{t.quote}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button
                onClick={prevSlide}
                className="hidden lg:flex absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-cyan-500/30 rounded-full items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-lg z-10"
                aria-label="Anterior"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
                onClick={nextSlide}
                className="hidden lg:flex absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-cyan-500/30 rounded-full items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-lg z-10"
                aria-label="Próximo"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Dots Pagination - Centered Items */}
            <div className="mt-8 flex justify-center gap-2" role="navigation" aria-label="Navegação do slider de depoimentos">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx
                            ? 'w-8 bg-cyan-400'
                            : 'w-2 bg-slate-700 hover:bg-slate-600'
                            }`}
                        aria-label={`Ir para slide ${idx + 1}`}
                        aria-current={currentIndex === idx ? 'true' : 'false'}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialsCarousel;
