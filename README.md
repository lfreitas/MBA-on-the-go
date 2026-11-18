# MBA On The Go

Bite-sized MBA lessons you can do in 3–5 minutes a day on your phone. The curriculum follows the structure of the HBS and MIT Sloan core courses. All lessons and cases are original.

It's an installable web app (PWA): open it in your phone's browser, then **Add to Home Screen** (iPhone: Share → Add to Home Screen; Android: ⋮ → Install app). After the first visit it works offline. Progress is stored on the device; use **Settings → Download backup** before switching phones.

## How it works

- **Today**: one tap runs any reviews that are due (up to 5 by default), then the next lesson on your path.
- **Lessons**: 1–2 concept cards, then 4–6 exercises: multiple choice, true/false, quick calculations, matching and ordering. About every other lesson ends with a short HBS-style **mini case** and a debrief.
- **Retries**: a missed question comes back once at the end of the lesson.
- **Spaced repetition**: every exercise you answer and every key term you learn is rescheduled based on how you did (SM-2 style).
- **Light gamification**: a daily streak, a 7-day strip and progress bars.

## Curriculum

| Area | Track | Status |
|---|---|---|
| Finance & Accounting | Financial Accounting | Unit 1 (5 lessons) written |
| | Corporate Finance | Outline |
| Strategy & Marketing | Strategy | Outline |
| | Marketing | Outline |
| Leadership & Negotiation | Leading People | Outline |
| | Negotiation | Outline |
| Operations & Data | Operations | Outline |
| | Data & Decisions | Outline |

Lessons are plain data in `src/content/tracks/`. To add a unit, fill in its `lessons` array. `src/content/content.test.ts` checks every lesson: valid answers, an explanation for each exercise, unique ids, and a length that fits a short session.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # unit + content validation tests
npm run build    # production build in dist/
```

End-to-end smoke test (plays a full daily session at iPhone size; needs Playwright):

```bash
npm run build && npx vite preview --port 4173 &
npm run e2e
```

## Deploying

`.github/workflows/deploy.yml` runs the tests on every pull request. On pushes to `main` it also builds the app and deploys it to GitHub Pages. To turn it on, go to **Settings → Pages → Source: GitHub Actions** in the repository. GitHub Pages on a private repository needs a paid GitHub plan.

For other hosts (Netlify, Vercel, Cloudflare Pages), set the build command to `npm run build` and the output directory to `dist`. Set `BASE_PATH` if the app isn't served from the domain root.
