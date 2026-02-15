import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAuction } from '@/queries/auction';
import { toast } from 'sonner';

const CreateAuction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
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
  const [error, setError] = useState('');

  // Create auction mutation
  const createAuctionMutation = useMutation({
    mutationFn: (submitData) => createAuction(submitData),
    onSuccess: (data) => {
      toast.success(data.message || 'Auction created successfully!');
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['all-auctions'] });
      navigate({ to: '/my-auctions' });
    },
    onError: (error) => {
      toast.error(error.message || "Unable to create auction")
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      setError('Only PNG, JPEG, and WEBP formats are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

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

    // Create FormData
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('description', formData.description);
    submitData.append('condition', formData.condition);
    submitData.append('startingBid', formData.startingBid);
    submitData.append('startTime', new Date(formData.startTime));
    submitData.append('endTime', new Date(formData.endTime));
    submitData.append('image', selectedFile);

    // Trigger mutation
    createAuctionMutation.mutate(submitData);
  };

  // Set minimum date to now
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto relative">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">
              Create{" "}
              <span className="bg-white text-yellow-700 px-2 py-1 rounded-lg">
                Auction
              </span>
            </h2>
            <p className="text-yellow-100 mt-2">
              List your exceptional item for bidding
            </p>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
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
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="e.g., Vintage Rolex Submariner"
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
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="Automobiles">Automobiles</option>
                    <option value="Books & Manuscripts">Books & Manuscripts</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion & Accessories">Fashion & Accessories</option>
                    <option value="Jewelry & Watches">Jewelry & Watches</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Sports Memorabilia">Sports Memorabilia</option>
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
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all resize-none"
                    placeholder="Provide a detailed description of your item..."
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
                    <option value="New">New</option>
                    <option value="Used">Used</option>
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
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-yellow-500 file:to-yellow-700 file:text-white file:cursor-pointer hover:file:from-yellow-400 hover:file:to-yellow-600 file:transition-all"
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
                  disabled={createAuctionMutation.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {createAuctionMutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
    </div>
  );
};

export default CreateAuction;