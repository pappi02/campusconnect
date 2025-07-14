import React from "react";

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

const AddressManager = ({
  addresses,
  newAddress,
  onNewAddressChange,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) => {
  return (
    <section>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 border border-gray-300 rounded-lg p-4 space-y-4">
          {addresses.map(({ id, name, address }) => (
            <AddressItem
              key={id}
              id={id}
              name={name}
              address={address}
              onEdit={onEditAddress}
              onDelete={onDeleteAddress}
            />
          ))}
        </div>

        <form onSubmit={onAddAddress} className="flex-1 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Add New Address</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={newAddress.firstName}
                onChange={onNewAddressChange}
                placeholder="Ex. John"
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
                value={newAddress.lastName}
                onChange={onNewAddressChange}
                placeholder="Ex. Doe"
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
                value={newAddress.companyName}
                onChange={onNewAddressChange}
                placeholder="Enter Company Name"
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
                value={newAddress.country}
                onChange={onNewAddressChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                {/* Add more countries as needed */}
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
                value={newAddress.streetAddress}
                onChange={onNewAddressChange}
                placeholder="Enter Street Address"
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
                value={newAddress.city}
                onChange={onNewAddressChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                {/* Add more cities as needed */}
              </select>
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={newAddress.state}
                onChange={onNewAddressChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select State</option>
                <option value="California">California</option>
                <option value="Texas">Texas</option>
                <option value="Florida">Florida</option>
                {/* Add more states as needed */}
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
                value={newAddress.zipCode}
                onChange={onNewAddressChange}
                placeholder="Enter Zip Code"
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
                value={newAddress.phone}
                onChange={onNewAddressChange}
                placeholder="Enter Phone Number"
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
                value={newAddress.email}
                onChange={onNewAddressChange}
                placeholder="Enter Email Address"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-900 text-white rounded-full px-6 py-2 mt-4 hover:bg-green-800 transition"
          >
            Add Address
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddressManager;
