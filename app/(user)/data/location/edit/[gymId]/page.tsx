// /data/location/edit/[gymId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditLocationPage() {
  const { gymId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymId && typeof gymId === "string") {
        fetch(`http://localhost:5001/api/gym-latlng/${gymId}`)
        .then((res) => res.json())
        .then((d) => {
          if (d) setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [gymId]);

  const handleSave = async () => {
    const res = await fetch("http://localhost:5001/api/update-latlng", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gymId,
        lat: data.lat,
        long: data.long,
      }),
    });

    if (res.ok) {
      alert("Updated!");
      router.push("/data/location");
    } else {
      alert("Failed to update");
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!data) return <p className="text-center mt-8 text-red-500">Gym not found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#9A031E]">
        Edit Location: {data.name}
      </h1>
      <label className="block mb-2">Latitude</label>
      <input
        type="text"
        value={data.lat}
        onChange={(e) => setData({ ...data, lat: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      />
      <label className="block mb-2">Longitude</label>
      <input
        type="text"
        value={data.long}
        onChange={(e) => setData({ ...data, long: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-full"
      >
        Save
      </button>
    </div>
  );
}
