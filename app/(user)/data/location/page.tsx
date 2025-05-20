"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface GymData {
  gymId: string;
  name: string;
  province: string;
  lat?: string;
  long?: string;
}

export default function LocationGymPage() {
  const [gyms, setGyms] = useState<GymData[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5001/api/data")
      .then((res) => res.json())
      .then((data) =>
        setGyms(
          data.map((g: any) => ({
            ...g,
            lat: g.lat?.toString() ?? "",
            long: g.long?.toString() ?? "",
          }))
        )
      )
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  const filteredGyms = gyms
    .filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.province.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.province.localeCompare(b.province));

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-[#9A031E]">Gym Location Data</h1>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search by gym or province"
          className="w-full md:w-1/2 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9A031E]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border border-[#9A031E] rounded-lg shadow-md overflow-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-[#9A031E] text-white text-center">
              <th className="border p-3 w-1/4">Name</th>
              <th className="border p-3 w-1/6">Province</th>
              <th className="border p-3 w-1/6">Latitude</th>
              <th className="border p-3 w-1/6">Longitude</th>
              <th className="border p-3 w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGyms.map((gym, i) => (
              <tr key={i} className="text-center hover:bg-gray-50">
                <td className="border p-3 break-words text-left">{gym.name}</td>
                <td className="border p-3 capitalize">{gym.province}</td>
                <td className="border p-3">{gym.lat ?? "-"}</td>
                <td className="border p-3">{gym.long ?? "-"}</td>
                <td className="border p-3 space-x-2">
                  <button
                    onClick={() => router.push(`/data/location/edit/${gym.gymId}`)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
