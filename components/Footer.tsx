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
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8 safe-bottom">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-primary-green mb-4">
              JKKN Institution
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
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
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-green rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
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
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-green transition-colors duration-300 flex items-center group"
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
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-green transition-colors duration-300 flex items-center group"
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
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <HiLocationMarker className="text-primary-green text-xl flex-shrink-0 mt-1" />
                <p className="text-gray-400 text-sm">
                  JKKN Institution Campus, Komarapalayam, Namakkal District,
                  Tamil Nadu - 638183
                </p>
              </div>
              <div className="flex items-center gap-3">
                <HiPhone className="text-primary-green text-xl flex-shrink-0" />
                <p className="text-gray-400 text-sm">+91 4288 268000</p>
              </div>
              <div className="flex items-center gap-3">
                <HiMail className="text-primary-green text-xl flex-shrink-0" />
                <p className="text-gray-400 text-sm">info@jkkn.ac.in</p>
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
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} JKKN Institution. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-green transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-green transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-green transition-colors duration-300"
              >
                Sitemap
              </a>
              <a
                href="/auth/login"
                className="text-gray-400 hover:text-primary-green transition-colors duration-300"
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
