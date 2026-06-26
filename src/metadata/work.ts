import { uniqueTags } from "@/components/cards/about/experiences";
import { title } from "@/constants/strings";
import { Metadata } from "next";
import rootMetadata from "./root";

const workTitle = title + " | Experience";
const workDescription =
  "Teaching, language education, and cross-cultural experience.";

const workMetadata: Metadata = {
  ...rootMetadata,
  title: workTitle,
  description: workDescription,
  openGraph: {
    ...rootMetadata.openGraph,
    title: workTitle,
    description: workDescription,
  },
  twitter: {
    ...rootMetadata.twitter,
    title: workTitle,
    description: workDescription,
  },
  keywords: uniqueTags,
};

export default workMetadata;
