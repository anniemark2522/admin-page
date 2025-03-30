import { NextResponse } from "next/server";
import { fetchGyms, updateGym } from "@/lib/api/gymApi";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const gymId = url.searchParams.get("gymId") || undefined;

    const gymsList = await fetchGyms(gymId);
    console.error("Error fetching gyms:", error);

    return NextResponse.json(gymsList);
  } catch (error) {
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
    console.error("Error fetching gyms:", error);

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: สร้างข้อมูล gym ใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const newGymData = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!newGymData.name || !newGymData.location) {
      return NextResponse.json({ error: "Gym name and location are required" }, { status: 400 });
    }

    // เพิ่ม gym ใหม่
    const response = await createGym(newGymData); // createGym คือฟังก์ชันที่ใช้สร้าง gym ใหม่
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: ลบข้อมูล gym
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const gymId = url.searchParams.get("gymId");

    if (!gymId) {
      return NextResponse.json({ error: "gymId is required for deletion" }, { status: 400 });
    }

    const response = await DELETE(gymId); // deleteGym คือฟังก์ชันที่ใช้ลบ gym
    if (!response) {
      return NextResponse.json({ error: "Gym not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Gym deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
