This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

---

## Project Requirements / Zaroori Cheezen

- Node.js (recommended v18+)
- npm / yarn / pnpm
- MongoDB (connection string in MONGO_DB_URL)
- Clerk account (for auth) — Clerk keys in environment variables

## Main API Endpoints (Quick)

- POST /api/ai  — file: `app/api/ai/route.js`
  - Requires authentication (Clerk). Request JSON: { chatId, prompt }
  - Returns AI-generated message object on success.

(Other app routes live under `app/api/*` — search `app/api` for more.)

## Environment variables (.env) — use `.env.local` or Vercel dashboard

A `.env.example` file has been added. Main variables used by the app:

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
- CLERK_SECRET_KEY=your_clerk_secret_key
- CLERK_SIGNIN_SECRET_KEY=your_clerk_signin_secret_key
- MONGO_DB_URL=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>

AI provider keys (one of these is required):
- DEEPSEEK_API_KEY=your_deepseek_api_key  (optional — paid)
- GEMINI_API_KEY=your_google_gemini_api_key (default in this project)

If BOTH are present, the app prefers DEEPSEEK_API_KEY (see config/Configs.js).

## API Key Sources / Links

- Google Gemini / Generative AI: https://developers.google.com/ai
- DeepSeek: https://api.deepseek.com  (use provider sign-up page to obtain an API key)
- Clerk (auth): https://clerk.com/docs

## How to add API keys (local & deployment)

1. Local (development): create a `.env.local` at project root with the variables above.
2. For deployment (Vercel/Netlify): add environment variables in the project settings (do not commit secrets).

Example `.env.local` snippet:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
CLERK_SIGNIN_SECRET_KEY=whsec_xxx
MONGO_DB_URL=mongodb+srv://user:pass@cluster0.mongodb.net/dbname
GEMINI_API_KEY=your_gemini_key_here
# or
# DEEPSEEK_API_KEY=your_deepseek_key_here
```

## Switching AI Providers (Gemini vs DeepSeek)

By default this project uses Google Gemini (see `app/api/ai/route.js`). To use DeepSeek instead:

1. In `config/Configs.js`, ensure `DEEPSEEK_API_KEY` is set in your environment (DEEPSEEK_API_KEY takes precedence when present).
2. In `app/api/ai/route.js`:
   - Comment out the Gemini initialization and response block (the `GoogleGenAI` usage).
   - Uncomment the DeepSeek `OpenAI`-compatible initialization and the DeepSeek response block. The file already contains the DeepSeek block commented with instructions — follow the comments around the `DEEPSEEK — OPTIONAL` section.

Example quick steps (edit in code):

- Comment this line (Gemini init):
  const ai = new GoogleGenAI({ apiKey: Configs.getAIProvider(), });

- Uncomment DeepSeek block (near top and the response block later):
  // const deepseek = new OpenAI({ apiKey: Configs.getDeepSeekAPIKey(), baseURL: "https://api.deepseek.com", });

- And uncomment the DeepSeek `response = await deepseek.chat.completions.create({...})` block later in the file.

Note: If you do not have a DeepSeek key, leaving the project as-is and setting GEMINI_API_KEY works fine.

## Security / Notes
- Never commit real API keys to git. Use `.env.local` or deployment env vars.
- `.env` in the repo contained example/test keys; replace them with real secrets or delete before publishing.

## Where AI logic lives
- AI route: `app/api/ai/route.js` (POST)
- Config for selecting provider: `config/Configs.js`

---

## Quick copy-paste samples (fast setup)

1) Minimal .env snippet (copy to `.env.local`):

```
# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
CLERK_SIGNIN_SECRET_KEY=whsec_xxx

# MongoDB
MONGO_DB_URL=mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>

# AI provider: provide ONE. If DEEPSEEK_API_KEY is set, it takes precedence.
GEMINI_API_KEY=your_gemini_api_key_here
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

2) Minimal `app/api/ai/route.js` example (Gemini default, DeepSeek optional):

```js
import Configs from "@/config/Configs";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai"; // used only for DeepSeek (OpenAI-compatible)

// GEMINI (default)
const ai = new GoogleGenAI({ apiKey: Configs.getAIProvider() });

// DEEPSEEK (optional - uncomment to use DeepSeek)
// const deepseek = new OpenAI({
//   apiKey: Configs.getAIProvider(),
//   baseURL: "https://api.deepseek.com",
// });

export default async function handler(req, res) {
  const { prompt } = req.body;

  // Gemini usage (default):
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
    store: true,
  });
  const geminiText = interaction.output_text;

  // DeepSeek usage (if you uncommented deepseek above):
  // const response = await deepseek.chat.completions.create({
  //   model: "deepseek-v4-pro",
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const deepseekText = response.choices[0].message.content;

  // Choose the text you want to send back. With default env, use geminiText.
  return res.status(200).json({ success: true, text: geminiText });
}
```

Notes:
- Do NOT commit `.env.local` with real keys. Use deployment env vars for production.- To switch providers: set `DEEPSEEK_API_KEY` in env and enable the DeepSeek block in `route.js` while disabling Gemini usage.

---

For more details about Next.js, see the original README links above.