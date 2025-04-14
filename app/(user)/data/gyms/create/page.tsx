"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGym } from "@/lib/api/gymApi";

export default function CreateGymPage() {
  const router = useRouter();
  const [gymData, setGymData] = useState<{
    name: string;
    location: string;
    description: string;
    image: string[]; 
    url: string;
    openHours: {
      Sunday: string;
      Monday: string;
      Tuesday: string;
      Wednesday: string;
      Thursday: string;
      Friday: string;
      Saturday: string;
    };
  }>({
    name: "",
    location: "",
    description: "",
    image: [],
    url: "",
    openHours: {
      Sunday: "",
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
  },
  });
  const [newImage, setNewImage] = useState("");

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...gymData,
        image: gymData.image.filter((img) => img.trim() !== ""),
      };
      const result = await createGym(dataToSend);
      if (result) {
        alert("Gym created successfully!");
        router.push("/data/gyms");
      }
    } catch (error) {
      console.error("Failed to create gym:", error);
      alert("Failed to create gym.");
    }
  };

  return (
    <div className="p-6 max-full">
      <h1 className="text-3xl font-bold text-center mb-6">Create New Muay Thai Gym</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Gym Name:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={gymData.name}
            onChange={(e) => setGymData({ ...gymData, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Location:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={gymData.location}
            onChange={(e) => setGymData({ ...gymData, location: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Description:</label>
          <textarea
            className="w-full p-2 border rounded"
            value={gymData.description}
            onChange={(e) => setGymData({ ...gymData, description: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Images:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {gymData.image.map((img, i) => (
              <img key={i} src={img} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
          <input
            type="text"
            placeholder="Image URL"
            className="w-full p-2 border rounded mb-2"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <button
            onClick={() => {
              if (newImage.trim()) {
                setGymData({ ...gymData, image: [...gymData.image, newImage.trim()] });
                setNewImage("");
              }
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
          >
            Add Image
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Website URL:</label>
          <input
            type="url"
            className="w-full p-2 border rounded"
            placeholder="https://..."
            value={gymData.url}
            onChange={(e) => setGymData({ ...gymData, url: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Opening Hours:</label>
          {Object.entries(gymData.openHours).map(([day, time]) => (
            <div key={day} className="mb-2">
              <label className="block">{day}:</label>
              <input
                type="text"
                value={time}
                onChange={(e) =>
                  setGymData({
                    ...gymData,
                    openHours: { ...gymData.openHours, [day]: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., 07:00 - 21:00"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button 
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button onClick={handleSave} 
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save Gym
          </button>
        </div>
      </div>
      </div>
  );
}
