import React, { useState, useEffect, useContext } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import axios from "../../api";
import AuthContext from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "product",
    name: "",
    description: "",
    additional_information: "",
    price: "",
    quantity: "",
    category_id: "",
    subcategory_id: "",
    brand_id: "",
    model: "",
    color_ids: [],
    size_ids: [],
    image: null,
    detail_images: [],
    // Service-specific fields
    duration_minutes: "",
    service_location: "",
    available_days: "",
    service_radius_km: "",
    tags: "",
    is_active: true,
  });

  // Dropdown data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});

  // Load dropdown data
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category_id) {
      loadSubcategories(formData.category_id);
    } else {
      setSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory_id: "" }));
    }
  }, [formData.category_id]);

  const loadDropdownData = async () => {
    try {
      const [categoriesRes, brandsRes, colorsRes, sizesRes] = await Promise.all([
        axios.get("/api/categories/"),
        axios.get("/api/brands/"),
        axios.get("/api/colors/"),
        axios.get("/api/sizes/"),
      ]);

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setColors(colorsRes.data);
      setSizes(sizesRes.data);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
      toast.error("Failed to load form data");
    }
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`/api/subcategories/?category_id=${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, detail_images: files }));
    if (errors.detail_images) {
      setErrors(prev => ({ ...prev, detail_images: "" }));
    }
  };

  const removeDetailImage = (index) => {
    setFormData(prev => ({
      ...prev,
      detail_images: prev.detail_images.filter((_, i) => i !== index)
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";

    // Image validation
    if (!formData.image) newErrors.image = "Main product image is required";
    if (formData.detail_images.length < 3) {
      newErrors.detail_images = "At least 3 detail images are required";
    }

    // Type-specific validation
    if (formData.type === "product") {
      if (!formData.quantity || parseInt(formData.quantity) < 0) {
        newErrors.quantity = "Valid quantity is required for products";
      }
    } else if (formData.type === "service") {
      if (!formData.duration_minutes || parseInt(formData.duration_minutes) <= 0) {
        newErrors.duration_minutes = "Duration is required for services";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === "image" && formData[key]) {
          submitData.append(key, formData[key]);
        } else if (key === "detail_images") {
          // Skip detail_images here, we'll handle them separately
          return;
        } else if (key === "color_ids" || key === "size_ids") {
          // Handle array fields
          formData[key].forEach(id => {
            submitData.append(key, id);
          });
        } else if (formData[key] !== "" && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axios.post("/api/products/", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Upload detail images separately if product creation was successful
      if (formData.detail_images.length > 0) {
        const productId = response.data.id;
        const detailImagePromises = formData.detail_images.map(async (image) => {
          const detailImageData = new FormData();
          detailImageData.append('product', productId);
          detailImageData.append('image', image);
          
          return axios.post("/api/product-detail-images/", detailImageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        });

        await Promise.all(detailImagePromises);
      }

      toast.success("Product added successfully!");
      onProductAdded && onProductAdded(response.data);
      handleClose();
    } catch (error) {
      console.error("Error adding product:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        setErrors(serverErrors);
        toast.error("Please fix the form errors");
      } else {
        toast.error("Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "product",
      name: "",
      description: "",
      additional_information: "",
      price: "",
      quantity: "",
      category_id: "",
      subcategory_id: "",
      brand_id: "",
      model: "",
      color_ids: [],
      size_ids: [],
      image: null,
      detail_images: [],
      duration_minutes: "",
      service_location: "",
      available_days: "",
      service_radius_km: "",
      tags: "",
      is_active: true,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-lg relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Add New {formData.type === "product" ? "Product" : "Service"}</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black text-2xl"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Information</label>
              <textarea
                name="additional_information"
                value={formData.additional_information}
                onChange={handleInputChange}
                rows="2"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Price and Quantity/Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : ''}`}
                  disabled={loading}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {formData.type === "product" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.duration_minutes ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.duration_minutes && <p className="text-red-500 text-sm mt-1">{errors.duration_minutes}</p>}
                </div>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.category_type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <select
                  name="subcategory_id"
                  value={formData.subcategory_id}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || !formData.category_id}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Brand and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Service-specific fields */}
            {formData.type === "service" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Location</label>
                  <input
                    type="text"
                    name="service_location"
                    value={formData.service_location}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Available Days</label>
                  <input
                    type="text"
                    name="available_days"
                    value={formData.available_days}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Radius (KM)</label>
                  <input
                    type="number"
                    name="service_radius_km"
                    value={formData.service_radius_km}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Colors */}
            <div>
              <label className="block text-sm font-medium mb-2">Colors</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {colors.map(color => (
                  <label key={color.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.color_ids.includes(color.id)}
                      onChange={() => handleMultiSelect("color_ids", color.id)}
                      disabled={loading}
                    />
                    <span className="text-sm">{color.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium mb-2">Sizes</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {sizes.map(size => (
                  <label key={size.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.size_ids.includes(size.id)}
                      onChange={() => handleMultiSelect("size_ids", size.id)}
                      disabled={loading}
                    />
                    <span className="text-sm">{size.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Main Product Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Main Product Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  id="main-image-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="main-image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <FaUpload className="text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-600">
                    {formData.image ? formData.image.name : "Click to upload main image"}
                  </span>
                </label>
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            {/* Detail Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Detail Images * (At least 3 images)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDetailImagesChange}
                  className="hidden"
                  id="detail-images-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="detail-images-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <FaUpload className="text-gray-400 text-2xl mb-2" />
                  <span className="text-gray-600">
                    {formData.detail_images.length > 0 
                      ? `${formData.detail_images.length} images selected` 
                      : "Click to upload detail images (multiple)"}
                  </span>
                </label>
              </div>
              
              {/* Display selected detail images */}
              {formData.detail_images.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {formData.detail_images.map((file, index) => (
                      <div key={index} className="relative bg-gray-100 p-2 rounded border">
                        <p className="text-xs truncate">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => removeDetailImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.detail_images && <p className="text-red-500 text-sm mt-1">{errors.detail_images}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Comma-separated keywords"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                disabled={loading}
              />
              <label className="text-sm font-medium">Active (visible to customers)</label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center space-x-2"
            disabled={loading}
          >
            {loading && <FaSpinner className="animate-spin" />}
            <span>{loading ? "Adding..." : "Add Product"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
