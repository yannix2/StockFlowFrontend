// app/page.tsx
"use client";
import Navbar from "@/app/components/navbar";
import Hero from "@/app/components/hero1";
import Footer from "@/app/components/footer";
import WaveDivider from "./components/waveDivider";
import StockFlowInfoSection from "./components/whatisStockflow";
import OfferSection from "./components/offerSection";
import TestimonialSection from "./components/testimonialsSection";
import TestimonialsCarousel from "./components/testimonialsFeedback";
import ContactForm from "./components/ContactForm";
export default function Home() {
  return (
    <main className=" bg-white text-black">
      <Navbar />
      <Hero /> 
      <WaveDivider />
      <StockFlowInfoSection/>
      <OfferSection />
      <TestimonialSection />
      <TestimonialsCarousel/>
      <div className='h-1 bg-gradient-to-r from-white via-gray-900 my-20 to-white '></div>
      <ContactForm />
      <Footer />
    </main>
  );
}
