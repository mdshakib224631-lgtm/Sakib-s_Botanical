import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, ArrowRight, Settings } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroShowcaseProps {
  slides: HeroSlide[];
  onSelectCategory: (categorySlug: string) => void;
  isAdmin?: boolean;
  onOpenAdminSlides?: () => void;
  slideIntervalSeconds?: number;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  slides,
  onSelectCategory,
  isAdmin,
  onOpenAdminSlides,
  slideIntervalSeconds = 5,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const durationSec = Math.max(2, Number(slideIntervalSeconds) || 5);

  // Auto-advance slides dynamically based on admin-configured interval
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, durationSec * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length, durationSec]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative bg-[#201c19] text-[#faf8f5] overflow-hidden min-h-[480px] lg:min-h-[560px] flex items-center">
      {/* Background Image Slides Showcase */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Dynamic Image with Vignette & Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#181513] via-[#181513]/80 to-transparent z-10" />
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
          />
        </div>
      ))}

      {/* Hero Slide Overlay Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="max-w-xl space-y-6">
          
          {/* Tag */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#e8beac]/20 text-[#e8beac] border border-[#e8beac]/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {currentSlide.tag || 'FEATURED COLLECTION'}
            </span>
          </div>

          {/* Dynamic Title */}
          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#faf8f5] drop-shadow-md">
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#d8c2b5] leading-relaxed font-light">
            {currentSlide.subtitle}
          </p>

          {/* Action CTA & Navigation */}
          <div className="pt-4 flex items-center gap-4 flex-wrap">
            <button
              onClick={() => {
                if (currentSlide.targetCategory) {
                  onSelectCategory(currentSlide.targetCategory.toLowerCase());
                } else {
                  onSelectCategory('all');
                }
              }}
              className="group inline-flex items-center gap-2 bg-[#c97a7e] hover:bg-[#b0666a] text-white px-7 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>{currentSlide.buttonText || 'Discover Collection'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Quick Slide Index Indicator */}
            <span className="text-xs text-[#a89d95] font-mono tracking-widest pl-2">
              0{currentIndex + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Slide Controls & Pagination Bar */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-4 bg-[#181513]/70 backdrop-blur-md p-2 rounded-full border border-white/10">
        
        {/* Play/Pause Auto-slide Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 text-[#d8c2b5] hover:text-white transition-colors"
          title={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-white/20" />

        {/* Previous Slide */}
        <button
          onClick={handlePrev}
          className="p-2 text-[#d8c2b5] hover:text-white transition-colors"
          aria-label="Previous Cosmetic Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-1.5 px-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-[#c97a7e]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Slide */}
        <button
          onClick={handleNext}
          className="p-2 text-[#d8c2b5] hover:text-white transition-colors"
          aria-label="Next Cosmetic Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
          <div
            key={currentIndex}
            className="h-full bg-[#c97a7e] animate-[progress_5s_linear]"
            style={{
              animation: 'progress 5s linear infinite'
            }}
          />
        </div>
      )}
    </section>
  );
};
