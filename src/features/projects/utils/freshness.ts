// /src/features/projects/utils/freshness.ts
'use strict';

/**
 * isFresh: returns true if timestampIso is within ttlMs from now.
 */
export function isFresh(timestampIso?: string, ttlMs = 60 * 60 * 1000): boolean {
  if (!timestampIso) return false;
  const ts = Date.parse(timestampIso);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts <= ttlMs;
}

/**
 * ageHumanized: "x minutes ago", "y hours ago", etc.
 */
export function ageHumanized(timestampIso?: string): string {
  if (!timestampIso) return '';
  const diff = Date.now() - Date.parse(timestampIso);
  if (Number.isNaN(diff)) return '';

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
