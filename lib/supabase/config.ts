/**
 * Public Supabase configuration.
 *
 * These values are safe to expose to the browser — the anon key is
 * designed to be public and is protected by Row Level Security (RLS)
 * on the database. We hardcode them here as a fallback because Vercel
 * sometimes does not inline NEXT_PUBLIC_* env vars into the client
 * bundle when they are added after the first build.
 *
 * Env vars still take precedence if present (so you can override per
 * environment without changing code).
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://auqtahtvyxdjgevdspai.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1cXRhaHR2eXhkamdldmRzcGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNjc3ODQsImV4cCI6MjEwMDg0Mzc4NH0.bjtnvMV6aSCGHn4JwpZE6yi42UZZRiVqRDrIARIBuNo";
