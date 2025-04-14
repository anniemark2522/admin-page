"use client";

import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "@/lib/api/userApi";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AdminUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (uid: string) => {
    setUserToDelete(uid);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete);
      setUsers(users.filter((user) => user.uid !== userToDelete));
      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-900">User Accounts</h1>
      <table className="w-full border border-gray-300 rounded shadow-lg">
        <thead className="bg-red-800 text-white">
          <tr>
            <th className="p-2">UID</th>
            <th className="p-2">First Name</th>
            <th className="p-2">Last Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-100">
                <td className="p-2 text-sm">{user.uid}</td>
                <td className="p-2">{user.firstName}</td>
                <td className="p-2">{user.lastName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 text-xs">
                  {new Date(user.createdAt._seconds * 1000).toLocaleString()}
                </td>
                <td className="p-2 flex justify-center">
                  <button
                    onClick={() => handleDeleteClick(user.uid)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
      />
    </div>
  );
}
