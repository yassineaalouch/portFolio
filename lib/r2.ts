import { S3Client } from "@aws-sdk/client-s3";

const accountEndpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accountEndpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("R2 configuration missing. Please set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountEndpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

