import React, { useState } from 'react';

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Ending Soon', 'New', 'Popular'];

  return (
    <div className="flex gap-2 bg-white p-2! rounded-full shadow-md">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6! py-2.5! rounded-full font-medium transition-all duration-300 ${
            activeTab === tab
              ? 'bg-yellow-500 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;