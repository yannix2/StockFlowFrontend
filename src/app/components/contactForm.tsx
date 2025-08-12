// components/ContactForm.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Send, MapPin, Mail, Phone, CheckCircle, Loader2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
};

export default function ContactForm() {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitState('idle');

    try {
      // Send to your backend API
      const adminEmailResponse = await fetch('https://stockflowbackend-2j27.onrender.com/mail/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'club.tunivisonstekup@gmail.com',
          from: data.email,
          subject: `New Contact Form Submission from ${data.name}`,
          text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || 'N/A'}\nPhone: ${data.phone || 'N/A'}\n\nMessage:\n${data.message}`,
          replyTo: data.email
        })
      });

      if (!adminEmailResponse.ok) throw new Error('Failed to send message to admin');

      // Send confirmation to client
      const clientEmailResponse = await fetch('https://stockflowbackend-2j27.onrender.com/mail/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.email,
          from: 'club.tunivisonstekup@gmail.com',
          subject: 'We received your message!',
          text: `Dear ${data.name},\n\nThank you for contacting Tunivisions Tekup. We've received your message and will respond within 24-48 hours.\n\nYour message:\n${data.message}\n\nBest regards,\nThe Tunivisions Tekup Team`,
          replyTo: 'club.tunivisonstekup@gmail.com'
        })
      });

      if (!clientEmailResponse.ok) throw new Error('Failed to send confirmation email');

      setSubmitState('success');
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-b  py-10 px-6 lg:px-8 overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-yellow-100/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-1/3 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 bg-gray-100/70 border border-gray-200 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-5 h-5 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-medium text-gray-700">We respond within 24 hours</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-5 leading-tight">
            Contact <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Our Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our services? Reach out and we'll connect you with the right solution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-white/30 rounded-2xl shadow-2xl shadow-yellow-500/10 -z-10"></div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 border border-gray-200/70 shadow-lg overflow-hidden">
              {submitState === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-10"
                >
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100/80 mb-6">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">Message sent successfully!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We've sent a confirmation to your email. Our team will respond within 24 hours.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSubmitState('idle')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all"
                  >
                    Send another message
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h3>
                    <p className="text-gray-600">Fill out the form below and we'll get back to you</p>
                  </div>

                  <AnimatePresence>
                    {submitState === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8"
                      >
                        There was an error sending your message. Please try again later.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          type="text"
                          className={`w-full px-5 py-3.5 rounded-xl border ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-yellow-200'} focus:ring-2 focus:border-yellow-500 transition-all duration-200`}
                          placeholder="John Smith"
                        />
                        {errors.name && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.name.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          id="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          type="email"
                          className={`w-full px-5 py-3.5 rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-yellow-200'} focus:ring-2 focus:border-yellow-500 transition-all duration-200`}
                          placeholder="you@company.com"
                        />
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 text-sm text-red-600"
                          >
                            {errors.email.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                          Company
                        </label>
                        <input
                          id="company"
                          {...register('company')}
                          type="text"
                          className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-200"
                          placeholder="Your Company"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                      >
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          id="phone"
                          {...register('phone')}
                          type="tel"
                          className="w-full px-5 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-200"
                          placeholder="+216 12 345 678"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        {...register('message', { required: 'Message is required' })}
                        rows={6}
                        className={`w-full px-5 py-3.5 rounded-xl border ${errors.message ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-yellow-200'} focus:ring-2 focus:border-yellow-500 transition-all duration-200`}
                        placeholder="Tell us about your project or inquiry..."
                      ></textarea>
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-sm text-red-600"
                        >
                          {errors.message.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <motion.button
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 4px 20px -6px rgba(234, 179, 8, 0.5)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Sending your message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <p className="text-lg text-gray-600 max-w-md">
                Connect with us through any of these channels. Our dedicated team is ready to assist you with your inquiries.
              </p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-start gap-6"
              >
                <div className="bg-yellow-100 p-4 rounded-xl flex-shrink-0 shadow-sm border border-yellow-200/50">
                  <Mail className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Email</h4>
                  <a 
                    href="mailto:club.tunivisonstekup@gmail.com" 
                    className="text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                  >
                    club.tunivisonstekup@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-6"
              >
                <div className="bg-yellow-100 p-4 rounded-xl flex-shrink-0 shadow-sm border border-yellow-200/50">
                  <Phone className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Phone</h4>
                  <a 
                    href="tel:+21642606825" 
                    className="text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                  >
                    +216 42 606 825
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-start gap-6"
              >
                <div className="bg-yellow-100 p-4 rounded-xl flex-shrink-0 shadow-sm border border-yellow-200/50">
                  <MapPin className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600">
                    Street 4250,<br />
                    Tunis, Tunisia
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-8 border-t border-gray-200/70"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-5">Working Hours</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/50">
                  <p className="text-gray-500 text-sm mb-2">Monday - Friday</p>
                  <p className="text-gray-900 font-medium">8:00 AM - 6:00 PM</p>
                </div>
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/50">
                  <p className="text-gray-500 text-sm mb-2">Weekends</p>
                  <p className="text-gray-900 font-medium">By appointment</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}