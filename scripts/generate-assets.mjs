#!/usr/bin/env node
import fs from "fs";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const photoSrc = path.join(root, "YJ_pp.jpeg");
const iconFallback = path.join(root, "src/app/icon.png");

function resolveSource() {
  if (fs.existsSync(photoSrc)) return photoSrc;
  if (fs.existsSync(iconFallback)) {
    console.warn("YJ_pp.jpeg not found, using src/app/icon.png");
    return iconFallback;
  }
  throw new Error("No source image found (YJ_pp.jpeg or src/app/icon.png)");
}

async function squareCrop(src) {
  const meta = await sharp(src).metadata();
  const size = Math.min(meta.width, meta.height);
  const left = Math.floor((meta.width - size) / 2);
  const top = Math.floor((meta.height - size) * 0.12);
  return sharp(src).extract({ left, top, width: size, height: size });
}

function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
    </svg>`
  );
}

async function writeSquarePng(square, size, file) {
  await square.clone().resize(size, size).png().toFile(file);
  console.log("wrote", file);
}

async function writeCircularPng(square, size, file) {
  const resized = await square.clone().resize(size, size).png().toBuffer();
  await sharp(resized)
    .composite([{ input: circleMask(size), blend: "dest-in" }])
    .png()
    .toFile(file);
  console.log("wrote", file);
}

async function main() {
  const src = resolveSource();
  const square = await squareCrop(src);

  const squareOutputs = [
    [256, path.join(root, "public/me/avatar.png")],
    [512, path.join(root, "public/me/smile-square.png")],
  ];

  const circularOutputs = [
    [16, path.join(root, "public/favicon-16x16.png")],
    [32, path.join(root, "public/favicon-32x32.png")],
    [180, path.join(root, "public/apple-touch-icon.png")],
    [192, path.join(root, "public/android-chrome-192x192.png")],
    [512, path.join(root, "public/android-chrome-512x512.png")],
    [32, path.join(root, "src/app/icon.png")],
    [180, path.join(root, "src/app/apple-icon.png")],
  ];

  for (const [size, file] of squareOutputs) {
    await writeSquarePng(square, size, file);
  }

  for (const [size, file] of circularOutputs) {
    await writeCircularPng(square, size, file);
  }

  const portrait = await square.clone().resize(480, 480).png().toBuffer();
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 242, g: 242, b: 242 },
    },
  })
    .composite([{ input: portrait, left: 72, top: 75 }])
    .png()
    .toFile(path.join(root, "public/og.png"));
  console.log("wrote public/og.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
