import PageFloralBackground from "./page-floral-background";
import PageFloralDecor from "./page-floral-decor";

export default function FloralBackdrop() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-visible pointer-events-none"
      aria-hidden="true"
    >
      <PageFloralBackground />
      <PageFloralDecor />
    </div>
  );
}
