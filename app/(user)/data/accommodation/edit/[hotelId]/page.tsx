"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAccommodations, updateAccommodation } from "@/lib/api/accommodationApi";

export default function EditAccommodationPage() {
  const router = useRouter();
  const { hotelId } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId && typeof hotelId === "string") {
      fetchAccommodations().then((data) => {
        const found = data.find((item: any) => item.hotelId === hotelId);
        if (found) setForm(found);
        setLoading(false);
      });
    }
  }, [hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await updateAccommodation(form.hotelId, form);
      if (res) {
        alert("Accommodation updated successfully!");
        router.push("/data/accommodation");
      }
    } catch (error) {
      alert("Failed to update accommodation.");
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!form) {
    return <p className="text-center mt-10 text-red-500">Accommodation not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Accommodation</h1>
      <div className="bg-white shadow rounded p-6 space-y-4">
        {[
          { name: "name", label: "Name" },
          { name: "location", label: "Location" },
          { name: "province", label: "Province" },
          { name: "description", label: "Description", isTextArea: true },
          { name: "open_hours", label: "Open Hours" },
          { name: "contact", label: "Contact" },
          { name: "website", label: "Website" },
          { name: "map_url", label: "Map URL" },
          { name: "image", label: "Image URL" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold">{field.label}</label>
            {field.isTextArea ? (
              <textarea
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
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
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
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
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
