"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAttractions, updateAttraction } from "@/lib/api/attractionApi";

export default function EditAttractionPage() {
  const router = useRouter();
  const { attId } = useParams();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetchAttractions().then((data) => {
      const found = data.find((f: any) => f.attId === attId);
      setForm(found || {});
    });
  }, [attId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await updateAttraction(attId as string, form);
      if (res) {
        alert("Updated successfully");
        router.push("/data/attraction");
      }
    } catch (error) {
      alert("Update failed");
    }
  };

  if (!form) return <p className="text-center mt-10 text-red-500">Attraction not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Attraction</h1>
      <div className="bg-white shadow rounded p-6 space-y-4">
        {[
          { name: "name", label: "Name" },
          { name: "location", label: "Location" },
          { name: "province", label: "Province", type: "select", options: [
            "bangkok", "phuket", "chiang mai", "krabi", "chonburi", "surat thani", "chiang rai", "prachuap khiri khan", "phangnga", "phetchabun"
          ] },
          { name: "type", label: "Type", type: "select", options: ["activity", "street", "mall"] },
          { name: "open_hours", label: "Open Hours" },
          { name: "phone", label: "Phone" },
          { name: "parking", label: "Parking" },
          { name: "website", label: "Website" },
          { name: "map_url", label: "Map URL" },
          { name: "image", label: "Image URL" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-semibold mb-1">{field.label}</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select --</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
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
                <img src={form.image} className="w-48 h-32 object-cover rounded shadow" alt="Preview" />
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-between">
          <button onClick={() => router.back()} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600">Back</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
