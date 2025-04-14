const API_BASE_URL = "http://localhost:5001";

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function deleteUser(uid: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${uid}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
}
