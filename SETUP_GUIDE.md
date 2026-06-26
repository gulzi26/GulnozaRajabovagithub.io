# Putting "In the Margins" Online — Free, via GitHub Pages

This guide gets your site live at a free URL like `yourusername.github.io` in about 10 minutes. No coding required from here.

## What you have

A complete website with:
- **Homepage** (`index.html`) — hero section, three "shelves" (Books / Classroom / Journey), subscribe box
- **3 sample blog posts** in `posts/` — replace these with your own writing whenever you're ready
- **About page** (`about.html`)
- Styling and basic interactivity already built in (`style.css`, `script.js`)

## Step 1: Create a free GitHub account
Go to [github.com](https://github.com) and sign up (skip if you already have one).

## Step 2: Create a new repository
1. Click the **+** icon top-right → **New repository**
2. Name it exactly: `yourusername.github.io` (replace `yourusername` with your actual GitHub username — this exact format is what makes the free hosting work)
3. Set it to **Public**
4. Click **Create repository**

## Step 3: Upload your site files
1. On your new repository page, click **uploading an existing file**
2. Drag in all the files and folders from this site (`index.html`, `about.html`, `style.css`, `script.js`, and the whole `posts/` folder)
3. Scroll down, click **Commit changes**

## Step 4: Turn on GitHub Pages
1. In your repository, go to **Settings** → **Pages** (left sidebar)
2. Under "Branch," select **main** and **/ (root)**, then **Save**
3. Wait 1–2 minutes — GitHub will give you a live link: `https://yourusername.github.io`

That's it. Your site is now live, free, forever, with no ads or branding.

## Editing posts later
- To add a new post: duplicate one of the files in `posts/`, rename it, edit the text inside, then add a matching `<article class="post-card">` block to `index.html` so it shows up in the list.
- You don't need any special software — GitHub lets you edit files directly in the browser (click the pencil icon on any file), or you can edit locally and re-upload.

## About the subscribe form
Right now the email subscribe box is just a placeholder — it doesn't send real emails yet. To make it work, the easiest free option is:
- **Buttondown** or **MailerLite** (free tiers) — sign up, get an embed/API snippet, and I can wire it into the existing form in `script.js` whenever you're ready.

## Want a custom domain later?
GitHub Pages supports connecting a real domain name (like `inthemargins.com`) if you ever buy one — just ask and I'll walk you through the DNS setup.

---

## Setting up the comments (Giscus)

Comments now appear on **every blog post** and on the dedicated Guestbook page. They're powered by **Giscus** — a free comment system that stores comments as GitHub Discussions on your own repository. It needs a one-time setup:

1. Go to your repository → **Settings** → scroll to **Features** → make sure **Discussions** is checked/enabled
2. Go to [giscus.app](https://giscus.app)
3. Under "Repository," type your repository name (e.g. `gulzi26/GulnozaRajabovagithub.io`) and follow the on-page checks (it will tell you if Discussions isn't enabled yet)
4. Choose **Discussion category**: "General" works well
5. The page will generate a code snippet with your real `data-repo-id` and `data-category-id` values
6. You need to paste these same three real values into **6 files**: `guestbook.html` and all 5 files inside `posts/`. In each file, find the `<script src="https://giscus.app/client.js"...>` block and replace:
   - `data-repo="REPLACE-WITH-username/repo"`
   - `data-repo-id="REPLACE-WITH-repo-id"`
   - `data-category-id="REPLACE-WITH-category-id"`
7. Save and re-upload the changed files to your repository

Once that's done, anyone visiting any post or the Guestbook page can leave a real comment — it'll need a free GitHub account to comment (which keeps spam low), and you'll be able to see and moderate everything from your repository's Discussions tab. Since comments use `data-mapping="pathname"`, each post automatically gets its own separate comment thread.

## Adding new books to the Book Exchange page

Open `bookshelf.html` and duplicate one of the `<article class="book-card">` blocks, then edit the title, author, note, and status pill (`status-lend`, `status-want`, or `status-read`) to match the new book.

## How the share buttons work

Each post has three share buttons that need no setup:
- **Copy link** — copies that post's URL to the clipboard
- **Share to WhatsApp** — opens WhatsApp with the post title and link pre-filled
- **Copy caption for Instagram** — copies a ready-made caption (Instagram doesn't allow direct post-sharing from outside its app, so this is the easiest workaround: copy the caption, then paste it into an Instagram post or story along with a screenshot or the link in your bio)



---

Questions or want help adding your first real post? Just come back and ask.
