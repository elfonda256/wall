import Image from "next/image";

type AvatarProps = {
  name: string;
  photoUrl?: string | null;
  size: number;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function Avatar({ name, photoUrl, size }: AvatarProps) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 border border-line object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="grid shrink-0 place-items-center border border-line bg-brand-soft font-bold text-brand"
    >
      {initials(name)}
    </div>
  );
}
