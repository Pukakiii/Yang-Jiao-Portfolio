import { about } from '@/constants/strings';
import ProfileAvatar from '@/shared/components/profile-avatar';
import cardStyle from '@/shared/styles/card';

export default function FullAboutCard() {
  return (
    <div className={cardStyle + '!py-12 !px-4'}>
      <div className="w-full flex flex-col items-center justify-center text-center gap-3">
        <ProfileAvatar size="md" className="p-3" />
        <p className="text-xl font-bold py-4">
          <a className="opacity-70">Hi, I{"'"}m Viola</a>👋
        </p>
        <p className="opacity-95 text-3xl font-bold">
          Passionate about{' '}
          <a href="/work" className="underline underline-offset-4">
            Education
          </a>
          .
        </p>
        <p className="text-lg text-neutral-500 py-3">
          an{' '}
          <a className="font-semibold text-dark dark:text-light/90">
            education professional
          </a>{' '}
          based in Nottingham, UK.
        </p>
        <p className="text-[17px] text-neutral-500 2xs:px-2 xs:px-5 leading-relaxed">
          {about}
        </p>
      </div>
    </div>
  );
}
