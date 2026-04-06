import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await req.json();

    const ownerEmail = String(body.ownerEmail || "").trim();
    const companyName = String(body.companyName || "").trim();
    const senderName = String(body.senderName || "").trim();
    const senderEmail = String(body.senderEmail || "").trim();
    const senderPhone = body.senderPhone ? String(body.senderPhone).trim() : null;
    const message = String(body.message || "").trim();

    if (!ownerEmail || !companyName || !senderName || !senderEmail || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Treilix <info@mail.treilix.com>",
      to: ownerEmail,
      replyTo: senderEmail,
      subject: `New inquiry for ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2>New inquiry on Treilix</h2>

          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          <p><strong>Phone:</strong> ${senderPhone || "—"}</p>

          <div style="margin-top: 20px;">
            <p><strong>Message:</strong></p>
            <div style="padding: 12px; border: 1px solid #ddd; border-radius: 8px; white-space: pre-line;">
${message}
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return NextResponse.json(
        { error: error.message || "Email sending failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id ?? null,
    });
  } catch (err) {
    console.error("ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}