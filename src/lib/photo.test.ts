import { describe, expect, it } from "vitest";
import { buildPhotoPath, MAX_PHOTO_BYTES, validatePhoto } from "./photo";

describe("validatePhoto", () => {
  it("accepts a small JPEG", () => {
    expect(validatePhoto({ type: "image/jpeg", size: 1000 })).toBeNull();
  });

  it("rejects files that are not images", () => {
    expect(validatePhoto({ type: "application/pdf", size: 1000 })).not.toBeNull();
  });

  it("rejects photos over the size limit", () => {
    expect(validatePhoto({ type: "image/png", size: MAX_PHOTO_BYTES + 1 })).not.toBeNull();
  });
});

describe("buildPhotoPath", () => {
  it("uses the id and the extension for the type", () => {
    expect(buildPhotoPath("image/webp", "abc")).toBe("abc.webp");
  });
});
