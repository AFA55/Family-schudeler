import { NextRequest, NextResponse } from "next/server";

// Placeholder auth handlers until NextAuth is fully configured
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Auth API ready - configure NextAuth" });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Auth API ready - configure NextAuth" });
}
