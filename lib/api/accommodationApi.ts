const API_BASE_URL = "http://localhost:5001";

// Get all accommodations
export async function fetchAccommodations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/accommodation`);
    if (!res.ok) throw new Error("Failed to fetch accommodations");
    return await res.json();
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return [];
  }
}

// Delete accommodation
export async function deleteAccommodation(hotelId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/accommodation/${hotelId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete accommodation");

    return await res.json();
  } catch (error) {
    console.error("Error deleting accommodation:", error);
    return null;
  }
}

// Create accommodation
export async function createAccommodation(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/admin/accommodation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create accommodation");
  return await res.json();
}

// Update accommodation
export async function updateAccommodation(hotelId: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/api/admin/accommodation/${hotelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // ไม่ต้องใส่ hotelId ซ้ำใน body
    });
  
    if (!res.ok) throw new Error("Failed to update accommodation");
    return await res.json();
  }
  