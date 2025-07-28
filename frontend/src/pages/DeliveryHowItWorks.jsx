import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DeliveryHowItWorks = () => {
  return (
    <div className="mt-30 min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deliver for CampusConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our delivery team and earn money on your schedule - whether you're a student, local bodaboda rider, or community member
          </p>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-plus text-2xl text-black"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Sign Up</h3>
              <p className="text-gray-600">
                Create your delivery partner account and complete the verification process
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-2xl text-black"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Orders</h3>
              <p className="text-gray-600">
                Receive delivery requests through our app and choose the ones that work for you
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-money-bill-wave text-2xl text-black"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Earn Money</h3>
              <p className="text-gray-600">
                Complete deliveries and get paid instantly with tips and bonuses
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Deliver with Us?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <i className="fas fa-clock text-yellow-500 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold">Flexible Schedule</h3>
              </div>
              <p className="text-gray-600">
                Work when you want, where you want. Perfect for students, part-time workers, and anyone seeking flexible income.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <i className="fas fa-dollar-sign text-yellow-500 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold">Competitive Pay</h3>
              </div>
              <p className="text-gray-600">
                Earn competitive rates plus tips and bonuses for exceptional service. Great for supplementing income.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <i className="fas fa-handshake text-yellow-500 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold">All Backgrounds Welcome</h3>
              </div>
              <p className="text-gray-600">
                Students, local bodaboda riders, and community members - everyone is welcome to join our delivery team.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center mb-4">
                <i className="fas fa-users text-yellow-500 text-2xl mr-3"></i>
                <h3 className="text-xl font-semibold">Community Impact</h3>
              </div>
              <p className="text-gray-600">
                Help build a stronger campus community by connecting students with local businesses.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Requirements
          </h2>
          
          <div className="bg-white rounded-lg p-8 shadow-md max-w-2xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Must be 18 years or older</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Valid ID (student ID, national ID, or other identification)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Transportation method (walking, bicycle, motorbike, car, or bodaboda)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Smartphone with internet access</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-3"></i>
                <span>Good communication skills and reliability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-yellow-400 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-black mb-4">
            Ready to Start Delivering?
          </h2>
          <p className="text-lg text-black mb-6">
            Join hundreds of delivery partners already earning with CampusConnect
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/delivery/apply"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors inline-block"
            >
              Apply Now
            </Link>
            <Link 
              to="/delivery/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DeliveryHowItWorks;
