"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { updateGym, fetchGyms, fetchGymClasses } from "@/lib/api/gymApi";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModel";

export default function GymEditPage() {
  const { gymId } = useParams();
  const router = useRouter();

  const [gym, setGym] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (gymId && typeof gymId === "string") {
      Promise.all([fetchGyms(gymId), fetchGymClasses(gymId)])
        .then(([data, classData]) => {
          if (data && data.length > 0) {
            const gymData = data[0];
            setGym({
              ...gymData,
              image: gymData.image || [],
              openHours: gymData.openHours || {
                Sunday: "",
                Monday: "",
                Tuesday: "",
                Wednesday: "",
                Thursday: "",
                Friday: "",
                Saturday: "",
              },
              classes:
                Array.isArray(classData) &&
                classData.length > 0 &&
                Array.isArray(classData[0].classes)
                  ? classData[0].classes
                  : [],
            });
          } else {
            setGym(null);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching gym or classes:", err);
          setLoading(false);
        });
    }
  }, [gymId]);

  const isCompleteData = (gym: any) => {
    return (
      gym.description &&
      gym.location &&
      gym.image &&
      gym.image.length > 0 &&
      gym.openHours &&
      gym.url
    );
  };

  const handleAddImage = () => {
    if (newImage && !gym.image.includes(newImage)) {
      setGym({ ...gym, image: [...gym.image, newImage] });
      setNewImage("");
    }
  };

  const handleSaveChanges = async () => {
    if (!gymId || !gym) return;
    const { classes, ...pureGymData } = gym;
    try {
      const res = await updateGym(gymId as string, pureGymData);
      if (res) {
        setIsModalOpen(true);
      } else {
        alert("Failed to update gym");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An error occurred while updating the gym.");
    }
  };

  const handleDeleteClass = (index: number) => {
    setClassToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!gymId || classToDelete === null) return;
    try {
      await fetch(`http://localhost:5001/api/admin/gyms/${gymId}/classes/${classToDelete}`, {
        method: "DELETE",
      });
      const updatedClasses = gym.classes.filter((_: any, i: number) => i !== classToDelete);
      setGym({ ...gym, classes: updatedClasses });
    } catch (err) {
      console.error("Delete class failed:", err);
      alert("Failed to delete class.");
    } finally {
      setShowDeleteModal(false);
      setClassToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Muay Thai Gym</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : gym ? (
        <div className="border p-6 rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold mb-4 text-center">{gym.name || "No Name"}</h2>

          <div className="mb-4">
            <strong>Data Status:</strong>{" "}
            {isCompleteData(gym) ? (
              <span className="text-green-600">Complete</span>
            ) : (
              <span className="text-red-600">
                Missing:
                {!gym.description && " Description"}
                {!gym.location && " Location"}
                {(!gym.image || gym.image.length === 0) && " Image"}
                {!gym.openHours && " Open Hours"}
                {!gym.url && " Website"}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              value={gym.description || ""}
              onChange={(e) => setGym({ ...gym, description: e.target.value })}
              className="w-full p-3 border rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Location:</label>
            <textarea
              value={gym.location || ""}
              onChange={(e) => setGym({ ...gym, location: e.target.value })}
              className="w-full p-3 border rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Images:</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {gym.image.map((img: string, idx: number) => (
                <img key={idx} src={img} className="w-24 h-24 object-cover rounded shadow" />
              ))}
            </div>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Add image URL"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Add Image
            </button>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Website URL:</label>
            <input
              type="url"
              value={gym.url || ""}
              onChange={(e) => setGym({ ...gym, url: e.target.value })}
              className="w-full p-3 border rounded"
              placeholder="https://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Opening Hours:</label>
            {Object.keys(gym.openHours).map((day) => (
              <div key={day} className="mb-2">
                <label className="block">{day}:</label>
                <input
                  type="text"
                  value={gym.openHours[day]}
                  onChange={(e) =>
                    setGym({
                      ...gym,
                      openHours: { ...gym.openHours, [day]: e.target.value },
                    })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 07:00 - 21:00"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center cursor-pointer">
              <h2 className="text-2xl font-semibold mb-4">Training Classes</h2>
              <Link
                href={`/data/gyms/edit/${gymId}/classes/create`}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition mb-4 inline-block"
              >
                Add New Class
              </Link>
              <span className="text-blue-600 cursor-pointer" onClick={() => setIsClassesOpen(!isClassesOpen)}>
                {isClassesOpen ? "Hide ▲" : "Show ▼"}
              </span>
            </div>

            {isClassesOpen && gym.classes?.map((cls: any, index: number) => (
              <div key={index} className="border p-4 rounded mb-4 shadow-sm">
                <p><strong>Class Name:</strong> {cls.className || <span className="text-red-500">Missing</span>}</p>
                <p><strong>Type:</strong> {cls.type || <span className="text-red-500">Missing</span>}</p>
                <p><strong>Highlight:</strong> {cls.highlight || <span className="text-red-500">Missing</span>}</p>
                <p><strong>Schedule:</strong> {cls.dailyTimeTable || <span className="text-red-500">Missing</span>}</p>

                <div className="flex gap-4 mt-2">
                  <Link
                    href={`/data/gyms/edit/${gymId}/classes/edit/${index}`}
                    className="bg-yellow-500 text-white px-4 py-1 rounded-full"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded-full"
                    onClick={() => handleDeleteClass(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => router.back()} className="bg-gray-500 text-white px-6 py-2 rounded-full">
              Go Back
            </button>
            <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-6 py-2 rounded-full">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Gym not found or something went wrong.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Saved Successfully</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        title="Delete Class"
        message="Are you sure you want to delete this class?"
      />
    </div>
  );
}
