#!/usr/bin/env node
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public/images/flowers");

/** Max longest edge — 2× display cap (720px) for retina, keeps repo lean. */
const MAX_LONG_EDGE = 1440;

const SOURCES = [
  {
    input: "evie-s-vz3IQy0LOaA-unsplash.jpg",
    output: "home.png",
    page: "home",
  },
  {
    input: "katriona-mccarthy-l7B7VjYL7pk-unsplash.jpg",
    output: "about.png",
    page: "about",
  },
  {
    input: "pawel-czerwinski-jtes8PJxxj8-unsplash.jpg",
    output: "work.png",
    page: "work",
  },
  {
    input: "han-chenxu-s87ngBxo4xg-unsplash.jpg",
    output: "contact.png",
    page: "contact",
  },
];

/** Feather near-white and light gray backgrounds so no box shows on page bg. */
function alphaForPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const saturation = max - min;
  const avg = (r + g + b) / 3;

  if (min >= 240 && saturation <= 30) return 0;
  if (min >= 228 && saturation <= 22) return 0;
  if (avg >= 232 && saturation <= 40) return 0;

  if (min >= 200 && saturation <= 35) {
    const t = Math.max(0, Math.min(1, (min - 200) / 40));
    return Math.round(255 * t);
  }

  if (avg >= 200 && saturation <= 45) {
    const t = Math.max(0, Math.min(1, (avg - 200) / 50));
    return Math.round(255 * t);
  }

  return 255;
}

function toPastel([r, g, b], mix = 0.35) {
  return [
    Math.round(255 - (255 - r) * mix),
    Math.round(255 - (255 - g) * mix),
    Math.round(255 - (255 - b) * mix),
  ];
}

function toDarkTint([r, g, b]) {
  const mix = 0.72;
  return [
    Math.round(r * (1 - mix)),
    Math.round(g * (1 - mix)),
    Math.round(b * (1 - mix)),
  ];
}

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")
  );
}

async function samplePalette(inputPath) {
  const { data } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = alphaForPixel(data[i], data[i + 1], data[i + 2]);
    if (alpha <= 200) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  if (!count) return null;

  const dominant = [
    Math.round(r / count),
    Math.round(g / count),
    Math.round(b / count),
  ];

  return {
    dominant,
    pastel: toPastel(dominant),
    darkTint: toDarkTint(dominant),
  };
}

async function removeWhiteBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = alphaForPixel(data[i], data[i + 1], data[i + 2]);
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const paletteReport = {};

  for (const { input, output, page } of SOURCES) {
    const inputPath = path.join(root, input);
    if (!fs.existsSync(inputPath)) {
      console.warn(`skip (missing): ${input}`);
      continue;
    }

    const palette = await samplePalette(inputPath);
    if (palette) {
      paletteReport[page] = {
        pageBackground: rgbToHex(palette.pastel),
        pageBackgroundDark: rgbToHex(palette.darkTint),
        dominant: rgbToHex(palette.dominant),
      };
    }

    const outPath = path.join(outDir, output);
    const processed = await removeWhiteBackground(inputPath);
    const meta = await processed.metadata();

    const longEdge = Math.max(meta.width, meta.height);
    const resizeOpts =
      longEdge > MAX_LONG_EDGE
        ? meta.width >= meta.height
          ? { width: MAX_LONG_EDGE }
          : { height: MAX_LONG_EDGE }
        : {};

    const resized = processed.resize({
      ...resizeOpts,
      fit: "inside",
      withoutEnlargement: true,
    });

    const outMeta = await resized.metadata();
    await resized
      .png({ compressionLevel: 9, palette: true, effort: 10 })
      .toFile(outPath);
    console.log(
      `wrote ${outPath} (${outMeta.width}x${outMeta.height}, ${Math.round(fs.statSync(outPath).size / 1024)}KB)`,
    );

    paletteReport[`${page}_dimensions`] = {
      nativeWidth: outMeta.width,
      nativeHeight: outMeta.height,
    };
  }

  if (Object.keys(paletteReport).length) {
    console.log("\nSampled page backgrounds (update flowers.ts if tuning):");
    console.log(JSON.stringify(paletteReport, null, 2));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
