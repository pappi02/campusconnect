import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../api';
import { toast } from 'react-toastify';

const DeliveryApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idType: '',
    idNumber: '',
    isStudent: false,
    university: '',
    yearOfStudy: '',
    transportationMode: '',
    availableHours: '',
    emergencyContact: '',
    emergencyPhone: '',
    hasLicense: false,
    agreeToTerms: false,
    motivation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API submission
      const apiData = {
        user: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        id_type: formData.idType,
        id_number: formData.idNumber,
        is_student: formData.isStudent,
        university: formData.university,
        year_of_study: formData.yearOfStudy,
        transportation_mode: formData.transportationMode,
        available_hours: formData.availableHours,
        has_license: formData.hasLicense,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        motivation: formData.motivation
      };
      
      const response = await axios.post('/api/delivery/apply/', apiData);
      
      
      navigate('/application-success', { state: { success: true } });
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-30 min-h-screen bg-gray-50 pt-20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Delivery Partner Application
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our delivery team - whether you're a student, local bodaboda rider, or community member
          </p>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Identification Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Identification</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Type *
                  </label>
                  <select
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select ID Type</option>
                    <option value="Student ID">Student ID</option>
                    <option value="National ID">National ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Driver's License</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Student Information (Optional) */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Student Information (Optional)</h2>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isStudent"
                    checked={formData.isStudent}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I am currently a student
                  </label>
                </div>
              </div>

              {formData.isStudent && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University/College
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study
                    </label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transportation Mode *
                  </label>
                  <select
                    name="transportationMode"
                    value={formData.transportationMode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Transportation</option>
                    <option value="Walking">Walking (for short distances)</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Motorcycle/Bodaboda">Motorcycle/Bodaboda</option>
                    <option value="Car">Car</option>
                    <option value="Scooter">Scooter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours per Week
                  </label>
                  <select
                    name="availableHours"
                    value={formData.availableHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Select Hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="10-15 hours">10-15 hours</option>
                    <option value="15-20 hours">15-20 hours</option>
                    <option value="20+ hours">20+ hours</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasLicense"
                    checked={formData.hasLicense}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I have a valid driving license (if applicable for my transportation mode)
                  </label>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tell Us About Yourself</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to become a delivery partner? (Optional)
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Tell us what motivates you to join our delivery team..."
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="pb-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  I agree to the <Link to="#" className="text-yellow-600 hover:text-yellow-700">Terms and Conditions</Link> and <Link to="#" className="text-yellow-600 hover:text-yellow-700">Privacy Policy</Link>. I understand that this application does not guarantee employment and that I must meet all requirements to become a delivery partner.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <Link 
                to="/delivery/how-it-works"
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to How It Works
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DeliveryApplicationForm;
