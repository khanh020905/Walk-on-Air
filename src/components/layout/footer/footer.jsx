import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                            <ShoppingBag size={20} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold">Sole & Style</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                        Join our newsletter to get exclusive offers, sneak peeks at new collections, and style tips straight to your inbox.
                    </p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Enter your email" className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-600" />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">Subscribe</button>
                    </div>
                </div>

                {/* Links Columns */}
                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Shop</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-blue-600">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-blue-600">Best Sellers</a></li>
                        <li><a href="#" className="hover:text-blue-600">Men</a></li>
                        <li><a href="#" className="hover:text-blue-600">Women</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Support</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-blue-600">Order Status</a></li>
                        <li><a href="#" className="hover:text-blue-600">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-blue-600">Size Guide</a></li>
                        <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                        <li><a href="#" className="hover:text-blue-600">Sustainability</a></li>
                        <li><a href="#" className="hover:text-blue-600">Stores</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>© 2024 Sole & Style. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;