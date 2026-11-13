# Which Blobby are you?

Small blob. Big personality.

A deeply unserious personality quiz for humans. Answer six randomly selected
questions from 72 original everyday scenarios to meet one of 24 colorful
Blobby alter egos. Cozy, chaotic, thoughtful, extra: there is a tiny hat for that.
No accounts, backend, API keys, analytics, or runtime dependencies.

**[Find your Blobby](https://haileyvictory.github.io/pet-personality-quiz/)**

The existing repository and GitHub Pages URL are retained so shared links still
work. The app is now Blobby-only, with no animal selection or pet-career results.

## Run locally

Install Node.js 22 or newer, then:

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173. The server binds to your own machine only.
The app is static, so any static server can serve `public/`.

## How the quiz works

Each run shuffles both the question pool and the answer positions. Replaying
avoids the previous six questions without changing the authored question bank.
Each of the 24 personalities has twelve answer paths across different scenarios.

Answers vote for a personality and its broader vibe family: grounded,
organized, creative, expressive, connector, or adventurous. A family vote
contributes three points and a direct personality vote contributes two.
The first supporting answer breaks a tie. Results depend on your answers,
not a random result picker, and revisiting a result does not reroll it.
Changing an answer recalculates the result.

Home returns to the setup without clearing answers. Quiz starts or resumes the
current run. Your Blobby unlocks when all six questions have answers.
Retake with fresh questions immediately starts a new run and keeps your optional
name. Names are displayed as text, never HTML.

## Design

The VS Code-inspired dark theme pairs graphite editor surfaces with bright blue
accents and subtle blue and violet glows, following the VS Code website and
Ignite presentation. Segoe UI headings, Cascadia-style monospace labels, editor
tabs, and green status badges carry through the setup, quiz, result, onboarding,
and credits. Each Blobby retains its azure, mint, lilac, peach, honey-gold, or
rose accent on dark backgrounds.

Restrained slide-in entrances, staggered answers, one-shot signal traces, and
button transitions respect reduced-motion preferences. Motion settles rather
than looping, and results remain readable in print. Native radio controls,
visible focus indicators, and responsive layouts work with keyboard, desktop,
and mobile. Fonts and effects use system fonts, local SVG, and CSS only, with
no third-party requests.

## Meet Blobby in VS Code

The result page links to [Download VS Code](https://code.visualstudio.com/download)
and introduces `/vscode-pet` in GitHub Copilot Chat. Newer versions may use
`/blobby`. Blobby's context menu includes **Achievements** and their accessory
rewards. See the [official Blobby guide](https://code.visualstudio.com/docs/agents/reference/chat-pet)
for the current experimental feature.

Quiz styles are illustrations, not real VS Code achievement unlocks. The quiz
does not connect to VS Code or change any editor settings.

## Test

```sh
npm test
npx playwright install chromium
npm run test:browser
```

Unit tests cover all 24 reachable personalities, the authored scenario bank,
balanced answer paths, randomized replay, stable answer identities, scoring,
ties, revisions, and invalid input. Browser tests cover keyboard and stage
navigation, name injection, errors, replay, all personality images, VS Code
onboarding, privacy, narrow layouts, reduced motion, and fail-closed startup
when JavaScript is unavailable.

## Structure

- `public/index.html`: setup, quiz, result, and VS Code onboarding.
- `public/quiz.js`: rendering, focus management, revision, navigation, and replay.
- `public/engine.js`: personalities, human scenarios, and deterministic scoring.
- `public/quiz.css`: responsive design, personality palettes, and reduced motion.
- `public/blobby-outfits.js`: hats, colors, props, and accessible descriptions.
- `public/assets/blobby-personalities/`: 24 bundled pixel-art Blobbies.
- `public/assets/blobby.png`: original unaccessorized Blobby.
- `art-source/accessories/`: verified public, MIT-licensed VS Code hat atlases.
- `tests/`: unit and browser regression tests.
- `scripts/serve.cjs`: dependency-free local preview server.

## Rebuild Blobby styles

```sh
npx playwright install chromium
npm run build:art
```

The local art build combines the original sprite and official hat atlases with
six palettes and original personality props on an eight-pixel grid. It checks
for hard pixel edges and visible eyes. Runtime pages load the committed PNGs;
no canvas, image service, or art build runs while taking the quiz.

## Privacy

Names and answers stay in page memory. They are never uploaded, put in the URL,
or saved to cookies or browser storage. Reloading clears the quiz. Only the last
sample personality ID is kept in the current page's history entry to prevent
consecutive showcase repeats. No name or answer is saved there.

Startup controls remain disabled until handlers are ready. The content security
policy blocks form navigation and application network connections.
GitHub Pages still receives normal hosting requests and network metadata, such
as IP addresses. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
External links, including VS Code downloads, are followed only when you choose.

## Deploy

The `Test and deploy` workflow runs tests and a dependency audit for pull requests
and main-branch pushes. Actions are pinned, and Dependabot checks monthly.
Only `public/` is uploaded. Deployment requires a successful test job.
In repository Settings > Pages, choose **GitHub Actions** as the source.
No custom secrets are needed.

## Contributing

Keep the quiz static, keyboard-accessible, and local-only. Author original human
scenarios and affectionate personality descriptions, not animal questions or
career assignments. Keep all personalities reachable through distinct questions
and preserve stable answer IDs when shuffling. Do not add analytics, uploads,
sign-in, secrets, or third-party requests without an explicit product decision.
Run both test commands before opening a pull request.

## License and credits

MIT; existing Microsoft copyright notices are retained. See [LICENSE.txt](LICENSE.txt)
and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This independent,
unofficial quiz is not a Microsoft or GitHub product and is not a scientific
personality assessment.
