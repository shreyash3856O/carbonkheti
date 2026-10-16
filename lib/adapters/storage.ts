/**
 * File Storage Adapter
 *
 * ⚠️ STORAGE_PROVIDER=local in dev — saves to /public/uploads (NOT for prod)
 * Set STORAGE_PROVIDER=s3 with S3_* env vars for production.
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export interface StorageAdapter {
  upload(file: File | Buffer, filename: string, folder?: string): Promise<{ url: string; key: string }>;
  delete(key: string): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  async upload(file: File | Buffer, filename: string, folder = "uploads") {
    const dir = join(process.cwd(), "public", folder);
    await mkdir(dir, { recursive: true });
    const buf = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;
    await writeFile(join(dir, filename), buf);
    const key = `${folder}/${filename}`;
    return { url: `/${key}`, key };
  }

  async delete(key: string) {
    const { unlink } = await import("fs/promises");
    await unlink(join(process.cwd(), "public", key)).catch(() => {});
  }
}

class S3StorageAdapter implements StorageAdapter {
  private endpoint = process.env.S3_ENDPOINT!;
  private bucket = process.env.S3_BUCKET!;
  private accessKey = process.env.S3_ACCESS_KEY!;
  private secretKey = process.env.S3_SECRET_KEY!;
  private region = process.env.S3_REGION ?? "ap-south-1";
  private publicUrl = process.env.S3_PUBLIC_URL!;

  async upload(file: File | Buffer, filename: string, folder = "uploads") {
    // ⚠️ STUB — integrate AWS SDK or fetch-based S3 upload here
    // import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
    console.warn("[S3 STUB] S3 upload not yet implemented. Configure S3_* env vars.");
    const key = `${folder}/${filename}`;
    return { url: `${this.publicUrl}/${key}`, key };
  }

  async delete(key: string) {
    console.warn("[S3 STUB] S3 delete not yet implemented.");
  }
}

function createStorageAdapter(): StorageAdapter {
  const provider = process.env.STORAGE_PROVIDER ?? "local";
  if (provider === "s3") return new S3StorageAdapter();
  return new LocalStorageAdapter();
}

export const storageAdapter = createStorageAdapter();
