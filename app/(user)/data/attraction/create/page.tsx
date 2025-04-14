"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAttraction } from "@/lib/api/attractionApi";

export default function CreateAttractionPage() {
  const router = useRouter();

  type AttractionForm = {
    name: string;
    type: string;
    location: string;
    province: string;
    open_hours: string;
    phone: string;
    parking: string;
    website: string;
    map_url: string;
    image: string;
  };

  const [form, setForm] = useState<AttractionForm>({
    name: "",
    type: "",
    location: "",
    province: "",
    open_hours: "",
    phone: "",
    parking: "",
    website: "",
    map_url: "",
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await createAttraction(form);
      if (res) {
        alert("Attraction created successfully!");
        router.push("/data/attraction");
      }
    } catch (error) {
      alert("Failed to create attraction.");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Attraction</h1>
      <div className="bg-white shadow rounded p-6 space-y-4">
        {[
          { name: "name", label: "Name" },
          { name: "location", label: "Location" },
          { name: "province", label: "Province" },
          { name: "type", label: "Type" },
          { name: "open_hours", label: "Open Hours" },
          { name: "phone", label: "Phone" },
          { name: "parking", label: "Parking" },
          { name: "website", label: "Website" },
          { name: "map_url", label: "Map URL" },
          { name: "image", label: "Image URL" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold mb-1">{field.label}</label>

            {field.name === "type" ? (
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Type --</option>
                <option value="activity">Activity</option>
                <option value="street">Street</option>
                <option value="mall">Shopping Mall</option>
              </select>
            ) : field.name === "province" ? (
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select Province --</option>
                <option value="bangkok">Bangkok</option>
                <option value="phuket">Phuket</option>
                <option value="chiang mai">Chiang Mai</option>
                <option value="krabi">Krabi</option>
                <option value="chonburi">Chonburi</option>
                <option value="surat thani">Surat Thani</option>
                <option value="chiang rai">Chiang Rai</option>
                <option value="prachuap khiri khan">Prachuap Khiri Khan</option>
                <option value="phangnga">Phangnga</option>
                <option value="phetchabun">Phetchabun</option>
              </select>
            ) : field.name === "open_hours" || field.name === "location" ? (
              <textarea
                name={field.name}
                value={form[field.name as keyof AttractionForm]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={form[field.name as keyof AttractionForm]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}

            {/* Image Preview */}
            {field.name === "image" && form.image && (
              <div className="mt-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between">
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
