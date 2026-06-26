import { instagramIcon, linkedinIcon } from "@/assets/icons/all-social";
import { instagramUrl, linkedinUrl, mail, universityMail } from "@/constants/strings";

const mailIconWhite = (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const linksCards = [
  {
    title: "Email",
    href: `mailto:${mail}`,
    className: "!bg-neutral-600 dark:!bg-neutral-700 p-3",
    icon: mailIconWhite,
  },
  {
    title: "University",
    href: `mailto:${universityMail}`,
    className: "!bg-teal-600 p-3",
    icon: mailIconWhite,
  },
  {
    title: "LinkedIn",
    href: linkedinUrl,
    className: "!bg-[#0A66C2] p-4",
    icon: linkedinIcon,
  },
  {
    title: "Instagram",
    href: instagramUrl,
    className: "!bg-transparent p-0",
    icon: instagramIcon,
  },
];

export default linksCards;
