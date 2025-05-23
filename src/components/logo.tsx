import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = "md",
  rounded = true,
}: {
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  };

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative" style={dimensions[size]}>
        <Image
          src="/logo.png"
          alt="PlanPal Logo"
          width={dimensions[size].width}
          height={dimensions[size].height}
          className={`object-contain ${rounded && "rounded-full"}`}
        />
      </div>
      <span
        className={`font-bold ${
          size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"
        }`}
      >
        PlanPal
      </span>
    </Link>
  );
}
