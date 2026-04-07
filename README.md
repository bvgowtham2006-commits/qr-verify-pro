# QR Verify Pro 🚀

A premium, mobile-first QR data collection app with unique mobile number verification, powered by React and Supabase.

## Features
- **Modern UI**: Dark-themed, animated interface using Framer Motion and Lucide icons.
- **Unique Check**: Automatically prevents duplicate mobile number submissions.
- **Mobile Optimized**: Designed for easy scanning and fast data entry via browser autofill.
- **Admin View**: Access all submissions by adding `?view=admin` to the URL.

## Setup Instructions

1. **Supabase Project**:
   - Create a project at [supabase.com](https://supabase.com/).
   - Run the following SQL in the SQL Editor:
     ```sql
     CREATE TABLE submissions (
       id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       mobile TEXT UNIQUE NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
2. **Environment Variables**:
   - Rename `.env.example` to `.env`.
   - Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3. **Install & Run**:
   ```bash
   npm install
   npm run dev
   ```

## Deployment to GitHub Pages 🌐

1. **Install GitHub Pages package**:
   ```bash
   npm install gh-pages --save-dev
   ```
2. **Update `package.json`**:
   - Add `"homepage": "https://<your-username>.github.io/qr-verify-pro"`
   - Add these scripts:
     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
     ```
3. **Deploy**:
   ```bash
   npm run deploy
   ```

## Usage
- **Display QR**: Open the base URL.
- **Fill Form**: Scan the QR or visit `?view=form`.
- **View Data**: Visit `?view=admin`.
