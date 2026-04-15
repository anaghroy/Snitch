import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_ENDPOINT_URL,
});

export async function uploadFile({ buffer, fileName, folder = "Snitch" }) {
  try {
    const result = await client.files.upload({
      file: buffer.toString("base64"),
      fileName: fileName,
      folder: folder,
    });
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
