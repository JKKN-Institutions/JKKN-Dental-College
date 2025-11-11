'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube
} from 'react-icons/fa';

export default function ContactUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id='contact'
      ref={ref}
      className='py-8 sm:py-12 md:py-16 bg-gradient-to-br from-primary-cream to-white'
    >
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className='text-center mb-12 sm:mb-16'
        >
          <h2 className='text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 px-4'>
            Get in <span className='text-primary-green'>Touch</span>
          </h2>
          <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4'>
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='space-y-8'
          >
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                Contact Information
              </h3>
              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0'>
                    <HiLocationMarker className='text-2xl text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      Address
                    </h4>
                    <p className='text-gray-600'>
                      JKKN Institution Campus
                      <br />
                      Komarapalayam, Namakkal District
                      <br />
                      Tamil Nadu, India - 638183
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0'>
                    <HiPhone className='text-2xl text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Phone</h4>
                    <p className='text-gray-600'>
                      +91 4288 268000
                      <br />
                      +91 4288 268001
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0'>
                    <HiMail className='text-2xl text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-1'>Email</h4>
                    <p className='text-gray-600'>
                      info@jkkn.ac.in
                      <br />
                      admissions@jkkn.ac.in
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary-green rounded-lg flex items-center justify-center flex-shrink-0'>
                    <HiClock className='text-2xl text-white' />
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-900 mb-1'>
                      Office Hours
                    </h4>
                    <p className='text-gray-600'>
                      Monday - Friday: 9:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 1:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Follow Us
              </h3>
              <div className='flex gap-4'>
                {[
                  { icon: FaFacebook, color: 'hover:bg-blue-600' },
                  { icon: FaTwitter, color: 'hover:bg-sky-500' },
                  { icon: FaInstagram, color: 'hover:bg-pink-600' },
                  { icon: FaLinkedin, color: 'hover:bg-blue-700' },
                  { icon: FaYoutube, color: 'hover:bg-red-600' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href='#'
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={`w-12 h-12 bg-gray-200 ${social.color} rounded-lg flex items-center justify-center text-gray-700 hover:text-white transition-all duration-300 hover:scale-110`}
                  >
                    <social.icon className='text-xl' />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Google Maps */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='rounded-2xl overflow-hidden shadow-lg h-80'
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3910.480819761799!2d77.72616278885495!3d11.445180000000011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9681da59f5845%3A0xa9782648005bb6f3!2sJKKN%20Institutions!5e0!3m2!1sen!2sin!4v1762753886217!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="JKKN Institutions Location"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className='bg-white rounded-2xl shadow-xl p-8'
            >
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                Send us a Message
              </h3>

              <div className='space-y-6'>
                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Full Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300'
                    placeholder='Your full name'
                  />
                </div>

                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Email Address *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300'
                    placeholder='your.email@example.com'
                  />
                </div>

                <div>
                  <label
                    htmlFor='phone'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300'
                    placeholder='+91 1234567890'
                  />
                </div>

                <div>
                  <label
                    htmlFor='subject'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Subject *
                  </label>
                  <select
                    id='subject'
                    name='subject'
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300'
                  >
                    <option value=''>Select a subject</option>
                    <option value='admission'>Admission Inquiry</option>
                    <option value='courses'>Course Information</option>
                    <option value='placement'>Placement Information</option>
                    <option value='facilities'>Facilities</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='message'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Message *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all duration-300 resize-none'
                    placeholder='Write your message here...'
                  />
                </div>

                <button
                  type='submit'
                  className='w-full bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl'
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
