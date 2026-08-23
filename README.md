# Lively Engine - Dynamic Wallpaper Admin & Free-Tier Cloud Setup

**Built by:** StrawHats Studios  
**Developer Contact:** `strawhats.studios@gmail.com`  
**Package:** `ss.lively.engine`  
**App Name:** Lively Engine  

---

## 🌟 Overview
The **Lively Engine Web Admin Panel** allows you to create, simulate with live 3D physics, export, and dynamically publish 3D interactive motion wallpapers to your mobile app without recompiling the APK.

---

## 🚀 100% Free-Tier Cloud Database Setup Options

### Option 1: GitHub RAW Database (Recommended • 100% Free Forever)
No servers, no API costs, and unlimited bandwidth via GitHub CDN.

#### Setup Steps:
1. Create a free public repository on GitHub (e.g. `https://github.com/StrawHatsStudios/lively-engine-wallpapers`).
2. Generate a free GitHub Personal Access Token (PAT) with `repo` permissions at [github.com/settings/tokens](https://github.com/settings/tokens).
3. Open the **Lively Engine Admin Panel** in your browser (`index.html`).
4. Click **"⚡ Cloud Database Sync"** and enter:
   - **Repository:** `StrawHatsStudios/lively-engine-wallpapers`
   - **File Path:** `main/catalog.json`
   - **Token:** `ghp_yourPersonalAccessToken`
5. Click **"Sync Catalog to Cloud Now"**. Your wallpapers are instantly committed and live on GitHub!
6. In the **Lively Engine Android App**, tap the **Cloud Sync** icon on the top header and enter your Raw URL:
   ```
   https://raw.githubusercontent.com/StrawHatsStudios/lively-engine-wallpapers/main/catalog.json
   ```
   The app will automatically download, cache, and display newly published wallpapers!

---

### Option 2: Supabase Free Tier (PostgreSQL + REST API)
1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project and go to the **SQL Editor**. Run this SQL query to create the table:
   ```sql
   create table wallpapers (
       id text primary key,
       title text not null,
       category text,
       data jsonb not null,
       created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Allow public read access
   alter table wallpapers enable row level security;
   create policy "Public wallpapers are viewable by everyone" on wallpapers for select using (true);
   create policy "Service can insert/update" on wallpapers for all using (true);
   ```
3. Copy your **Project URL** (e.g. `https://xxxx.supabase.co`) and **Anon Key** into the Admin Panel's Cloud Sync modal.
4. Click **Sync Catalog to Cloud Now**.

---

## 🌐 1-Click Free Admin Panel Web Hosting

Deploy this admin dashboard for free at $0 forever:

### A. GitHub Pages
1. Push the `MotionCraftAdmin` directory to your GitHub repo.
2. Go to **Settings > Pages > Deploy from branch: main / root**.
3. Access your live admin at `https://strawhatsstudios.github.io/lively-engine-wallpapers`.

### B. Cloudflare Pages / Vercel / Netlify
- Drag and drop this folder onto **Vercel**, **Netlify Drop**, or **Cloudflare Pages** for instant SSL and global CDN deployment.
