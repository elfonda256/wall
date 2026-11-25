import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./time";

const now = new Date("2026-01-10T12:00:00Z");

describe("formatRelativeTime", () => {
  it("says just now for the last minute", () => {
    expect(formatRelativeTime("2026-01-10T11:59:30Z", now)).toBe("just now");
  });

  it("formats minutes and hours", () => {
    expect(formatRelativeTime("2026-01-10T11:55:00Z", now)).toBe("5 minutes ago");
    expect(formatRelativeTime("2026-01-10T09:00:00Z", now)).toBe("3 hours ago");
  });

  it("says yesterday for one day ago", () => {
    expect(formatRelativeTime("2026-01-09T12:00:00Z", now)).toBe("yesterday");
  });
});
