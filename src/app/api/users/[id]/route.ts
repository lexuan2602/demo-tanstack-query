import { NextResponse } from "next/server";
import { updateBioInStore } from "@/lib/demo-store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("bio" in payload) ||
    typeof payload.bio !== "string" ||
    payload.bio.trim().length === 0 ||
    payload.bio.length > 200
  ) {
    return NextResponse.json(
      { error: "Bio must be between 1 and 200 characters" },
      { status: 400 },
    );
  }

  try {
    const user = await updateBioInStore(id, payload.bio);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
