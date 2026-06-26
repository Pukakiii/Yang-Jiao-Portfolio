import { author } from "@/constants/strings";
import cardStyle from "../styles/card";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className={
        cardStyle +
        "!py-3 my-6 flex flex-col sm:flex-row items-center justify-center rounded-3xl sm:justify-between w-full text-sm text-neutral-500 text-center gap-3 h-fit"
      }
    >
      <p>{author}</p>
      <p>© {year}</p>
    </footer>
  );
}

export default Footer;
