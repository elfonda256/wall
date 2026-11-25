import type { Post } from "@/lib/post";
import { PostItem } from "./PostItem";

type FeedProps = {
  posts: Post[];
  status: "loading" | "ready" | "error";
};

export function Feed({ posts, status }: FeedProps) {
  if (status === "loading") {
    return <p className="py-4 text-sm text-muted">Loading the wall...</p>;
  }
  if (status === "error") {
    return (
      <p role="alert" className="py-4 text-sm font-bold text-danger">
        Could not load posts. Please refresh the page.
      </p>
    );
  }
  if (posts.length === 0) {
    return <p className="py-4 text-sm text-muted">No posts yet. Be the first to write on the wall!</p>;
  }

  return (
    <section aria-label="Wall posts" aria-live="polite">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </section>
  );
}
