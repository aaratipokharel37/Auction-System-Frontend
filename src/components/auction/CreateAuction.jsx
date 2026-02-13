import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    condition: '',
    startingBid: '',
    startTime: '',
    endTime: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      setError('Only PNG, JPEG, and WEBP formats are allowed');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedFile) {
      setError('Please upload an auction item image');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);
    const now = new Date();

    if (startTime < now) {
      setError('Auction starting time must be greater than present time');
      return;
    }

    if (startTime >= endTime) {
      setError('Auction starting time must be less than ending time');
      return;
    }

    setIsSubmitting(true);

    // Create FormData
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('condition', formData.condition);
    submitData.append('startingBid', formData.startingBid);
    submitData.append('startTime', formData.startTime);
    submitData.append('endTime', formData.endTime);
    submitData.append('image', selectedFile); // Note: backend expects 'image' not 'images'

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/v1/auctionitem/create',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true // If you're using cookies
        }
      );

      if (response.data.success) {
        alert(response.data.message || 'Auction created successfully!');
        navigate({ to: '/my-auctions' }); // or wherever you want to redirect
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while creating the auction. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to now
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute -top-1/2 -right-1/4 w-96 h-96 lg:w-[600px] lg:h-[600px] bg-gradient-radial rounded-full animate-float"></div>
      <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 lg:w-[500px] lg:h-[500px] bg-gradient-radial rounded-full animate-float" style={{ animationDelay: '5s' }}></div>

      <div className="w-full max-w-3xl relative z-10">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 animate-fadeInUp delay-200">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2">
              <span className="text-black">Create</span>{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
                Auction
              </span>
            </h2>
            <p className="text-gray-400">List your exceptional item for bidding</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auction Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 inline-block">
                Auction Details
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Rolex Submariner 1960"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Create an eye-catching title for your item
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                >
                  <option value="">Select Category</option>
                  <option value="art">Art & Craft</option>
                  <option value="automobiles">Automobiles</option>
                  <option value="books">Books & Manuscripts</option>
                  <option value="collectibles">Collectibles</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Accessories</option>
                  <option value="jewelry">Jewelry & Watches</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="sports">Sports Memorabilia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the item including condition, history, provenance, and any special features..."
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all min-h-[120px]"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Be detailed and honest about the item's condition and history
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                >
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 inline-block">
                Pricing
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Starting Bid <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="startingBid"
                  value={formData.startingBid}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="Enter starting bid amount"
                />
              </div>
            </div>

            {/* Timing Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 inline-block">
                Timing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Auction Starting Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    min={minDateTime}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Auction End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    min={minDateTime}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2 inline-block">
                Auction Item Image
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-yellow-500 transition-all bg-gray-50">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-r file:from-yellow-500 file:to-yellow-700
                      file:text-white file:cursor-pointer
                      hover:file:from-yellow-400 hover:file:to-yellow-600
                      file:transition-all"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPEG or WEBP (MAX. 5MB)
                  </p>
                </div>
              </div>

              {imagePreview && (
                <div className="relative w-full max-w-md mx-auto">
                  <div className="relative aspect-square border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md transition-all"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {selectedFile?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Auction...
                  </span>
                ) : (
                  'Create Auction'
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateAuction;