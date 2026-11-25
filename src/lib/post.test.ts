import { describe, expect, it } from "vitest";
import {
  addPostToFeed,
  DEFAULT_AUTHOR,
  FEED_LIMIT,
  MAX_MESSAGE_LENGTH,
  validatePost,
  type Post,
} from "./post";

function post(id: string, createdAt: string): Post {
  return { id, author_name: "Ana", message: "hi", photo_path: null, created_at: createdAt };
}

describe("validatePost", () => {
  it("trims the message and the name", () => {
    expect(validatePost({ authorName: "  Ana ", message: "  hello  " })).toEqual({
      ok: true,
      value: { authorName: "Ana", message: "hello" },
    });
  });

  it("falls back to the default author when the name is blank", () => {
    const result = validatePost({ authorName: "   ", message: "hello" });
    expect(result.ok && result.value.authorName).toBe(DEFAULT_AUTHOR);
  });

  it("rejects an empty message", () => {
    expect(validatePost({ authorName: "Ana", message: "   " }).ok).toBe(false);
  });

  it("accepts exactly the maximum length and rejects one more", () => {
    const max = "a".repeat(MAX_MESSAGE_LENGTH);
    expect(validatePost({ authorName: "", message: max }).ok).toBe(true);
    expect(validatePost({ authorName: "", message: `${max}a` }).ok).toBe(false);
  });

  it("rejects a name that is too long", () => {
    expect(validatePost({ authorName: "n".repeat(51), message: "hi" }).ok).toBe(false);
  });
});

describe("addPostToFeed", () => {
  it("keeps the newest post first", () => {
    const older = post("1", "2026-01-01T10:00:00Z");
    const newer = post("2", "2026-01-01T11:00:00Z");
    expect(addPostToFeed([older], newer).map((p) => p.id)).toEqual(["2", "1"]);
  });

  it("orders by time even if a post arrives late", () => {
    const newest = post("3", "2026-01-01T12:00:00Z");
    const late = post("2", "2026-01-01T11:00:00Z");
    expect(addPostToFeed([newest], late).map((p) => p.id)).toEqual(["3", "2"]);
  });

  it("ignores a post that is already in the feed", () => {
    const first = post("1", "2026-01-01T10:00:00Z");
    expect(addPostToFeed([first], { ...first })).toHaveLength(1);
  });

  it("caps the feed at the feed limit", () => {
    const feed = Array.from({ length: FEED_LIMIT }, (_, i) =>
      post(String(i), new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString()),
    );
    const result = addPostToFeed(feed, post("new", "2026-02-01T00:00:00Z"));
    expect(result).toHaveLength(FEED_LIMIT);
    expect(result[0].id).toBe("new");
  });
});
