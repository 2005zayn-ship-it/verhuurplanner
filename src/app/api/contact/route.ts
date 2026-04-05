import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { naam, email, bericht } = await req.json();
    if (!naam || !email || !bericht) {
      return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 });
    }

    // Log to console for now; wire up email (Resend) when API key is available
    console.log("[Contact]", { naam, email, bericht: bericht.substring(0, 100) });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
