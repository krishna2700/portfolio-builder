import { fail, ok } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { extractTextFromPdf, parseResumeText } from "@/lib/resumeParser";
import { uploadObject } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);

  const form = await req.formData();
  const resume = form.get("resume");
  const photo = form.get("photo");

  if (!(resume instanceof File)) return fail("A resume PDF is required", 400);
  if (resume.type !== "application/pdf") return fail("Resume must be a PDF file", 400);
  if (resume.size > 8 * 1024 * 1024) return fail("Resume must be under 8MB", 400);

  const resumeBuffer = Buffer.from(await resume.arrayBuffer());

  let resumeText: string;
  try {
    resumeText = await extractTextFromPdf(resumeBuffer);
  } catch {
    return fail("Couldn't read that PDF — try a different file", 400);
  }
  if (!resumeText.trim()) {
    return fail("That PDF has no extractable text (is it a scanned image?)", 400);
  }

  let content;
  try {
    content = await parseResumeText(resumeText);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Resume parsing failed", 502);
  }

  const resumeUrl = await uploadObject(
    `${user.id}/resume.pdf`,
    resumeBuffer,
    "application/pdf"
  );

  let photoUrl: string | undefined;
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) return fail("Photo must be under 5MB", 400);
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const ext = photo.type === "image/png" ? "png" : "jpg";
    photoUrl = await uploadObject(`${user.id}/photo.${ext}`, photoBuffer, photo.type);
  }

  return ok({ content, resumeUrl, photoUrl });
}
