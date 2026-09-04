import { NextResponse } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILES,
  MAX_FILE_SIZE,
  contactSchema,
  type ContactFieldErrors,
} from "@/lib/validation";

export const runtime = "nodejs";

// No public email is published on the site yet — the recipient comes purely
// from the environment. CONTACT_TO_EMAIL is kept as a fallback name so an
// existing deployment keeps working.
const TO_EMAIL = process.env.CONTACT_EMAIL || process.env.CONTACT_TO_EMAIL || "";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function buildEmailHtml(data: Record<string, string>) {
  const rows = Object.entries(data)
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;background:#f3efe3;font-weight:600;color:#0f2f18;white-space:nowrap;vertical-align:top;">${escapeHtml(
            label,
          )}</td>
          <td style="padding:10px 14px;color:#16281c;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#faf8f2;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid #e7e0cd;">
      <div style="background:#0f2f18;padding:24px;">
        <h1 style="margin:0;color:#faf8f2;font-size:20px;">New Free Estimate Request</h1>
        <p style="margin:6px 0 0;color:#9dcd36;font-size:13px;">${escapeHtml(siteConfig.name)}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#ffffff;font-size:14px;">
        ${rows}
      </table>
    </div>
  </body>
</html>`;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again in a few minutes, or call us directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    service: String(formData.get("service") ?? ""),
    propertyType: String(formData.get("propertyType") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  };

  // Honeypot: respond as if everything went fine so bots do not learn anything.
  if (raw.company) {
    return NextResponse.json({ message: "Thank you! We received your request." });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors;
      if (!errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (photos.length > MAX_FILES) {
    return NextResponse.json(
      { message: `You can attach up to ${MAX_FILES} photos.` },
      { status: 400 },
    );
  }
  for (const photo of photos) {
    if (!ALLOWED_FILE_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { message: "Photos must be JPG, PNG, WEBP, or HEIC files." },
        { status: 400 },
      );
    }
    if (photo.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Each photo must be under 8MB." }, { status: 400 });
    }
  }

  const emailFields = {
    "Full Name": data.name,
    "Phone Number": data.phone,
    Email: data.email || "—",
    "Service Address / ZIP": data.address || "—",
    "Service Needed": data.service,
    "Property Type": data.propertyType || "—",
    Message: data.message || "—",
    "Photos Attached": String(photos.length),
    Submitted: new Date().toLocaleString("en-US"),
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !TO_EMAIL) {
    // Integration is complete — it only needs RESEND_API_KEY and CONTACT_EMAIL.
    // In development we log the submission so the whole flow can be tested
    // without credentials.
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[contact] RESEND_API_KEY and/or CONTACT_EMAIL missing — submission logged instead:",
        emailFields,
      );
      return NextResponse.json({ message: "Thank you! We received your request." });
    }
    console.error(
      "[contact] RESEND_API_KEY and/or CONTACT_EMAIL is not configured — email not sent.",
    );
    return NextResponse.json(
      {
        message: `We couldn't send your request right now. Please call us at ${siteConfig.phoneDisplay}.`,
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const attachments = await Promise.all(
      photos.map(async (photo) => ({
        filename: photo.name,
        content: Buffer.from(await photo.arrayBuffer()).toString("base64"),
      })),
    );

    const { error } = await resend.emails.send({
      from: `${siteConfig.name} <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email || undefined,
      subject: `New Free Estimate Request — ${data.name} (${data.service})`,
      html: buildEmailHtml(emailFields),
      text: Object.entries(emailFields)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n"),
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        {
          message: `We couldn't send your request right now. Please call us at ${siteConfig.phoneDisplay}.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "Thank you! We received your request." });
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return NextResponse.json(
      {
        message: `Something went wrong. Please call us at ${siteConfig.phoneDisplay}.`,
      },
      { status: 500 },
    );
  }
}
