export const MAX_MESSAGE_LENGTH = 280;
export const MAX_NAME_LENGTH = 50;
export const FEED_LIMIT = 50;
export const DEFAULT_AUTHOR = "Anonymous";

export type Post = {
  id: string;
  author_name: string;
  message: string;
  photo_path: string | null;
  created_at: string;
};

export type PostDraft = {
  authorName: string;
  message: string;
};

export type ValidationResult =
  | { ok: true; value: { authorName: string; message: string } }
  | { ok: false; error: string };

export function validatePost({ authorName, message }: PostDraft): ValidationResult {
  const name = authorName.trim() || DEFAULT_AUTHOR;
  const text = message.trim();

  if (text.length === 0) {
    return { ok: false, error: "Write something before sharing." };
  }
  if (text.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Messages can be at most ${MAX_MESSAGE_LENGTH} characters.` };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Names can be at most ${MAX_NAME_LENGTH} characters.` };
  }
  return { ok: true, value: { authorName: name, message: text } };
}

/**
 * Adds a post to the feed, ignoring duplicates. The same post can arrive twice:
 * once from our own insert and once from the realtime subscription.
 */
export function addPostToFeed(feed: readonly Post[], post: Post): Post[] {
  if (feed.some((existing) => existing.id === post.id)) {
    return [...feed];
  }
  return [post, ...feed]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, FEED_LIMIT);
}
