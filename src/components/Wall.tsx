"use client";

import { useWall } from "@/hooks/useWall";
import { PROFILE } from "@/lib/profile";
import { Composer } from "./Composer";
import { Feed } from "./Feed";

export function Wall() {
  const { posts, status, share } = useWall();

  return (
    <div className="min-w-0 flex-1">
      <h1 className="hidden text-xl font-bold text-ink sm:block">{PROFILE.name}</h1>
      <nav aria-label="Profile sections" className="mt-2 mb-3 border-b border-line-strong">
        <span
          aria-current="page"
          className="-mb-px inline-block border border-b-white border-line-strong bg-white px-3 py-1 text-xs font-bold text-ink"
        >
          Wall
        </span>
      </nav>
      <Composer onShare={share} />
      <Feed posts={posts} status={status} />
    </div>
  );
}
