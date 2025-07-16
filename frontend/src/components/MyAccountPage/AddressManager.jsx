import React, { useState } from "react";

const AddressItem = ({ id, name, address, onEdit, onDelete }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-600">{address}</p>
    </div>
    <div className="flex gap-4">
      <button onClick={() => onEdit(id)} className="text-blue-600 hover:underline text-sm">
        Edit
      </button>
      <button onClick={() => onDelete(id)} className="text-red-600 hover:underline text-sm">
        Delete
      </button>
    </div>
  </div>
);

const AddressManager = ({ addresses, onAddAddress, onEditAddress, onDeleteAddress }) => {
  const initialFormState = {
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onEditAddress(editingId, formData);
    } else {
      onAddAddress(formData);
    }
    setFormData(initialFormState);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (id) => {
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setFormData({
        firstName: addr.first_name || "",
        lastName: addr.last_name || "",
        companyName: addr.company_name || "",
        country: addr.country || "",
        streetAddress: addr.street_address || "",
        city: addr.city || "",
        state: addr.state || "",
        zipCode: addr.zip_code || "",
        phone: addr.phone || "",
        email: addr.email || "",
      });
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <section>
      <div className="flex gap-4 mb-6">
        {/* Address List */}
        <div className="flex-1 border border-gray-300 rounded-lg p-4 space-y-4">
          {addresses.map(({ id, first_name, last_name, street_address, city, state, zip_code, country }) => (
            <AddressItem
              key={id}
              id={id}
              name={`${first_name} ${last_name}`}
              address={`${street_address}, ${city}, ${state}, ${zip_code}, ${country}`}
              onEdit={handleEditClick}
              onDelete={onDeleteAddress}
            />
          ))}
        </div>

        {/* Form */}
        <div className="flex-1">
          {/* Toggle Add Form Button */}
          {!showAddForm && (
            <button
              className="bg-green-900 text-white px-6 py-2 rounded-full mb-4 hover:bg-green-800"
              onClick={() => setShowAddForm(true)}
            >
              + Add New Address
            </button>
          )}

          {/* Form Display */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="streetAddress" className="block text-sm font-medium mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select City</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium mb-1">
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select State</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="Florida">Florida</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
                >
                  {editingId ? "Cancel" : "Close"}
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 text-sm text-white rounded ${
                    editingId ? "bg-blue-700 hover:bg-blue-800" : "bg-green-900 hover:bg-green-800"
                  }`}
                >
                  {editingId ? "Save Changes" : "Add Address"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddressManager;
