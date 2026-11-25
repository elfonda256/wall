import Image from "next/image";
import type { Post } from "@/lib/post";
import { getPhotoUrl } from "@/lib/posts-api";
import { formatRelativeTime } from "@/lib/time";
import { Avatar } from "./Avatar";

export function PostItem({ post }: { post: Post }) {
  return (
    <article className="flex gap-3 border-b border-line py-3 last:border-b-0">
      <Avatar name={post.author_name} size={40} />
      <div className="min-w-0 flex-1">
        <p className="text-sm break-words text-ink">
          <span className="font-bold text-brand">{post.author_name}</span> {post.message}
        </p>
        {post.photo_path && (
          <Image
            src={getPhotoUrl(post.photo_path)}
            alt={`Photo shared by ${post.author_name}`}
            width={480}
            height={480}
            sizes="(min-width: 640px) 480px, 100vw"
            className="mt-2 h-auto max-h-96 w-auto max-w-full border border-line object-contain"
          />
        )}
        <time dateTime={post.created_at} className="mt-1 block text-xs text-muted">
          {formatRelativeTime(post.created_at)}
        </time>
      </div>
    </article>
  );
}
