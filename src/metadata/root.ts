import { description, title } from "@/constants/strings";
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
});

export default rootMetadata;
