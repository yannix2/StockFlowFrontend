"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../shared/stockflow-high-resolution-logo-grayscale-transparent.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black py-4 shadow-lg backdrop-blur-sm" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <Image
            src={logo}
            alt="StockFlow Logo"
            width={180}
            height={60}
            className="object-contain"
            priority
          />
        </Link> 

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "Features", path: "/features" },
            { name: "Pricing", path: "/pricing" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className="relative text-lg font-medium text-gray-300 hover:text-yellow-400 transition-colors group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-5 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30"
          >
            Login
          </Link>
          <button 
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-6 py-4 space-y-4">
            {[
              { name: "Home", path: "/" },
              { name: "Features", path: "/features" },
              { name: "Pricing", path: "/pricing" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <Link 
                key={item.path}
                href={item.path}
                className="block text-lg font-medium text-gray-300 hover:text-yellow-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              href="/login" 
              className="block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-5 py-2 rounded-lg transition-all duration-300 text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}