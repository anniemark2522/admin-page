"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchGymClasses } from "@/lib/api/gymApi";

export default function EditClassPage() {
  const { gymId, classIndex } = useParams();
  const router = useRouter();
  const [classForm, setClassForm] = useState<any>({
    className: "",
    type: "",
    highlight: "",
    dailyTimeTable: "",
    price: "",
    url: "",
    image: "",
  });

  useEffect(() => {
    if (typeof gymId === "string") {
      fetchGymClasses(gymId).then((data) => {
        const classList = Array.isArray(data) && data.length > 0 && data[0].classes;
        if (classList && classList[parseInt(classIndex as string)]) {
          setClassForm(classList[parseInt(classIndex as string)]);
        }
      });
    }
  }, [gymId, classIndex]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/gyms/${gymId}/classes/${classIndex}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classForm),
        }
      );

      if (res.ok) {
        alert("Class updated");
        router.push(`/data/gyms/edit/${gymId}`);
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Class #{Number(classIndex) + 1}</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg border w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "className", label: "Class Name" },
            { key: "type", label: "Type" },
            { key: "highlight", label: "Highlight" },
            { key: "dailyTimeTable", label: "Schedule" },
            { key: "price", label: "Price" },
            { key: "url", label: "URL" },
            { key: "image", label: "Image URL" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold mb-1">{field.label}:</label>
              <input
                type="text"
                placeholder={field.label}
                value={classForm[field.key]}
                onChange={(e) =>
                  setClassForm({ ...classForm, [field.key]: e.target.value })
                }
                className="w-full p-3 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
