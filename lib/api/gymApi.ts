const API_BASE_URL = "http://localhost:5001";

//all gyms or by gymId
export async function fetchGyms(gymId?: string) {
  try {
    const url = new URL(`${API_BASE_URL}/api/admin/gyms`);
    if (gymId) url.searchParams.append("gymId", gymId);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to fetch gyms");
    return await response.json();
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return [];
  }
}

// Create new gym
export async function createGym(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/gyms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text(); // ✅ ดูข้อความ error
    console.error("Create gym failed:", res.status, errorText);
    throw new Error("Failed to create gym");
  }
  return await res.json();
}

// Update gym details
export async function updateGym(gymId: string, gymData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/gyms/${gymId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gymId, ...gymData }),
    });

    if (!response.ok) throw new Error("Failed to update gym data");
    return await response.json();
  } catch (error) {
    console.error("Error updating gym:", error);
    return null;
  }
}

// Delete a gym
export async function deleteGym(gymId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/gyms/${gymId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`Failed to delete gym, status: ${response.status}`);
    
    const responseData = await response.json();
    console.log("Delete response:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error deleting gym:", error);
    return null;
  }
}

//classes gym
export async function fetchGymClasses(gymId: string) {
  try {
    const url = new URL(`${API_BASE_URL}/api/admin/gyms/classes`);
    url.searchParams.append("gymId", gymId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch gym classes");

    return await res.json();
  } catch (error) {
    console.error("Error fetching gym classes:", error);
    return [];
  }
}

