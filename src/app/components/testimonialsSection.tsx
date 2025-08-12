// components/CallToActionSection.tsx
import { motion } from "framer-motion";
import Image from "next/image";
import test from '../../shared/visualisation-dynamique-des-donnees-en-3d.jpg'
export default function CallToActionSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Organic shape accents */}
      
      
      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              <span className="block">Stop wasting time</span>
              <span className="block text-yellow-600">Start growing smarter</span>
            </h2>
            
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join 5+ businesses using StockFlow to automate their inventory. <br />
              Get your first 14 days free - no strings attached.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 hover:cursor-pointer bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"
                onClick={()=> window.location.href = "/login"}
              >
                Get Started - Free
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </motion.button>
            </div>
            
            <div className="mt-8 flex items-center flex-wrap gap-x-6 gap-y-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SOC 2 Certified
              </div>
            </div>
          </motion.div>
          
          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative aspect-[16/10] rounded-2xl bg-gray-50 shadow-xl overflow-hidden border border-gray-200"
          >
            {/* Replace with your actual image */}
            <div className="absolute inset-0 flex items-center justify-center   ">
              <div className="text-center p-8">
                <Image
                  src={test}
                  alt="Call to Action Illustration"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
               
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}