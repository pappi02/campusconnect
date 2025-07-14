import React from "react";
import { Edit2 } from "lucide-react";

const PersonalInformationForm = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Profile Picture with Edit Icon */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-green-700 rounded-full p-1 hover:bg-green-800"
            aria-label="Edit profile picture"
          >
            <Edit2 className="text-white w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6 space-x-2">
        <div>
          <label htmlFor="firstName" className="block font-semibold mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="max-w-90% border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block font-semibold mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="max-w-90% border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="max-w-90% border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="max-w-90% border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="col-span-2 max-w-xs">
          <label htmlFor="gender" className="block font-semibold mb-1">
            Gender *
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="max-w-90% border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          >
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-900 text-white rounded-full px-6 py-2 mt-6 hover:bg-green-800 transition"
      >
        Update Changes
      </button>
    </form>
  );
};

export default PersonalInformationForm;
