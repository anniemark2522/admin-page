"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteGym, fetchGyms } from "@/lib/api/gymApi";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";

export default function GymsPage() {
  const [gyms, setGyms] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gymToDelete, setGymToDelete] = useState<any>(null);

  useEffect(() => {
    fetchGyms().then((data) => {
      if (Array.isArray(data)) {
        const sortedGyms = data.sort((a, b) => Number(a.gymId) - Number(b.gymId));
        setGyms(sortedGyms);
      } else {
        console.error("Data is not an array:", data);
      }
    });
  }, []);

  const highlightMissing = (value: any) => {
    return !value ? "text-red-600 font-bold" : "";
  };

  const isCompleteData = (gym: any) => {
    return (
      gym.description &&
      gym.location &&
      gym.image && gym.image.length > 0 &&
      gym.openHours &&
      gym.url
    );
  };

  const handleDelete = (gymId: string) => {
    setGymToDelete(gymId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (gymToDelete) {
      try {
        const result = await deleteGym(gymToDelete);
        if (result) {
          setGyms((prev) => prev.filter((gym) => gym.gymId !== gymToDelete));
          alert(`Gym with ID: ${gymToDelete} has been deleted.`);
        } else {
          throw new Error("Failed to delete gym");
        }
      } catch (error) {
        console.error("Error deleting gym:", error);
        alert("There was an error deleting the gym.");
      }
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-900">Muay Thai Gyms</h1>

      <Link
        href="/data/gyms/create"
        className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
      >
        Add New Gym
      </Link>

      <table className="w-full mt-6 border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="border p-2 text-left text-sm font-medium">Gym ID</th>
            <th className="border p-2 text-left text-sm font-medium">Gym Name</th>
            <th className="border p-2 text-left text-sm font-medium">Data Status</th>
            <th className="border p-2 text-left text-sm font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gyms.map((gym) => (
            <tr key={gym.gymId} className="hover:bg-gray-50 transition">
              <td className="border p-2">{gym.gymId}</td>
              <td className="border p-2">
                <Link
                  href={`/data/gyms/view/${gym.gymId}`}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {gym.name}
                </Link>
              </td>
              <td className="border p-2">
                {isCompleteData(gym) ? (
                  <span className="text-green-600">Complete</span>
                ) : (
                  <span className={`text-red-600 ${highlightMissing(gym.status)}`}>
                    Missing Data
                  </span>
                )}
              </td>
              <td className="border p-2 flex justify-center items-center space-x-4">
                <Link
                  href={`/data/gyms/edit/${gym.gymId}`}
                  className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(gym.gymId)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Gym"
        message="Are you sure you want to delete this gym? This action cannot be undone."
      />
    </div>
  );
}
