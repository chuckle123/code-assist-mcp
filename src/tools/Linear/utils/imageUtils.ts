import path from "path";
import fs from "fs";
import os from "os";
import { linearAxiosClient } from "../client/index.js";
import sharp, { FormatEnum } from "sharp";

const extractImageUrls = (description: string): string[] => {
  // Match markdown image syntax: ![alt text](url)
  const imageRegex = /!\[.*?\]\((https:\/\/uploads\.linear\.app\/[^\s\)]+)\)/g;
  const matches = [...description.matchAll(imageRegex)];
  return matches.map((match) => match[1]);
};

const downloadImage = async (
  imageUrl: string
): Promise<{ buffer: Buffer; extension: string }> => {
  try {
    const response = await linearAxiosClient.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"];
    let extension = ".jpg"; // Default extension

    // Map common mime types to extensions
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    };

    if (contentType && mimeToExt[contentType]) {
      extension = mimeToExt[contentType];
    }

    return {
      buffer: Buffer.from(response.data),
      extension,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
    throw error;
  }
};

export const downloadAllImages = async (
  description: string
): Promise<Array<{ url: string; path: string }>> => {
  const imageUrls = extractImageUrls(description);
  const tempDir = path.join(os.tmpdir(), "temp_linear_images");

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const downloads = await Promise.all(
    imageUrls.map(async (url) => {
      const { buffer, extension } = await downloadImage(url);

      const image = await sharp(buffer);
      const meta = await image.metadata();
      const { format } = meta;

      const config: Record<keyof FormatEnum, any> = {
        jpeg: { quality: 85 },
        webp: { quality: 85 },
        png: { compressionLevel: 8 },
      } as any;

      const resizedBuffer = await ((image as any)[format!] as any)(
        config[format!]
      )
        .resize(1000)
        .toBuffer();

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}${extension}`;
      const filePath = path.join(tempDir, fileName);

      fs.writeFileSync(filePath, resizedBuffer);

      return {
        url,
        path: filePath,
      };
    })
  );
  return downloads;
};
