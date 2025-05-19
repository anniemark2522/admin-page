"use client";

import { useEffect, useState } from "react";

interface GymData {
  gymId: string;
  name: string;
  province: string;
  lat?: string;
  long?: string;
}

export default function LocationPage() {
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/data")
      .then((res) => res.json())
      .then((data) => setGyms(data))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  const handleInputChange = (index: number, field: keyof GymData, value: string) => {
    const updatedGyms = [...gyms];
    updatedGyms[index][field] = value;
    setGyms(updatedGyms);
  };

  const handleSave = async (gym: GymData) => {
    const res = await fetch("http://localhost:5001/api/update-latlng", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gymId: gym.gymId,
        lat: gym.lat,
        long: gym.long,
      }),
    });

    if (res.ok) {
      alert("บันทึกสำเร็จ");
      setEditIndex(null);
    } else {
      alert("บันทึกล้มเหลว");
    }
  };

  const handleGeocode = async (index: number) => {
    const gym = gyms[index];
    const fullAddress = `${gym.name} ${gym.province}`;
    const res = await fetch(`http://localhost:3000/api/geocoding?query=${encodeURIComponent(fullAddress)}`);
    const data = await res.json();

    if (data?.lat && data?.lng) {
      const updated = [...gyms];
      updated[index].lat = data.lat.toString();
      updated[index].long = data.lng.toString();
      setGyms(updated);
      alert("อัปเดตพิกัดสำเร็จจาก Geocoding!");
    } else {
      alert("หา location ไม่เจอจาก API");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gym Location Data</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2">Name</th>
            <th className="border p-2">Province</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gyms.map((gym, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{gym.name}</td>
              <td className="border p-2">{gym.province}</td>
              <td className="border p-2">
                {editIndex === i ? (
                  <input
                    type="text"
                    value={gym.lat ?? ""}
                    onChange={(e) => handleInputChange(i, "lat", e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  gym.lat ?? "-"
                )}
              </td>
              <td className="border p-2">
                {editIndex === i ? (
                  <input
                    type="text"
                    value={gym.long ?? ""}
                    onChange={(e) => handleInputChange(i, "long", e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  gym.long ?? "-"
                )}
              </td>
              <td className="border p-2 space-x-2">
                {editIndex === i ? (
                  <button
                    onClick={() => handleSave(gym)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditIndex(i)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleGeocode(i)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Sync Coordinates
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
