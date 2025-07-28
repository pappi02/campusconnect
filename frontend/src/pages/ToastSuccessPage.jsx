import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Mail, Clock } from 'lucide-react';

const ToastSuccessPage = () => {
  const location = useLocation();
  const message = "Your application has been received and is being reviewed. You will receive an approval email after successful review. This may take sometime";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <div className="container mt-30 mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-300 hover:scale-105">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
            <p className="text-gray-600">We're excited to have you on board</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Check your email for updates</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-gray-700">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Review process takes 2-6 hours</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              Your application has been received and is being reviewed. 
              You'll receive an approval email once it's been processed. 
              Thank you for your patience!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Back to Homepage
            </Link>
            <Link
              to="/my-account"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
            >
              View My Account
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ToastSuccessPage;
