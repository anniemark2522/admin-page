const API_BASE = "http://localhost:5001/api/admin/food";

export async function fetchFoods() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to fetch food data");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createFood(data: any) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create food");
  return await res.json();
}

export async function updateFood(foodId: string, data: any) {
  const res = await fetch(`${API_BASE}/${foodId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update food");
  return await res.json();
}

export async function deleteFood(foodId: string) {
  const res = await fetch(`${API_BASE}/${foodId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete food");
  return await res.json();
}
