import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongoose";
import QuizAttempt from "@/lib/models/QuizAttempt";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const attempts = await QuizAttempt.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ attempts });
}
