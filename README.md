# Very Qualified

Serious careers. Deeply unserious candidates.

A playful pet-career quiz for Blobby, cats, and dogs. Answer six questions from
48 authored scenarios to discover one of 24 ridiculous jobs. No accounts,
backend, API keys, analytics, or runtime dependencies.

**[Play the quiz](https://haileyvictory.github.io/very-qualified/)**

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

## Structure

- `public/index.html`: quiz layout and startup privacy safeguards.
- `public/quiz.js`: UI, focus management, answer revision, and replay.
- `public/engine.js`: pets, questions, careers, and deterministic scoring.
- `public/quiz.css`: responsive styles, focus indicators, and reduced motion.
- `public/assets/`: the two runtime images only.
- `tests/`: engine and browser regression tests.
- `scripts/serve.cjs`: dependency-free local preview server.

## Privacy

Names and answers stay in page memory. They are never uploaded, stored in the
URL, or saved to cookies or browser storage. Reloading clears the interview.
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
https://haileyvictory.github.io/very-qualified/.

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
