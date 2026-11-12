# Pet Personality Quiz

Serious careers. Deeply unserious candidates.

A playful pet-career quiz for Blobby, cats, and dogs. Answer six questions from
48 authored scenarios to discover one of 24 ridiculous jobs. No accounts,
backend, API keys, analytics, or runtime dependencies.

**[Play the quiz](https://haileyvictory.github.io/pet-personality-quiz/)**

## Run locally

Install Node.js 22 or newer, then:

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173. The server binds to your own machine only.
The app is static, so any static server can serve `public/`.

## Test

```sh
npm test
npx playwright install chromium
npm run test:browser
```

The unit tests cover reachable careers, question variety, replay, stable answer
identities, answer revision, scoring, and invalid input. Browser tests cover
desktop and mobile, keyboard selection, missing answers, name injection,
back/revise/replay flows, artwork, overflow, reduced motion, and fail-closed
startup when JavaScript is unavailable.

## Design

The pet career bureau pairs warm ivory and plum typography with violet, citrus,
and peach accents. The candidate setup, interview, appointment card, and credits
share the same responsive visual system. A three-step indicator follows the
interview, and answer cards preserve native radio-button keyboard controls.
The header steps return to Meet, start or resume the Interview, and reopen
Hired without clearing answers. Hired unlocks once all six answers are selected.
Starting a fresh pet resets the interview and its result.
The talent file shows a fresh sample career on refresh and whenever a different
pet is selected. It defaults to Blobby and shares the result artwork renderer.
Suggested names are Blobby, Kitty, and Rover. Switching pets preserves any
custom name; leaving the field blank uses the selected pet's suggested name.
Subtle floating artwork, staggered answer entrances, and button transitions
respect the device's reduced-motion preference. Fonts, decoration, and motion
use system fonts and local CSS only, with no third-party requests.

## Structure

- `public/index.html`: quiz layout and startup privacy safeguards.
- `public/quiz.js`: UI, focus management, answer revision, and replay.
- `public/engine.js`: pets, questions, careers, and deterministic scoring.
- `public/quiz.css`: responsive styles, focus indicators, and reduced motion.
- `public/assets/`: bundled portraits, the original Blobby sprite, and 24 career outfit PNGs.
- `public/blobby-outfits.js`: job-specific hats, palettes, props, and image descriptions.
- `art-source/accessories/`: verified public, MIT-licensed VS Code hat atlases.
- `tests/`: engine and browser regression tests.
- `scripts/serve.cjs`: dependency-free local preview server.

## Blobby's career wardrobe

Each of the 24 careers has its own composed pixel-art image: an official
VS Code-style hat, one of six body palettes, and original job-specific props.
There are no emoji badges on Blobby's results. Outfits are quiz illustrations,
not actual VS Code achievement unlocks.

To rebuild the committed PNGs after editing the outfit definitions or pixel art:

```sh
npx playwright install chromium
npm run build:art
```

The art build uses a local browser canvas with no network requests. It preserves
the original body geometry, uses the official idle hat anchors, and draws on an
eight-pixel grid with opaque pixels and transparent backgrounds. Runtime pages
load the finished static PNGs; no canvas, image service, or build tool is needed
to take the quiz.

## Cat and dog portraits

All 24 careers have a full-size storybook illustration for each animal.
The original dog executive, snack inspector, and neighborhood lookout
portraits are preserved. All 24 cat career portraits have cheerful expressions,
with their outfits and props retained in the same warm storybook style.
Selection cards and interview mascots use the same plain animal image without
clothes or job props. The large welcome preview showcases a fresh career for
the selected pet on refresh and selection changes. Plain portraits live
in `public/assets/cat.webp` and `public/assets/dog.webp`; Blobby uses the
original unaccessorized sprite. Results show the pet's matched career artwork.

The committed 480-pixel WebP images live in `public/assets/pet-portraits/`.
No image service is called at runtime. To import reviewed four-column,
six-row illustration sheets locally, run:

```sh
node scripts/import-portraits.cjs path/to/cat-sheet.png path/to/dog-sheet.png path/to/happy-cat-sheet.png
```

The optional third sheet replaces all cat portraits using an evenly divided
four-column, six-row grid in engine career order. Without it, the importer
preserves the original three cat portraits. The three original dog portraits
always come from `pet-careers.png`. Review every exported crop before publishing.
Browser tests exercise all 72 species/career combinations on desktop and mobile.

## Privacy

Names and answers stay in page memory. They are never uploaded, stored in the
URL, or saved to cookies or browser storage. Reloading clears the interview.
Only the last showcase career ID is kept in the current page's history entry
to prevent consecutive preview repeats on refresh. Names, answers, and the
selected pet are never saved there.
The optional name is rendered as text, never HTML. Startup controls remain
disabled until event handlers are ready, and the site's content security policy
blocks form navigation and application network connections.

GitHub Pages still receives normal hosting requests, including network metadata
such as IP addresses. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
Source links leave the app only when you choose to follow them.

## Deploy

The `Test and deploy` workflow runs tests and a dependency audit for pull requests
and main-branch pushes. Actions are pinned to immutable revisions, and Dependabot
checks for updates monthly. Only `public/` is uploaded as the site. Deployment
requires a successful test job. In repository Settings > Pages, choose **GitHub Actions** as the source.
No custom secrets are needed. The default Pages address is
https://haileyvictory.github.io/pet-personality-quiz/.

## Contributing

Keep the app static, keyboard-accessible, and local-only. Do not add analytics,
uploads, sign-in, secrets, or third-party requests without an explicit product
and privacy decision. Run both test commands before opening a pull request.
Never commit `.env` files, local paths, private screenshots, session logs, or
editor configuration. Report bugs through repository issues without personal
information.

## License and credits

MIT; existing Microsoft copyright notices are retained. See [LICENSE.txt](LICENSE.txt)
and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This is an independent,
unofficial project, not a Microsoft or GitHub product. The quiz is for fun, not
a real personality assessment.
