const API_BASE_URL = "http://localhost:5001"; // Adjust this as needed

// Fetch all gyms
export async function fetchGyms(gymId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gymadmin`);
    if (!response.ok) throw new Error("Failed to fetch gyms");
    return await response.json();
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return [];
  }
}
// Fetch a single gym by ID
export async function fetchGymById(gymId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gymadmin?gymId=${gymId}`);
    if (!response.ok) throw new Error("Failed to fetch gym data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching gym:", error);
    return null;
  }
}
// Update gym details
export async function updateGym(gymId: string, gymData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gym/${gymId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
      const response = await fetch(`${API_BASE_URL}/api/gym/${gymId}`, {
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
  
