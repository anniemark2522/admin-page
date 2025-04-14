// lib/api/attractionApi.ts
const API_BASE_URL = "http://localhost:5001"; // ปรับให้ตรงกับ backend ของคุณ

export async function fetchAttractions() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/attraction`);
    if (!res.ok) throw new Error("Failed to fetch attractions");
    return await res.json();
  } catch (error) {
    console.error("Error fetching attractions:", error);
    return [];
  }
}

export async function createAttraction(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/attraction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create attraction");
    return await res.json();
  } catch (error) {
    console.error("Error creating attraction:", error);
    return null;
  }
}

export async function updateAttraction(attId: string, data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/attraction/${attId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update attraction");
    return await res.json();
  } catch (error) {
    console.error("Error updating attraction:", error);
    return null;
  }
}

export async function deleteAttraction(attId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/attraction/${attId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete attraction");
    return await res.json();
  } catch (error) {
    console.error("Error deleting attraction:", error);
    return null;
  }
}
