"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchAccommodations, deleteAccommodation } from "@/lib/api/accommodationApi";
import ConfirmDeleteModel from "@/components/ConfirmDeleteModel";

export default function AccommodationListPage() {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<any[]>([]);
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchAccommodations().then((data) => {
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => Number(a.hotelId) - Number(b.hotelId));
        setAccommodations(sorted);
        setFilteredAccommodations(sorted);
      }
    });
  }, []);

  useEffect(() => {
    let result = [...accommodations];

    if (provinceFilter !== "all") {
      result = result.filter(
        (hotel) =>
          hotel.province?.trim().toLowerCase() === provinceFilter.trim().toLowerCase()
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (hotel) => hotel.type?.trim().toLowerCase() === typeFilter.trim().toLowerCase()
      );
    }

    setFilteredAccommodations(result);
  }, [provinceFilter, typeFilter, accommodations]);

  const handleDelete = (hotelId: string) => {
    setHotelToDelete(hotelId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (hotelToDelete) {
      try {
        const result = await deleteAccommodation(hotelToDelete);
        if (result) {
          const updated = accommodations.filter((hotel) => hotel.hotelId !== hotelToDelete);
          setAccommodations(updated);
          alert(`Accommodation with ID ${hotelToDelete} deleted successfully`);
        } else {
          throw new Error("Delete failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting accommodation");
      }
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-900">Accommodations</h1>

      {/* ส่วน Add Button + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* Add Button */}
        <Link
          href="/data/accommodation/create"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition w-fit"
        >
          Add New Accommodation
        </Link>

        {/* Filters */}
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
            <option value="hotel">Hotel</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>
      </div>


      <table className="w-full mt-4 border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="p-2">Hotel ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Province</th>
            <th className="p-2">Type</th>
            <th className="p-2">Website</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccommodations.length > 0 ? (
            filteredAccommodations.map((hotel) => (
              <tr key={hotel.hotelId} className="hover:bg-gray-50 transition">
                <td className="p-2">{hotel.hotelId}</td>
                <td className="p-2">{hotel.name}</td>
                <td className="p-2">{hotel.location}</td>
                <td className="p-2 capitalize">{hotel.province}</td>
                <td className="p-2 capitalize">{hotel.type}</td>
                <td className="p-2">
                  <a href={hotel.website} target="_blank" className="text-blue-600 underline">
                    View
                  </a>
                </td>
                <td className="p-2 flex gap-3 justify-center">
                  <Link
                    href={`/data/accommodation/edit/${hotel.hotelId}`}
                    className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel.hotelId)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4 text-gray-500">
                No accommodations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDeleteModel
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this accommodation?"
      />
    </div>
  );
}
