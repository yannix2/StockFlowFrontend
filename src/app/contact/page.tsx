'use client';
import { motion } from 'framer-motion';
import ContactForm from '../components/contactForm';
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';
import Image from 'next/image';
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-20 md:pb-28 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute top-8 left-8">
           <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
            
            <Image src={logo} width={200} height={200} alt='stockflow logo'  ></Image>
            </div>
           </Link> 
           
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 mb-6">
              <span className="text-yellow-400 text-sm font-medium">We're here to help</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Get in </span>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Our team is ready to assist you. Reach out and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative md:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="">
            {/* Enhanced Contact Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="lg:col-span-1"
            >
              <div className="bg-yellow-50 rounded-2xl  p-8 md:p-10 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
                <div className="mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Send us a message
                  </h2>
                  <p className=" text-black text-lg">
                    Fill out the form and we'll get back to you promptly
                  </p>
                </div>
                <ContactForm />
              </div>
            </motion.div>

            
          </div>
        </div>
      </section>

      {/* Premium Map Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6"
            >
              <MapPin className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Our Location</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Visit Our Office
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              We'd love to welcome you at our Tunis headquarters
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group"
          >
            <div className="aspect-w-16 aspect-h-9 w-full h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1662576.600185415!2d9.095307373977214!3d35.523562600000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa089b87f8141e6a9%3A0xedc701426daab38f!2sSerious%20Consulting!5e0!3m2!1sfr!2stn!4v1754958063685!5m2!1sfr!2stn"
                height="100%"
                width="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale group-hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <Link
                href="https://maps.app.goo.gl/3KsjWLKXZk3oNyb47"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 group/button"
              >
                <MapPin className="h-5 w-5 mr-2 group-hover/button:animate-pulse" />
                <span>Get Directions</span>
                <ArrowRight className="h-5 w-5 ml-2 opacity-0 group-hover/button:opacity-100 group-hover/button:translate-x-1 transition-all" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-colors">
              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                <span className="bg-yellow-500/10 p-1.5 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </span>
                <span>Visiting Hours</span>
              </h3>
              <p className="text-gray-300">
                Monday to Friday: 9AM - 5PM<br />
                Weekends: By appointment
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-colors">
              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                <span className="bg-yellow-500/10 p-1.5 rounded-lg">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                </span>
                <span>Parking</span>
              </h3>
              <p className="text-gray-300">
                Free parking available<br />
                Look for StockFlow signage
              </p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition-colors">
              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                <span className="bg-yellow-500/10 p-1.5 rounded-lg">
                  <Phone className="h-5 w-5 text-yellow-400" />
                </span>
                <span>Before Visiting</span>
              </h3>
              <p className="text-gray-300">
                Call ahead for special arrangements<br />
                +216 42 606 825
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}