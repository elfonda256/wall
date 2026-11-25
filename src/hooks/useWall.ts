import { useEffect, useState } from "react";
import { addPostToFeed, type Post } from "@/lib/post";
import { createPost, fetchLatestPosts, subscribeToNewPosts } from "@/lib/posts-api";

type Status = "loading" | "ready" | "error";

export function useWall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let isActive = true;

    fetchLatestPosts()
      .then((latest) => {
        if (!isActive) return;
        // Merge rather than replace, in case a realtime post arrived first.
        setPosts((current) => latest.reduce(addPostToFeed, current));
        setStatus("ready");
      })
      .catch(() => isActive && setStatus("error"));

    const unsubscribe = subscribeToNewPosts((post) =>
      setPosts((current) => addPostToFeed(current, post)),
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  async function share(input: Parameters<typeof createPost>[0]) {
    const post = await createPost(input);
    setPosts((current) => addPostToFeed(current, post));
  }

  return { posts, status, share };
}
