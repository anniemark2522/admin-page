"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchFoods, deleteFood } from "@/lib/api/foodApi";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";

export default function FoodListPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [foodToDelete, setFoodToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchFoods().then((data) => {
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => Number(a.foodId) - Number(b.foodId)); // ✅ เรียงตาม foodId
        setFoods(sorted);
        setFilteredFoods(sorted);
      }
    });
  }, []);
  

  useEffect(() => {
    let filtered = [...foods];

    if (provinceFilter !== "all") {
      filtered = filtered.filter(
        (f) => f.province?.toLowerCase() === provinceFilter.toLowerCase()
      );
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (f) => f.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    setFilteredFoods(filtered);
  }, [provinceFilter, typeFilter, foods]);

  const handleDelete = (id: string) => {
    setFoodToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (foodToDelete) {
      const res = await deleteFood(foodToDelete);
      if (res) {
        const updated = foods.filter((f) => f.foodId !== foodToDelete);
        setFoods(updated);
        alert("Deleted successfully");
      } else {
        alert("Delete failed");
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-900">Food List</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Link
          href="/data/food/create"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Add New Food
        </Link>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Provinces</option>
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="localthai">Local Thai</option>
            <option value="healthy,vegan">Healthy Vegan</option>
            <option value="western">Western</option>
            <option value="sweet">Sweet</option>
          </select>
        </div>
      </div>

      <table className="w-full mt-6 border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="p-2">Food ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Province</th>
            <th className="p-2">Type</th>
            <th className="p-2">Website</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <tr key={food.foodId} className="hover:bg-gray-50 transition">
                <td className="p-2">{food.foodId}</td>
                <td className="p-2">{food.name}</td>
                <td className="p-2 capitalize">{food.province}</td>
                <td className="p-2 capitalize">{food.type}</td>
                <td className="p-2">
                  <a
                    href={food.website}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </td>
                <td className="p-2 flex gap-3 justify-center">
                  <Link
                    href={`/data/food/edit/${food.foodId}`}
                    className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(food.foodId)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No foods found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this food?"
      />
    </div>
  );
}
