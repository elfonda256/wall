# Wall

A 2008-style profile wall built with Next.js (App Router), React 19, TypeScript, Tailwind CSS and Supabase.

Anyone can write a message (up to 280 characters), optionally add their name and a photo, and press **Share**. Posts are stored in Supabase, the feed shows the 50 newest posts first, and new posts appear for every visitor in real time without a page refresh.

## Features

- Share a message with an optional name (blank names post as "Anonymous")
- 280-character limit with a live counter, enforced in the UI and in the database
- Feed of the 50 newest posts, newest first, kept after refresh
- Live updates through Supabase Realtime
- Optional photo upload (JPG, PNG, WebP or GIF, up to 5 MB) to Supabase Storage
- Responsive layout; labelled form controls, error messages announced to screen readers

## Getting started

Requires Node.js 20.9 or later and a Supabase project.

1. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql). It creates the `posts` table, the row level security policies, the realtime publication and the `wall-photos` storage bucket.
2. Copy `.env.example` to `.env.local` and fill in the project URL and the publishable key (Project Settings → API Keys).
3. Run:

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (Vitest)
npm run lint
npm run build && npm start
```

On Vercel, add the same two variables under Project → Settings → Environment Variables.

## Project structure

```
src/
├── app/
│   ├── layout.tsx         # HTML shell, metadata
│   ├── page.tsx           # Header, profile sidebar and wall
│   └── globals.css        # Theme colours and font
├── components/
│   ├── Wall.tsx           # Client component: composer + feed
│   ├── Composer.tsx       # Name, message, photo, Share
│   ├── Feed.tsx           # Loading, error, empty and list states
│   ├── PostItem.tsx       # One post
│   ├── ProfileSidebar.tsx # Wall owner's photo and details
│   └── Avatar.tsx         # Photo or initials
├── hooks/
│   └── useWall.ts         # Loads posts, subscribes to new ones, shares
└── lib/
    ├── post.ts            # Post type, validation, feed merging (pure)
    ├── photo.ts           # Photo validation and storage path (pure)
    ├── time.ts            # "5 minutes ago" formatting (pure)
    ├── posts-api.ts       # Supabase queries, uploads and realtime
    ├── supabase.ts        # Supabase client
    ├── profile.ts         # Wall owner details
    └── *.test.ts          # Unit tests for the pure modules
supabase/
└── schema.sql             # Table, policies, realtime, storage bucket
```

## Design decisions

- **Pure logic is separated from Supabase and React.** Validation, feed merging and time formatting live in `src/lib` as plain functions with unit tests. `posts-api.ts` is the only file that talks to Supabase, and `useWall` is the only place that connects it to React state.
- **The database enforces the rules too.** Check constraints limit names to 50 characters and messages to 280, so the limits hold even if someone calls the API directly.
- **Row level security allows read and insert only.** There is no login, so anyone may post, but no policy allows updating or deleting posts.
- **Photos are stored as paths, not URLs.** The `photo_path` column only accepts `<uuid>.<ext>`, and the app builds the public URL itself. This stops anyone from inserting a link to an image hosted elsewhere.
- **One merge function for every source of posts.** A post you share arrives twice: from your own insert and from the realtime event. `addPostToFeed` ignores duplicates by id, keeps the newest first and caps the feed at 50, so the initial load, your own posts and other people's posts all go through the same code.
- **Client-side data loading.** The feed loads in the browser and then listens for new posts. It keeps the data flow in one place and is easy to follow.
- **Known limits.** There is no spam protection or moderation; a production version would add rate limiting and a way to report posts.
