"use client";
import { Package, ShoppingCart, ShieldCheck, BarChart2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import dashboardImage from "../../shared/Mar-Business_1.jpg";

const features = [
  {
    icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Product Management",
    description: "Organize inventory with real-time updates",
  },
  {
    icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Order Tracking",
    description: "Centralized view of all orders",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Team Permissions",
    description: "Granular access controls",
  },
  {
    icon: <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Business Analytics",
    description: "Actionable sales insights",
  },
  {
    icon: <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />,
    title: "Real-time Sync",
    description: "Sync across all channels",
  },
];


export default function StockflowInfoSection() {
  return (
    <section className="relative text-gray-900 py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
    

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg border border-gray-200">
            <Image
              src={dashboardImage}
              alt="StockFlow Dashboard"
              className="w-full h-auto object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="space-y-5 sm:space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl  text-gray-900 leading-tight mb-3 sm:mb-4">
              <span className="font-bold">Inventory</span> <span className="text-yellow-500">Control</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Streamline your stock management with our intuitive platform.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2 sm:space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-3 bg-white rounded-md sm:rounded-lg border border-gray-200 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  y: -1,
                  borderLeft: "2px solid #f59e0b"
                }}
              >
                <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-md text-yellow-600 border border-yellow-100">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.button
            onClick={() => window.location.href = "/features"}
            className="mt-4 sm:mt-6 bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600 text-white font-medium py-2 sm:py-2.5 px-5 sm:px-6 rounded-md sm:rounded-lg shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore more
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 