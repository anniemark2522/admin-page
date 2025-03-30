"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Function to handle the submission of the new gym form
async function createGym(data: any) {
  try {
    const response = await fetch("http://localhost:5001/api/gymadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
 if (!response.ok) {
      const errorData = await response.json();
      console.error("ข้อผิดพลาดจากการตอบกลับ:", errorData);
      throw new Error("ไม่สามารถสร้าง gym ได้: " + errorData.error);
    }
    
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการสร้าง gym:", error);
    return null;
  }
}

export default function CreateGymPage() {
  const [gymData, setGymData] = useState({
    name: "",
    description: "",
    location: "",
    openHours: {
      Sunday: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
    },
    image: [],
    url: "",
  });

  const [newImage, setNewImage] = useState<string>("");
  const router = useRouter();

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGymData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle opening hours change
  const handleOpenHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGymData((prevData) => ({
      ...prevData,
      openHours: {
        ...prevData.openHours,
        [name]: value,
      },
    }));
  };

  // Handle adding image
  const handleAddImage = () => {
    if (newImage && !gymData.image.includes(newImage)) {
      setGymData({ ...gymData, image: [...gymData.image, newImage] });
      setNewImage('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createGym(gymData);
    if (result) {
      alert("Gym created successfully!");
      router.push("/"); // Redirect after successful creation
    } else {
      alert("Failed to create gym. Please try again.");
    }
  };

  // Handle back button
  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <h1 className="text-3xl font-bold text-center mb-6">Create Muay Thai Gym</h1>
      <form onSubmit={handleSubmit} className="border rounded-lg p-6 shadow-lg bg-white max-w-full mx-auto">
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium">Gym Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={gymData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Enter Gym Name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-medium">Description:</label>
          <textarea
            id="description"
            name="description"
            value={gymData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            rows={4}
            placeholder="Enter Gym Description"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-lg font-medium">Location:</label>
          <textarea
            id="location"
            name="location"
            value={gymData.location}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            rows={4}
            placeholder="Enter Gym Location"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="openHours" className="block text-lg font-medium">Opening Hours:</label>
          {Object.keys(gymData.openHours).map((day) => (
            <div key={day} className="mb-2">
              <label htmlFor={day} className="block">{day}:</label>
              <input
                type="text"
                id={day}
                name={day}
                value={gymData.openHours[day]}
                onChange={handleOpenHoursChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Enter hours (e.g., 07:00 - 21:00)"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-medium">Images:</label>
          <div className="flex flex-wrap gap-2">
            {gymData.image.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Gym Image ${index + 1}`}
                width={100}
                height={100}
                className="w-24 h-24 object-cover rounded-lg shadow"
              />
            ))}
            <div className="mt-4">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Add Image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="mt-2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="url" className="block text-lg font-medium">Website URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={gymData.url}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            placeholder="Enter Website URL"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600"
          >
            Create Gym
          </button>
        </div>
      </form>

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
}
