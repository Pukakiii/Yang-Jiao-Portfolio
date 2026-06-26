const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-[150px] h-[150px] text-4xl",
  lg: "w-40 h-40 text-5xl",
};

export default function ProfileAvatar({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-full bg-teal-100/40 dark:bg-slate-500/20 flex items-center justify-center font-semibold text-dark dark:text-light shrink-0 " +
        sizeClasses[size] +
        " " +
        className
      }
      aria-hidden
    >
      YJ
    </div>
  );
}
