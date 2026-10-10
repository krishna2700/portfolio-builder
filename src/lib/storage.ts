import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3 ?? "";
const bucket = process.env.S3_BUCKET ?? "uploads";

const client = new S3Client({
  endpoint,
  region: process.env.AWS_REGION ?? "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  // Neon's S3-compatible endpoint requires path-style addressing.
  forcePathStyle: true,
});

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return `${endpoint}/${bucket}/${key}`;
}
