# Dad's 50th Birthday Invitation

A cinematic invitation: doors open → curtains part → "You're Invited" with a big gold 50 →
photos → message → scratch-to-reveal date → countdown → details → RSVP → confetti finale.
Plain HTML + CSS + JavaScript. No installs, no backend.

```
birthday-invitation/
├── index.html      ← the page structure (sections)
├── style.css       ← colours, fonts, animations
├── script.js       ← behaviour (you rarely touch this)
├── config.js       ← ★ YOUR DETAILS GO HERE ★
└── assets/
    ├── images/     ← put Dad's photos here
    └── audio/      ← put music.mp3 here (optional)
```

---

## 1. Run it on your computer

1. Install **Visual Studio Code** (code.visualstudio.com) if you haven't.
2. Open the `birthday-invitation` folder in VS Code (File → Open Folder).
3. Easiest preview: install the **Live Server** extension (Extensions icon → search "Live Server" → Install).
   Right-click `index.html` → **Open with Live Server**. The page refreshes every time you save.
   (Double-clicking `index.html` also works, but Live Server is nicer.)
4. Tap **Open Invitation** to test the doors.

**Checking for errors:** in Chrome press `F12` → **Console** tab. Red text = a problem.
(Two harmless 404s for missing photos/music are normal until you add them.)

---

## 2. Add the real details — `config.js`

Open `config.js`. Change only the text inside the "quotes".

| Setting | What it does |
|---|---|
| `celebrantName` | Dad's name on the reveal screen |
| `age` | The big number (keep as text, e.g. `"50"`) |
| `occasion` | Small line under the big 50 |
| `hostName` | "With love, ..." (empty `""` hides it) |
| `eventDate` | `YYYY-MM-DD` — e.g. `"2027-03-14"` |
| `startTime` | 24-hour: `"19:00"` = 7 PM (empty hides the time) |
| `utcOffset` | Party's time zone. India = `"+05:30"` |
| `durationHours` | Length of party (for calendar entries) |
| `venueName`, `venueAddress` | Where. A Directions button is made automatically |
| `mapsLink` | Optional: paste a Google Maps share link instead |
| `dressCode` | e.g. `"Black & Gold"`. Empty = hidden |
| `rsvpDeadline` | `"2026-12-20"` or text like `"Please reply by 20 Dec"` |
| `rsvpLink` | Google Forms link. Empty = RSVP section hidden |
| `schedule` | Optional timeline. Empty `[]` = hidden |
| `invitationMessage` | Your message. `{name}` and `{age}` fill in automatically |
| `photos` | List of photo files (see below) |
| `musicEnabled`, `musicFile` | Music on/off and file path |

**Preview-mode bar:** while any `[bracketed]` placeholder is left, a red bar shows at the top.
Once every `[bracket]` is replaced with real text, it disappears. Don't share the link while you can see it.

**RSVP note:** a website like this can't store replies by itself. Create a free
Google Form (name + number of guests), copy its "Send" link, paste it in `rsvpLink`.
Guests reply there, and you see responses in Google Forms.

---

## 3. Photos — how to add GOOD ones

### Step by step
1. Pick photos (tips below).
2. Make them smaller (below).
3. Copy them into `assets/images/`.
4. Name them simply, no spaces: `dad-portrait.jpg`, `dad-memory-1.jpg`, ...
5. In `config.js`, list them:

```js
photos: [
  "assets/images/dad-portrait.jpg",                                    // 1st = big arch portrait
  { src: "assets/images/dad-memory-1.jpg", caption: "Goa, 2015" },    // with a caption
  { src: "assets/images/dad-memory-2.jpg", position: "center top" },  // keeps the face visible
  "assets/images/dad-memory-3.jpg"
],
```
- Want fewer photos? Delete lines. More? Add lines (commas between them, none after the last).
- Face cut off? Add `position: "center top"` (or `"center 20%"`) to that photo.
- A missing file never breaks the page: in preview mode you see a labelled box, and for guests it's just left out.
- The finale uses the first photo by default. Set `finalePhoto: "assets/images/other.jpg"` to change it.

### Which photos look best
- **Portrait:** one clear, well-lit, front-facing photo. The frame is tall (3:4), so a vertical photo with the face in the upper half is ideal.
- **Gallery:** 3 to 6 photos across his life (young, family, trips). Mix of close-ups and wider shots.
- Pick **sharp** photos with daylight or warm light. Avoid blurry, dark, or heavily filtered ones.
- Original photos from the phone gallery are better than WhatsApp-forwarded ones (WhatsApp shrinks and blurs them).
- Old printed photos: scan them or photograph them in daylight, flat, no flash.
- The site adds a slight warm tone to all photos automatically so they look consistent.

