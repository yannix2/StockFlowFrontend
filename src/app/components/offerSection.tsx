"use client";

import { Package, Headset, Wrench, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const BubbleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // Create bubbles
    const bubbles: {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      color: string;
      drift: number;
    }[] = [];

    for (let i = 0; i < 25; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 25 + 15,
        speed: Math.random() * 0.8 + 0.3,
        opacity: Math.random() * 0.18 + 0.05,
       color: Math.random() > 0.7 ? "rgba(0, 0, 0, 0.1)" : "rgba(253, 224, 71, 0.7)",
        drift: Math.random() * 2 - 1
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bubbles
      bubbles.forEach(bubble => {
        // Update position
        bubble.y -= bubble.speed;
        bubble.x += bubble.drift * 0.5;
        
        // Reset bubble to bottom when it goes off screen
        if (bubble.y < -bubble.size || 
            bubble.x < -bubble.size || 
            bubble.x > canvas.width + bubble.size) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.globalAlpha = bubble.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default function OfferSection() {
  const router = useRouter();
  const plans = [
    {
      title: "Starter",
      price: "0 €",
      period: "/year",
      features: [
        { text: "3 Admin Accounts", icon: User },
        { text: "50 Product Listings", icon: Package },
        { text: "Standard Support (5/7)", icon: Headset },
        { text: "Basic Features", icon: Wrench },
      ],
      featured: false,
      cta: "Start Free"
    },
    {
      title: "Professional",
      price: "1 000 €",
      period: "/year",
      features: [
        { text: "10 Admin Accounts", icon: User },
        { text: "1 000 Product Listings", icon: Package },
        { text: "Priority Support (24/7)", icon: Headset },
        { text: "Advanced Analytics", icon: Wrench },
      ],
      featured: true,
      cta: "Get Professional"
    },
    {
      title: "Enterprise",
      price: "1 500 €",
      period: "/year",
      features: [
        { text: "Unlimited Admins", icon: User },
        { text: "Unlimited Products", icon: Package },
        { text: "Dedicated Account Manager", icon: Headset },
        { text: "Full Feature Access", icon: Wrench },
      ],
      featured: false,
      cta: "Contact Sales"
    },
  ];

  const handleGetStarted = (planTitle: string) => {
    if (planTitle === "Enterprise") {
      router.push('/contact');}
    else if (planTitle === "Professional") {
      router.push('/login');
    }
    else {
      router.push('/login');
    }
    
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-gray-100 to-white overflow-hidden">
      {/* Bubble background with chart elements */}
      <BubbleBackground />
      
      {/* Section content */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-black">Our</span> <span className="text-yellow-500">Offers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent pricing with all the features you need to grow your business
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex flex-col h-full ${
                plan.featured ? "md:-translate-y-4" : ""
              }`}
            >
              <div
                className={`flex-1 bg-white rounded-xl p-8 shadow-lg border border-gray-200 flex flex-col transition-all hover:shadow-xl ${
                  plan.featured ? "ring-2 ring-yellow-400 bg-gradient-to-b from-white to-gray-50" : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.title}
                  </h3>
                  <div className="flex items-end gap-1">
                    <p className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </p>
                    <p className="text-gray-500 text-lg mb-1">
                      {plan.period}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className="text-yellow-500 w-5 h-5" />
                        </div>
                        <span className="text-gray-700">
                          {feature.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <motion.button
                  onClick={() => handleGetStarted(plan.title)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.featured
                      ? "bg-yellow-500 text-white hover:cursor-pointer hover:bg-yellow-600"
                      : "bg-gray-900 text-white hover:cursor-pointer hover:bg-gray-800"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center text-gray-600"
        >
          <p>Need custom solutions? <a href="/contact" className="text-yellow-600 hover:underline font-medium">Contact our team</a></p>
        </motion.div>
      </section>
    </div>
  );
}