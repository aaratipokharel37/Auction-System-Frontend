import React, { useState } from 'react';

const CreateAuction = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    condition: '',
    startingBid: '',
    startTime: '',
    endTime: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        setSelectedFiles(prev => [...prev, file]);

        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, {
            url: e.target.result,
            file: file
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    selectedFiles.forEach((file) => {
      submitData.append('images', file);
    });

    try {
      // Replace with your API endpoint
      const response = await fetch('http://localhost:5000/api/auctions/create', {
        method: 'POST',
        body: submitData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Auction created successfully!');

        // Redirect to auction page or dashboard
        window.location.href = '/auctions';
      } else {
        alert('Failed to create auction. Please try again.');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('An error occurred. Please try again.');
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
                Auction Item Images
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Click to upload or drag and drop
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-yellow-500 transition-all bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
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
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <img src={preview.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-md transition-all"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Auction
              </button>
            </div>

          </form>
        </div>

      
      </div>
    </div>
  );
};

export default CreateAuction;