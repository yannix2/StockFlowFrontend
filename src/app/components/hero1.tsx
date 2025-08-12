"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import card1 from "../../shared/synchronisationL2.png";
import card2 from "../../shared/board.png";
import card3 from "../../shared/product.png";

const cards = [
  {
    id: 1,
    title: "WooCommerce Sync",
    description: "Automatic sync between online store and physical stock",
    image: card1,
    color: "from-green-500/20 to-green-600/10",
    icon: "🔄",
    status: "live"
  },
  {
    id: 2,
    title: "Dashboard",
    description: "Analytics of sales and stock levels",
    image: card2,
    color: "from-purple-500/20 to-purple-600/10",
    icon: "📈",
    status: "stable"
  },
  {
    id: 3,
    title: "Product Management",
    description: "Manage catalog and product variations",
    image: card3,
    color: "from-blue-500/20 to-blue-600/10",
    icon: "📦",
    status: "stable"
  }
];

const Particle = ({ x, y, size, color, delay }: { x: number; y: number; size: number; color: string; delay: number }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
        y: [0, -50],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 5,
        ease: "easeInOut",
      }}
    />
  );
};

export default function Hero2() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; color: string; delay: number }>
  >([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-rotate cards
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Create particles on card change
  useEffect(() => {
    if (cardRef.current) {
      const colors = ['bg-yellow-500/30', 'bg-purple-500/30', 'bg-blue-500/30', 'bg-green-500/30'];
      const newParticles = Array.from({ length: 8 }).map(() => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 30,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [currentIndex]);

  const navigateTo = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const cardVariants = {
    enter: (direction: string) => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
      rotate: direction === "right" ? 10 : -10,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        duration:0.3,
        },
    },
    exit: (direction: string) => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0,
      rotate: direction === "right" ? -10 : 10,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section className="relative bg-gray-950  text-white pt-12 md:pt-16 pb-12 md:pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-black"></div>
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-40 md:w-64 h-40 md:h-64 rounded-full bg-yellow-500/10 blur-lg md:blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-4xl my-10 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 md:mb-4"
          >
            <span className="text-yellow-400">
              Smarter Inventory
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="text-gray-300 text-xl sm:text-2xl md:text-3xl">For Modern Commerce</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-gray-400 max-w-xl mx-auto"
          >
            Eliminate overselling and stockouts with real-time inventory sync
          </motion.p>
        </div>

        {/* Card Carousel */}
        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex justify-center px-2"
              ref={cardRef}
            >
              <div
                className={`relative rounded-xl md:rounded-2xl shadow-lg overflow-hidden w-full max-w-sm h-[260px] sm:h-[300px] md:h-[350px] border border-gray-700/50 ${cards[currentIndex].color.replace('from-', 'bg-gradient-to-br from-')}`}
              >
                {/* Particle effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {particles.map((particle, i) => (
                    <Particle key={i} {...particle} />
                  ))}
                </div>

                {/* Card content */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="relative h-[50%]">
                    <Image
                      src={cards[currentIndex].image}
                      alt={cards[currentIndex].title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-bold ${
                              cards[currentIndex].status === "live"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {cards[currentIndex].status === "live" && (
                              <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                              </span>
                            )}
                            {cards[currentIndex].status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                          {cards[currentIndex].title}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-300">
                          {cards[currentIndex].description}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/login")}
                        className="self-start bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-1.5 md:p-2 transition-all hover:scale-110"
                        aria-label="Demo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </button>
                    </div>

                    <div className="mt-auto pt-2 md:pt-3">
                      <button
                        onClick={() => router.push("/setup")}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold py-1.5 md:py-2 px-4 md:px-6 rounded-full text-xs md:text-sm transition-all hover:shadow-md hover:shadow-yellow-400/20"
                      >
                        Try {cards[currentIndex].title}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation dots */}
          <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === index ? "bg-yellow-400 w-4 md:w-5" : "bg-gray-700 w-2 md:w-3"
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}