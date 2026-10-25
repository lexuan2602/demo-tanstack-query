import { NextResponse } from "next/server";
import { getUsersFromStore } from "@/lib/demo-store";

export async function GET() {
  const users = await getUsersFromStore();

  return NextResponse.json(users);
}
