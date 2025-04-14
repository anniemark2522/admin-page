import { NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:5001";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/accommodation`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    return NextResponse.json({ error: "Failed to fetch accommodations" }, { status: 500 });
  }
}

