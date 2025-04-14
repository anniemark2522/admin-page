// app/(user)/data/food/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFood } from "@/lib/api/foodApi";

export default function CreateFoodPage() {
  const router = useRouter();

  type FoodForm = {
    name: string;
    location: string;
    province: string;
    type: string;
    open_hours: string;
    phone: string;
    parking: string;
    website: string;
    map_url: string;
    image: string;
  };

  const [form, setForm] = useState<FoodForm>({
    name: "",
    location: "",
    province: "",
    type: "",
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Food</h1>
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
                <option value="localthai">Local Thai</option>
                <option value="healthy,vegan">Healthy Vegan</option>
                <option value="western">Western</option>
                <option value="sweet">Sweet</option>
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
                <option value="chiang mai">Chiang Mai</option>
                <option value="phuket">Phuket</option>
                <option value="krabi">Krabi</option>
                <option value="pattaya">Pattaya</option>
                <option value="nakhon ratchasima">Nakhon Ratchasima</option>
                <option value="ubon ratchathani">Ubon Ratchathani</option>
                <option value="udon thani">Udon Thani</option>
                <option value="khon kaen">Khon Kaen</option>
                <option value="surat thani">Surat Thani</option>
              </select>
            ) : (
              <input
                type="text"
                name={field.name}
                value={form[field.name as keyof FoodForm]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}

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
            onClick={async () => {
              try {
                const res = await createFood(form);
                if (res) {
                  alert("Food created successfully!");
                  router.push("/data/food");
                }
              } catch (error) {
                alert("Failed to create food.");
                console.error(error);
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
