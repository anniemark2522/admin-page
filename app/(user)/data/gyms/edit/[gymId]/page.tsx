"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateGym, fetchGymById } from '@/lib/api/gymApi'; // Assuming you have the `updateGym` function

export default function GymEditPage() {
  const { gymId } = useParams();
  const [gym, setGym] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newImage, setNewImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  

  const router = useRouter();

  useEffect(() => {
    if (gymId && typeof gymId === "string") {
      fetchGymById(gymId)
        .then((data) => {
          if (data && data.length > 0) {
            const fetchedGym = data[0];
            setGym({ ...fetchedGym, image: fetchedGym.image || [] });
          } else {
            setGym(null);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching gym data:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [gymId]);

  const isCompleteData = (gym: any) => {
    return (
      gym.description &&
      gym.location &&
      gym.image && gym.image.length > 0 &&
      gym.openHours &&
      gym.url
    );
  };

  const handleAddImage = () => {
    if (newImage && gym?.image && !gym.image.includes(newImage)) {
      setGym({ ...gym, image: [...gym.image, newImage] });
      setNewImage("");
    }
  };

  const handleSaveChanges = async (): Promise<void> => {
    try {
      // Check if gymId and gym are strings
      if (typeof gymId !== 'string' || typeof gym !== 'object') {
        alert("Invalid gymId or gym data");
        return;
      }
  
      // Call the updateGym function to save the gym data
      const updatedGym = await updateGym(gymId, gym);
  
      if (updatedGym) {
        setIsModalOpen(true);
      } else {
        alert("Failed to save gym data");
      }
    } catch (error) {
      console.error("Error saving gym data:", error);
      alert("Failed to save data");
    }
  };
  

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Muay Thai Gym</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : gym ? (
        <div className="border rounded-lg p-6 shadow-lg bg-white max-w-full mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">{gym.name || "No Name"}</h2>

          <div className="mb-4">
            <strong>Data Status:</strong>{" "}
            {isCompleteData(gym) ? (
              <span className="text-green-600">Complete</span>
            ) : (
              <span className="text-red-600">
                Missing Data:
                {!gym.description && " Description"}
                {!gym.location && " Location"}
                {(!gym.image || gym.image.length === 0) && " Image"}
                {!gym.openHours && " Open Hours"}
                {!gym.url && " Website Link"}
              </span>
            )}
          </div>

          <div className="mb-4">
            <strong>Description:</strong>
            <textarea
              value={gym.description || ""}
              onChange={(e) => setGym({ ...gym, description: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <strong>Location:</strong>
            <textarea
              value={gym.location || ""}
              onChange={(e) => setGym({ ...gym, location: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <strong>Images:</strong>
            <div className="flex flex-wrap gap-2">
              {gym.image?.map((img: string, index: number) => (
                <img key={index} src={img} alt={`Gym ${index}`} className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
            <input
              type="text"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full p-3 border rounded-lg mt-2"
              placeholder="Add image link"
            />
            <button
              onClick={handleAddImage}
              className="mt-2 bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Add Image
            </button>
          </div>

          <div className="mb-4">
            <strong>Website:</strong>{" "}
            {gym.url ? (
              <a href={gym.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {gym.url}
              </a>
            ) : (
              "No Link"
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => router.back()} className="bg-gray-500 text-white px-6 py-2 rounded-lg">
              Go Back
            </button>
            <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500">Gym not found or data is missing.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Save Successful</h2>
            <button onClick={() => setIsModalOpen(false)} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
