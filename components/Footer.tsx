"use client";

import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Courses", href: "#institution" },
    { name: "Admissions", href: "#admission" },
    { name: "Placements", href: "#placements" },
  ];

  const resources = [
    { name: "Facilities", href: "#facilities" },
    { name: "Campus Life", href: "#campus-videos" },
    { name: "Career", href: "#career" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (
    <footer className="relative bg-primary-green/95 backdrop-blur-xl text-white pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 safe-bottom overflow-hidden">
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-green via-primary-green/90 to-primary-green/80"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-yellow/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-cream/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-primary-yellow mb-4">
              JKKN Institution
            </h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              Empowering students with quality education, innovative teaching
              methods, and world-class facilities since 1998.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaYoutube, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary-yellow hover:border-primary-yellow rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-yellow">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-primary-yellow transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all duration-300">
                      →
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-yellow">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-primary-yellow transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all duration-300">
                      →
                    </span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-primary-yellow">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HiLocationMarker className="text-primary-yellow text-xl flex-shrink-0 mt-1" />
                <p className="text-white/80 text-sm">
                  JKKN Institution Campus, Komarapalayam, Namakkal District,
                  Tamil Nadu - 638183
                </p>
              </div>
              <div className="flex items-center gap-3">
                <HiPhone className="text-primary-yellow text-xl flex-shrink-0" />
                <p className="text-white/80 text-sm">+91 4288 268000</p>
              </div>
              <div className="flex items-center gap-3">
                <HiMail className="text-primary-yellow text-xl flex-shrink-0" />
                <p className="text-white/80 text-sm">info@jkkn.ac.in</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/20 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm text-center md:text-left">
              © {currentYear} JKKN Institution. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-white/80 hover:text-primary-yellow transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-primary-yellow transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-white/80 hover:text-primary-yellow transition-colors duration-300"
              >
                Sitemap
              </a>
              <a
                href="/auth/login"
                className="text-white/80 hover:text-primary-yellow transition-colors duration-300"
              >
                Admin
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
