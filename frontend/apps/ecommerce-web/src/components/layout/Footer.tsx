import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { href: '/products', label: 'Products' },
        { href: '/categories', label: 'Categories' },
        { href: '/subscriptions', label: 'Subscriptions' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { href: '/help', label: 'Help Center' },
        { href: '/returns', label: 'Returns & Refunds' },
        { href: '/shipping', label: 'Shipping Info' },
        { href: '/faq', label: 'FAQ' },
        { href: '/support', label: 'Contact Support' },
      ]
    },
    {
      title: 'Account',
      links: [
        { href: '/account', label: 'My Account' },
        { href: '/orders', label: 'Order History' },
        { href: '/wishlist', label: 'Wishlist' },
        { href: '/addresses', label: 'Address Book' },
        { href: '/notifications', label: 'Notifications' },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">శ్రీ</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sri Venkateswara</h3>
                <p className="text-green-300">Organic Foods</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Fresh, organic groceries delivered to your doorstep. We bring you the finest 
              quality produce from local farmers, ensuring healthy and sustainable living.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPinIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <PhoneIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <EnvelopeIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">hello@srivenkateswaraorganics.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ClockIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">Daily 6:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-lg font-semibold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} Sri Venkateswara Organic Foods. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}