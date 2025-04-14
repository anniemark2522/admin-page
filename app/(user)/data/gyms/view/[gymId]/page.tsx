"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchGyms, fetchGymClasses } from '@/lib/api/gymApi';

export default function GymDetailPage() {
    const { gymId } = useParams();
    const router = useRouter();
    const [gym, setGym] = useState<any | null>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof gymId === "string") {
            Promise.all([
                fetchGyms(gymId),
                fetchGymClasses(gymId)
            ]).then(([gymData, classData]) => {
                console.log("Gym:", gymData);
                console.log("Classes:", classData);
                if (gymData && gymData.length > 0) {
                    setGym(gymData[0]);
            
                    // ใช้ classData จาก Firebase collection หรือ fallback ไปที่ gymData[0].classes
                    setClasses(
                        Array.isArray(classData) && classData.length > 0 && Array.isArray(classData[0].classes)
                          ? classData[0].classes
                          : []
                      );
                      
                } else {
                    setGym(null);
                    setClasses([]);
                }
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching gym or classes:", error);
                setLoading(false);
            });
            
        }
    }, [gymId]);

    const isClassComplete = (cls: any) => {
        return (
          cls.className?.trim() &&
          cls.dailyTimeTable?.trim() &&
          cls.type?.trim() &&
          cls.highlight?.trim()
        );
      };
      
      const renderMissingClassFields = (cls: any) => {
        const missing = [];
        if (!cls.className) missing.push("className");
        if (!cls.dailyTimeTable) missing.push("dailyTimeTable");
        if (!cls.type) missing.push("type");
        if (!cls.highlight) missing.push("highlight");
        return missing.length > 0 ? `Missing: ${missing.join(", ")}` : "";
      };
      

    if (loading) return <p className="text-center">Loading...</p>;
    if (!gym) return <p className="text-center text-red-500">Gym not found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">{gym.name}</h1>

            <div className="mb-6">
                <strong>Opening Hours:</strong>
                <ul className="list-disc pl-6">
                    {gym.openHours
                        ? (Object.entries(gym.openHours) as [string, any][]).map(([day, time]) => (
                            <li key={day}>
                                <strong>{day}:</strong>{" "}
                                {typeof time === "string" ? (
                                    time || <span className="text-red-600">Missing</span>
                                ) : (
                                    <ul className="ml-4 list-disc">
                                        {Object.entries(time as Record<string, string>).map(([session, hours]: [string, string]) => (
                                            <li key={session}>
                                                {session}: {hours ? hours : <span className="text-red-600">Missing</span>}
                                            </li>
                                        ))}

                                    </ul>
                                )}
                            </li>
                        ))
                        : (
                            <li className="text-red-600">Missing open hours</li>
                        )}
                </ul>


            </div>




            <div className="mb-6">
                <strong>Images:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                    {gym.image && gym.image.length > 0 ? (
                        gym.image.map((img: string, i: number) => (
                            <img key={i} src={img} alt={`Gym Image ${i}`} className="w-24 h-24 object-cover rounded" />
                        ))
                    ) : (
                        <span className="text-red-600">Missing images</span>
                    )}

                </div>
            </div>

            <div>
  <h2 className="text-2xl font-semibold mb-4">Training Classes</h2>
  {classes.length === 0 ? (
    <p className="text-red-600">No classes found.</p>
  ) : (
    <ul className="space-y-4">
      {classes.map((cls, idx) => (
        <li key={idx} className="border p-4 rounded-md shadow">
          <p><strong>Class Name:</strong> {cls.className || <span className="text-red-600">Missing</span>}</p>
          <p><strong>Type:</strong> {cls.type || <span className="text-red-600">Missing</span>}</p>
          <p><strong>Highlight:</strong> {cls.highlight || <span className="text-red-600">Missing</span>}</p>
          <p><strong>Schedule:</strong> {cls.dailyTimeTable || <span className="text-red-600">Missing</span>}</p>
          <p><strong>Price:</strong> {cls.price || <span className="text-red-600">Missing</span>}</p>
          <p><strong>URL:</strong> {cls.url ? <a href={cls.url} className="text-blue-600 underline" target="_blank">{cls.url}</a> : <span className="text-red-600">Missing</span>}</p>
          {cls.image && (
            <div className="mt-2">
              <img src={cls.image} alt={cls.className || "Class image"} className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          {!isClassComplete(cls) && (
            <p className="text-red-600 mt-2">{renderMissingClassFields(cls)}</p>
          )}
        </li>
      ))}
    </ul>
  )}
</div>


            <div className="mt-8 text-center">
                <button onClick={() => router.back()} className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700">
                    Back
                </button>
            </div>
        </div>
    );
}
