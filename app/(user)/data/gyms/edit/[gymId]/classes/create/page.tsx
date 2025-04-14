"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CreateGymClassPage() {
  const { gymId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    className: "",
    type: "",
    highlight: "",
    dailyTimeTable: "",
    price: "",
    url: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/gyms/${gymId}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Class created successfully");
        router.push(`/data/gyms/edit/${gymId}`);
      } else {
        alert("Failed to create class");
      }
    } catch (err) {
      console.error("Error creating class:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center mb-6">Add New Class</h1>
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "className", label: "Class Name" },
            { name: "type", label: "Type" },
            { name: "highlight", label: "Highlight" },
            { name: "dailyTimeTable", label: "Schedule" },
            { name: "price", label: "Price" },
            { name: "url", label: "URL" },
            { name: "image", label: "Image URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-semibold mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full p-3 border rounded"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