### Size and format (important for phones)
- Format: **JPG**.
- Portrait: about **1200 × 1600 px**. Gallery photos: about **1000 × 1250 px**.
- Each file should be **under 300 KB**.
- Easy free tool: **squoosh.app** (open the photo → choose MozJPEG → quality 75 → resize width → download). Or squoosh/“Photos → Export → smaller size” on your computer.

---

## 4. Music (optional)

1. Get a **royalty-free** track (e.g. Pixabay Music, YouTube Audio Library). Don't use copyrighted film/pop songs: they can get your link flagged.
2. Rename it `music.mp3` and put it in `assets/audio/`.
3. Done. Music starts when the guest taps "Open Invitation", and a small ♪ button (top right) turns it off.

No file = no button, and everything else works normally. To turn it off completely: `musicEnabled: false`.

---

## 5. Change colours and fonts — `style.css`

Top of the file, `:root { ... }`:
- `--gold`, `--gold-light`: the gold shades
- `--burgundy`: curtain colour (curtains use fixed reds in `.curtain`, search for `#6d1c30` to change)
- `--black`: page background
- Fonts: change the three `--font-...` lines (and the Google Fonts link in `index.html`).

---

## 6. How the code works (short version)

- **index.html**: one `<section>` per screen (hero, memories, message, dateSection, countdown, details, rsvp, finale). The texts inside are placeholders; `script.js` fills them from `config.js`.
- **style.css**: numbered sections at the top. Doors/curtains are in section 3, animations in section 12.
- **script.js**: lettered parts (A–K). Door opening = E, music = F, scratch card = H, countdown = I, calendar and maps = J. All of them read `config.js`.
- **config.js**: the only file for your content.

### Common problems
| Problem | Fix |
|---|---|
| Page is blank / stuck on doors | Press F12 → Console. Usually a missing comma or quote in `config.js`. Compare with the original. |
| Photo doesn't show | File name in `config.js` must match exactly (capital letters, `.jpg` vs `.jpeg`). |
| Countdown/date missing | `eventDate` must look like `"2027-03-14"`. |
| No Directions button | Fill `venueName`/`venueAddress` (without [brackets]) or paste `mapsLink`. |
| Changes don't appear online | You must commit + push again (section 8), then wait about 1 minute. |
| No music on iPhone | Make sure the mp3 plays on its own; silent-mode switch can mute it. |

---

## 7. Test before sharing

- Phone (via the online link) and laptop: doors open, curtains part, scratch the date (or tap "reveal"), tap Directions, Add to Calendar, RSVP.
- Photos all show and aren't cut oddly. Turn the music on and off.
- No red "PREVIEW MODE" bar.
- Ask someone else to open it on their phone first.

---

## 8. Put it online (free) — GitHub + Vercel

**A. GitHub (stores your files)**
1. Create a free account at github.com.
2. Click **+ → New repository**. Name: `dad-50th-invitation`. Public or Private both work. **Create repository**.
3. On the empty repo page click **uploading an existing file**.
4. Drag **everything inside** your `birthday-invitation` folder (index.html, style.css, script.js, config.js and the `assets` folder) into the page. (Drag the contents, not the outer folder, so `index.html` is at the top level.)
5. Click **Commit changes**.

**B. Vercel (makes the public link)**
1. Go to vercel.com → **Sign Up** → **Continue with GitHub**.
2. **Add New… → Project** → find `dad-50th-invitation` → **Import**.
3. Settings: **Framework Preset = Other**. Leave Build Command and Output Directory **empty**. Root Directory = `./`.
4. Click **Deploy**. After ~30 seconds you get a link like `https://dad-50th-invitation.vercel.app`.
5. Open that link on your phone to test. Share it on WhatsApp.

**C. Updating later**
Edit the file → on GitHub open the file → pencil icon → change → **Commit changes**
(or for new photos: **Add file → Upload files**). Vercel redeploys by itself in about a minute.
To undo: GitHub → the file → History → open an older version.

Tip: the link preview on WhatsApp will show the title "You're Invited · 50th Birthday Celebration".

---

## 9. Suggested order to work in

1. Run it locally. 2. Fill `config.js`. 3. Add photos. 4. Tweak colours if you like. 5. Add music. 6. Test on phone + laptop. 7. Deploy. 8. Improve and re-upload.
At each step: change one thing, save, refresh, check. If something breaks, undo your last change.

## 10. What you still need to provide
Dad's name, date, time, venue + address, family name, 3–6 photos, (optional) dress code, RSVP Google Form link, music file.
