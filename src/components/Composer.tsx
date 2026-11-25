"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { ACCEPTED_PHOTO_TYPES, validatePhoto } from "@/lib/photo";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, validatePost } from "@/lib/post";

type ComposerProps = {
  onShare: (input: { authorName: string; message: string; photo: File | null }) => Promise<void>;
};

export function Composer({ onShare }: ComposerProps) {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<{ file: File; previewUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const ids = { name: useId(), message: useId(), photo: useId(), counter: useId() };

  const remaining = MAX_MESSAGE_LENGTH - message.length;
  const canShare = message.trim().length > 0 && !isSharing;

  /** Swaps the selected photo, releasing the old preview URL so it does not leak memory. */
  function replacePhoto(file: File | null) {
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    setPhoto(file ? { file, previewUrl: URL.createObjectURL(file) } : null);
  }

  function clearPhoto() {
    replacePhoto(null);
    setFileInputKey((key) => key + 1);
  }

  function handlePhotoChange(file: File | undefined) {
    if (!file) return;
    const photoError = validatePhoto(file);
    if (photoError) {
      setError(photoError);
      clearPhoto();
      return;
    }
    setError(null);
    replacePhoto(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePost({ authorName, message });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setIsSharing(true);
    setError(null);
    try {
      await onShare({ ...result.value, photo: photo?.file ?? null });
      setMessage("");
      clearPhoto();
    } catch {
      setError("Could not share your post. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-panel p-3">
      <label htmlFor={ids.message} className="mb-1 block text-xs font-bold text-ink">
        What&apos;s on your mind?
      </label>
      <textarea
        id={ids.message}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={MAX_MESSAGE_LENGTH}
        rows={3}
        aria-describedby={ids.counter}
        placeholder="Write something on the wall..."
        className="w-full resize-y border border-line-strong bg-white p-2 text-sm text-ink focus:border-brand focus:outline-none"
      />

      {photo && (
        <div className="relative mt-2 inline-block">
          <Image
            src={photo.previewUrl}
            alt="Selected photo preview"
            width={160}
            height={160}
            unoptimized
            className="max-h-40 w-auto border border-line object-contain"
          />
          <button
            type="button"
            onClick={clearPhoto}
            aria-label="Remove photo"
            className="absolute top-1 right-1 bg-ink/70 px-1.5 text-xs font-bold text-white hover:bg-ink"
          >
            ×
          </button>
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label htmlFor={ids.name} className="sr-only">
          Your name
        </label>
        <input
          id={ids.name}
          value={authorName}
          onChange={(event) => setAuthorName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Your name (optional)"
          className="w-full border border-line-strong bg-white px-2 py-1 text-xs text-ink focus:border-brand focus:outline-none sm:w-auto sm:min-w-0 sm:flex-1"
        />

        <label
          htmlFor={ids.photo}
          className="cursor-pointer border border-line-strong bg-panel-head px-2 py-1 text-xs font-bold text-ink hover:bg-line focus-within:outline-2 focus-within:outline-brand"
        >
          Add photo
          <input
            key={fileInputKey}
            id={ids.photo}
            type="file"
            accept={ACCEPTED_PHOTO_TYPES}
            onChange={(event) => handlePhotoChange(event.target.files?.[0])}
            className="sr-only"
          />
        </label>

        <span
          id={ids.counter}
          className={`text-xs tabular-nums ${remaining <= 20 ? "font-bold text-danger" : "text-muted"}`}
        >
          {remaining} characters left
        </span>

        <button
          type="submit"
          disabled={!canShare}
          className="ml-auto border border-brand-dark bg-brand px-4 py-1 text-xs font-bold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {isSharing ? "Sharing..." : "Share"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs font-bold text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
