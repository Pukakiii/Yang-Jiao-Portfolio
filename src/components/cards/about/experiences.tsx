import DevicesIcon from "@/assets/icons/devices";
import CardTitle from "@/shared/components/titles/card-title";
import cardStyle from "@/shared/styles/card";
import tagStyle from "@/shared/styles/tag";

const skillTags = [
  "Mandarin Chinese",
  "English (IELTS 6.5)",
  "Bilingual Communication",
  "Teaching Support",
  "Cross-cultural Communication",
  "Leadership",
  "Research & Writing",
  "Microsoft Office",
];

export const uniqueTags = skillTags;

export default function ExperiencesCard({ className }: { className?: string }) {
  return (
    <div className={cardStyle + className}>
      <CardTitle title="SKILLS" icon={<DevicesIcon />} />
      <div className="h-5" />
      <div className="flex flex-wrap w-full gap-2">
        {skillTags.map((tag) => (
          <span key={tag} className={tagStyle + "text-2xs opacity-95"}>
            {tag}
          </span>
        ))}
        <a
          href="/work"
          key="more"
          className={
            tagStyle +
            "text-2xs font-medium opacity-95 !text-white !bg-black dark:!text-black dark:!bg-white after:content-['_→']"
          }
        >
          View Experience
        </a>
      </div>
    </div>
  );
}
