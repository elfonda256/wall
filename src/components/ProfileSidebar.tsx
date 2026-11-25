import { PROFILE } from "@/lib/profile";
import { Avatar } from "./Avatar";

export function ProfileSidebar() {
  return (
    <aside className="flex flex-col gap-4 sm:w-52 sm:shrink-0">
      <div className="flex items-center gap-3 sm:block">
        <div className="sm:hidden">
          <Avatar name={PROFILE.name} photoUrl={PROFILE.photoUrl} size={64} />
        </div>
        <div className="hidden sm:block">
          <Avatar name={PROFILE.name} photoUrl={PROFILE.photoUrl} size={200} />
        </div>
        <h1 className="text-lg font-bold text-ink sm:hidden">{PROFILE.name}</h1>
      </div>

      <section className="border border-line bg-panel">
        <h2 className="border-b border-line bg-panel-head px-2 py-1 text-xs font-bold text-ink">
          Information
        </h2>
        <dl className="space-y-2 px-2 py-2 text-xs">
          {PROFILE.details.map(({ label, value }) => (
            <div key={label}>
              <dt className="font-bold text-muted">{label}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
}
