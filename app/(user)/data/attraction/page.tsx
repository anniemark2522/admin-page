"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fetchAttractions, deleteAttraction } from "@/lib/api/attractionApi";
import ConfirmDeleteModel from "@/components/ConfirmDeleteModel";

export default function AttractionListPage() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [attToDelete, setAttToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAttractions().then((data) => {
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => Number(a.attId) - Number(b.attId));
        setAttractions(sorted);
        setFiltered(sorted);
      }
    });
  }, []);

  useEffect(() => {
    let result = [...attractions];
    if (provinceFilter !== "all") {
      result = result.filter((a) => a.province?.toLowerCase() === provinceFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((a) => a.type?.toLowerCase() === typeFilter);
    }
    setFiltered(result);
  }, [provinceFilter, typeFilter, attractions]);

  const handleDelete = (id: string) => {
    setAttToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (attToDelete) {
      const res = await deleteAttraction(attToDelete);
      if (res) {
        const updated = attractions.filter((a) => a.attId !== attToDelete);
        setAttractions(updated);
        alert("Deleted successfully");
      }
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-900">Attraction List</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Link
          href="/data/attraction/create"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Add New Attraction
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
            <option value="activity">Activity</option>
            <option value="street">Street</option>
            <option value="mall">Shopping Mall</option>
          </select>
        </div>
      </div>

      <table className="w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Province</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((att) => (
            <tr key={att.attId} className="hover:bg-gray-100">
              <td className="p-2">{att.attId}</td>
              <td className="p-2">{att.name}</td>
              <td className="p-2 capitalize">{att.province}</td>
              <td className="p-2 capitalize">{att.type}</td>
              <td className="p-2 flex gap-2 justify-center">
                <Link
                  href={`/data/attraction/edit/${att.attId}`}
                  className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => handleDelete(att.attId)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDeleteModel
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this attraction?"
      />
    </div>
  );
}
