// components/CompactTestimonialCarousel.tsx
'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import face1 from '../../shared/face1.png'
import face2 from '../../shared/face2.png';
import face3 from '../../shared/face3.webp';
const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "Owner, Boutique Éclat",
    content: "StockFlow cut our inventory time by 70%. The automated reordering feature alone is worth the subscription!",
    avatar: face3,
    rating: 5
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Operations Manager, TechGadgets",
    content: "From chaos to control in 2 weeks. The dashboard gives me real-time visibility I never had before.",
    avatar: face1,
    rating: 4

  },
  {
    id: 3,
    name: "Élodie P.",
    role: "CEO, GreenWear",
    content: "We reduced stockouts by 90% while cutting excess inventory. Game-changing analytics!",
    avatar:face2,
    rating: 4
  }
];

export default function CompactTestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-gradient-to-b from-white via-gray-100/30 to-white py-4 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Prooved by <span className="text-yellow-600">businesses</span>
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Join 5+ companies transforming their inventory management
          </p>
        </motion.div>

        <div 
          className="relative h-[320px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[currentIndex].id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex justify-center"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full h-full flex flex-col border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <Quote className="w-8 h-8 text-yellow-500/20" />
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${i < testimonials[currentIndex].rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-gray-800 mb-6 flex-grow leading-relaxed text-lg"
                >
                  "{testimonials[currentIndex].content}"
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-4"
                >
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-yellow-100">
                    <Image 
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonials[currentIndex].name}</p>
                    <p className="text-gray-600 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-4  right-1/8 transform -translate-x-1/2 flex gap-4 items-center">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            
            <div className="flex gap-1.5 ">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-yellow-600 w-6' : 'bg-gray-200 w-2'}`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}