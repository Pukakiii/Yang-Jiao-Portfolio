import { shortAbout } from "@/constants/strings";
import CardButton from "@/shared/components/buttons/card-button";
import CardTitle from "@/shared/components/titles/card-title";
import ProfileAvatar from "@/shared/components/profile-avatar";
import cardStyle from "@/shared/styles/card";
import { scrollToTop } from "@/shared/utils/window";
import Link from "next/link";

export default function PreviewAboutCard({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cardStyle + className}>
      <div className="flex flex-row w-full">
        <div className="flex flex-col flex-grow">
          <CardTitle title="YANG JIAO" />
          <p className="text-xl font-medium mt-4">Hi, I{"'"}m Yang 👋</p>
        </div>
        <div className="px-3 py-2">
          <ProfileAvatar size="sm" className="hidden 2xs:flex" />
        </div>
      </div>
      <span className="text-base font-normal opacity-70 leading-relaxed mt-3 mb-6">
        {shortAbout}
      </span>
      <Link
        onClick={() => {
          scrollToTop();
        }}
        href="/about"
        className="hover:animate-scale"
      >
        <CardButton title="LEARN MORE" />
      </Link>
    </div>
  );
}
