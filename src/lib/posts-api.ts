import { buildPhotoPath } from "./photo";
import { FEED_LIMIT, type Post } from "./post";
import { supabase } from "./supabase";

const TABLE = "posts";
const PHOTO_BUCKET = "wall-photos";

export async function fetchLatestPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(FEED_LIMIT);

  if (error) throw error;
  return data;
}

/** Uploads the photo and returns its storage path (the database stores paths, not URLs). */
async function uploadPhoto(photo: File): Promise<string> {
  const path = buildPhotoPath(photo.type, crypto.randomUUID());
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, photo, { contentType: photo.type });

  if (error) throw error;
  return path;
}

export function getPhotoUrl(path: string): string {
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

type NewPost = {
  authorName: string;
  message: string;
  photo: File | null;
};

export async function createPost({ authorName, message, photo }: NewPost): Promise<Post> {
  const photoPath = photo ? await uploadPhoto(photo) : null;

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ author_name: authorName, message, photo_path: photoPath })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Calls onInsert for every post anyone shares. Returns a function that stops listening. */
export function subscribeToNewPosts(onInsert: (post: Post) => void): () => void {
  const channel = supabase
    .channel("public:posts")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: TABLE }, (payload) =>
      onInsert(payload.new as Post),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
