# API & AI connection

## How to verify you're connected to the AI API

The app can generate blog content using **Groq** (preferred) or **Google Gemini**. You need at least one API key set.

### 1. Environment variables

In `server/.env` add:

- **Groq (preferred):**  
  `GROQ_API_KEY=your_groq_api_key`  
  Get a key at [console.groq.com](https://console.groq.com).

- **Gemini (fallback if Groq is not set):**  
  `GEMINI_API_KEY=your_gemini_api_key`  
  Get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

If both are set, **Groq is used first**. If neither is set, the server falls back to non-AI template content.

### 2. Check on server startup

After you run the server (`npm run dev` or `node server.js`), look at the console:

- **Groq configured:**  
  `✅ GROQ_API_KEY is configured (will be preferred for AI generation)`
- **Gemini configured:**  
  `✅ GEMINI_API_KEY is configured`
- **No Groq:**  
  `ℹ️ GROQ_API_KEY is not set, using Gemini or fallback templates.`
- **No Gemini:**  
  `ℹ️ GEMINI_API_KEY is not set, Gemini will be skipped if GROQ_API_KEY is available.`
- **No AI keys at all:**  
  When you trigger generation you’ll see:  
  `⚠️ No AI API key configured (GROQ_API_KEY or GEMINI_API_KEY). Using fallback content generation.`

So: if you see at least one `✅` for Groq or Gemini, your API connection is configured.

### 3. Test from the UI

1. Log in as a user who can add blogs (writer/admin).
2. Go to **Add Blog** (or equivalent flow).
3. Enter a **title** and **category**, then use the “Generate content” / AI button.
4. If the API is working:
   - The content box fills with generated HTML/text.
   - In the **server console** you should see something like:
     - `🤖 Starting Gemini AI content generation...`
     - `📝 Input: { title: '...', category: '...', subtitle: '...' }`
     - `⚙️ Using Groq API (llama-3.3-70b-versatile) for blog generation...` (when using Groq)
     - `✅ AI content generated successfully`
     - `📊 Tokens usage: { ... }`
     - `📄 Content preview: <h2>Introduction</h2> ...`
5. If you see an error in the UI (e.g. “Failed to generate AI content”) or a 400/401 in the network tab, check the server logs for the exact error (invalid key, model name, etc.).

### 4. Test with cURL (optional)

The AI generation endpoint is **POST** and requires **auth** (Bearer token).

```bash
# Replace YOUR_JWT_TOKEN with a real token (e.g. from login response).
# Replace http://localhost:5000 if your server runs on another port/host.

curl -X POST http://localhost:5000/api/blog/generateContent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test post","category":"Technology","subtitle":"Optional subtitle"}'
```

**Success:** HTTP 200 and JSON like:

```json
{
  "success": true,
  "message": "Blog content generated successfully",
  "data": { "content": "<h2>Introduction</h2> ..." }
}
```

**Failure:** HTTP 200 with `"success": false` and a `"message"` describing the error, or HTTP 401 if the token is missing/invalid. Check the server console for Groq/Gemini error details (e.g. invalid API key, model decommissioned).

### 5. Summary

| Check | What it means |
|-------|----------------|
| Startup log: `✅ GROQ_API_KEY is configured` | Groq will be used for AI generation. |
| Startup log: `✅ GEMINI_API_KEY is configured` | Gemini is available (used if Groq is not set). |
| UI “Generate content” fills the editor | Request reached the server and the AI API returned content. |
| Server log: `✅ AI content generated successfully` | AI (Groq or Gemini) responded successfully. |
| Server log: `⚠️ No AI API key configured` | Set `GROQ_API_KEY` or `GEMINI_API_KEY` in `server/.env`. |
| UI or curl: “Failed to generate AI content” | Check server logs for the exact API error (key, model, network). |

---

*Example server logs when generation works:*

```
🤖 Starting Gemini AI content generation...
📝 Input: { title: '...', category: '...', subtitle: '...' }
...
⚙️ Using Groq API (llama-3.3-70b-versatile) for blog generation...
✅ AI content generated successfully
📊 Tokens usage: { ... }
📄 Content preview: <h2>Introduction</h2> ...
```