import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");

for (const envFile of [
  path.resolve(rootDir, ".env.local"),
  path.resolve(rootDir, ".env"),
]) {
  loadEnv({ path: envFile, override: false });
}

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  if (
    !cloudinary.config().cloud_name ||
    !cloudinary.config().api_key ||
    !cloudinary.config().api_secret
  ) {
    console.error(
      "Missing Cloudinary credentials. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (or CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local or export them in your shell.",
    );
    process.exit(1);
  }

  const files = (await walk(publicDir)).filter((file) =>
    /\.(png|jpe?g|webp|gif|svg)$/i.test(file),
  );
  if (!files.length) {
    console.log("No uploadable assets found in public/.");
    return;
  }

  for (const file of files) {
    const relativePath = path.relative(rootDir, file).replace(/\\/g, "/");
    const publicPath = `/${relativePath}`;
    const folder =
      process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "ever-and-always";

    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        public_id: relativePath
          .replace(/^public\//, "")
          .replace(/\.[^.]+$/, ""),
        overwrite: false,
        resource_type: "image",
      });
      console.log(`Uploaded ${publicPath} -> ${result.secure_url}`);
    } catch (error) {
      console.error(`Failed to upload ${publicPath}`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
