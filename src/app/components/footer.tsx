// components/Footer.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const socialLinks = [
    { 
      icon: <Facebook className="w-4 h-4" />, 
      url: "https://www.facebook.com/y4nnix", 
      name: "Facebook",
      color: "hover:text-blue-500"
    },
    { 
      icon: <Twitter className="w-4 h-4" />, 
      url: "https://x.com/Y4nnix22", 
      name: "Twitter",
      color: "hover:text-blue-400"
    },
    { 
      icon: <Instagram className="w-4 h-4" />, 
      url: "#", 
      name: "Instagram",
      color: "hover:text-pink-500"
    },
    { 
      icon: <Linkedin className="w-4 h-4" />, 
      url: "https://www.linkedin.com/in/yassine-khiari-111150255", 
      name: "LinkedIn",
      color: "hover:text-blue-600"
    },
    { 
      icon: <Mail className="w-4 h-4" />, 
      url: "mailto:club.tunivisonstekup@gmail.com", 
      name: "Email",
      color: "hover:text-yellow-500"
    }
  ];

  const footerLinks = [
    { title: "Product", links: [
      { name: "Features", url: "/features" },
      { name: "Pricing", url: "/pricing" },
      { name: "Integrations", url: "/features" }
    ]},
    { title: "Company", links: [
      { name: "About", url: "/about" },
      { name: "Blog", url: "#" },
      { name: "Careers", url: "#" }
    ]},
    { title: "Resources", links: [
      { name: "Help Center", url: "#" },
      { name: "Tutorials", url: "#" },
      { name: "API Docs", url: "#" }
    ]}
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    console.log("Subscribed with:", email);
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800 relative">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full shadow-lg z-50 transition-all"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <span className="bg-yellow-600 w-6 h-6 rounded-md flex items-center justify-center text-black font-bold">S</span>
              StockFlow
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The complete inventory management solution for modern businesses.
            </p>
            
            {/* Social Links - Enhanced */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">Connect with us</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 bg-gray-900 hover:bg-gray-800 px-3 py-2 rounded-lg border border-gray-800 transition-all duration-200 ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                    <span className="text-xs">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
              className="space-y-5"
            >
              <h4 className="text-white font-medium text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * linkIndex }}
                  >
                    <Link href={link.url} className="group text-gray-400 hover:text-yellow-500 transition-colors duration-200 flex items-center gap-1.5 text-sm">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-5"
          >
            <h4 className="text-white font-medium text-sm uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm">
              Subscribe to get updates and exclusive offers.
            </p>
            
            {isSubscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/30 border border-green-800 text-green-400 p-3 rounded-lg text-sm"
              >
                Thank you for subscribing!
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-800 my-12"
        />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-xs">
            © {currentYear} StockFlow Technologies. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors duration-200 text-xs">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors duration-200 text-xs">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-yellow-500 transition-colors duration-200 text-xs">
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}