import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="h-8 w-8 text-primary-400" />
              <span className="font-bold text-xl">E-Waste Loop</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Closing the loop on e-waste through traceable, QR-powered responsible recycling. 
              Join us in creating a sustainable future for electronic waste management.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-primary-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><Link to="/features" className="text-gray-300 hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link to="/partnerships" className="text-gray-300 hover:text-primary-400 transition-colors">Partnerships</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-primary-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">info@ewasteloop.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300">123 Green St, Eco City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 E-Waste Loop. All rights reserved. | 
            <Link to="/privacy" className="hover:text-primary-400 ml-1">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-primary-400 ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;