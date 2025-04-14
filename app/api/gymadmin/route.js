import { NextResponse } from "next/server";
import { fetchGyms, updateGym, createGym, deleteGym } from "@/lib/api/gymApi";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const gymId = url.searchParams.get("gymId") || undefined;
    const gymsList = await fetchGyms(gymId);
    return NextResponse.json(gymsList);
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { gymId, ...updateData } = body;

    if (!gymId) {
      return NextResponse.json({ error: "gymId is required" }, { status: 400 });
    }

    const response = await updateGym(gymId, updateData);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating gym:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newGymData = body;

    if (!newGymData.name || !newGymData.location) {
      return NextResponse.json({ error: "Gym name and location are required" }, { status: 400 });
    }

    const response = await createGym(newGymData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const gymId = url.searchParams.get("gymId");

    if (!gymId) {
      return NextResponse.json({ error: "gymId is required for deletion" }, { status: 400 });
    }

    const response = await deleteGym(gymId);
    if (!response) {
      return NextResponse.json({ error: "Gym not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Gym deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
