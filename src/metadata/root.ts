import { description, og, title } from "@/constants/strings";
import { Metadata } from "next";
import metadataBuilder from "./builder";

const rootMetadata: Metadata = metadataBuilder(title, description, {
  keywords: [
    "Education",
    "Teaching",
    "Language Education",
    "Nottingham",
    "Bilingual",
    "Cross-cultural Communication",
  ],
  og,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
});

export default rootMetadata;
