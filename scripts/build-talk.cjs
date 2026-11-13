'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { personalities } = require('../public/engine.js');

const root = path.resolve(__dirname, '..');
const encode = value => JSON.stringify(value).replace(/</g, '\\u003c');
const quizPattern = /const quizUrl = URL\.createObjectURL\(new Blob\(\[("(?:[^"\\]|\\.)*")\], \{ type: 'text\/html;charset=utf-8' \}\)\);/;
const guidePattern = /const guideDocument = ("(?:[^"\\]|\\.)*")/;
const pdfPattern = /const pdfBytes = Uint8Array\.from\(atob\("[A-Za-z0-9+/=]+"\), character => character\.charCodeAt\(0\)\);/;
const creditsPattern = /(<script type="application\/json" id="embedded-asset-credits">)([\s\S]*?)(<\/script>)/;

function inlinePage(html, css, scriptPolicy) {
	return html.replace('<link rel="stylesheet" href="quiz.css">', `<style>${css}</style>`)
		.replace(/(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")/,
			`$1default-src 'none'; script-src '${scriptPolicy}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-src 'none'$2`);
}

async function build() {
	const filename = path.join(root, 'ignite-talk.html');
	let deck = (await fs.readFile(filename, 'utf8')).replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
	const quizMatch = deck.match(quizPattern);
	const guideMatch = deck.match(guidePattern);
	const creditsMatch = deck.match(creditsPattern);
	if (!quizMatch || !guideMatch || !creditsMatch || !pdfPattern.test(deck)) {
		throw new Error('The conference deck is missing one of its embedded documents.');
	}
	const readPublic = name => fs.readFile(path.join(root, 'public', name), 'utf8');
	const [html, css, engine, outfits, ui, about] = await Promise.all([
		'index.html', 'quiz.css', 'engine.js', 'blobby-outfits.js', 'quiz.js', 'about.html'
	].map(readPublic));
	const imageData = async filename => `data:image/png;base64,${(await fs.readFile(filename)).toString('base64')}`;
	const images = Object.fromEntries(await Promise.all(personalities.map(async personality => [
		personality.id, await imageData(path.join(root, 'public', 'assets', 'blobby-personalities', `${personality.id}.png`))
	])));
	images.default = await imageData(path.join(root, 'public', 'assets', 'blobby.png'));
	const personalitySource = 'image.src = `assets/blobby-personalities/${personality.id}.png`;';
	const defaultSource = "image.src = 'assets/blobby.png';";
	if (!ui.includes(personalitySource) || !ui.includes(defaultSource)) {
		throw new Error('The quiz image renderer changed; update the offline bundle transformation.');
	}
	const offlineUi = ui.replace(personalitySource, 'image.src = BlobbyImages[personality.id];')
		.replace(defaultSource, 'image.src = BlobbyImages.default;');
	const offlineAbout = inlinePage(about, css, 'none')
		.replaceAll('href="./"', 'href="__QUIZ_URL__"')
		.replace('href="LICENSE.txt"', 'href="https://github.com/haileyvictory/which-blobby-are-you/blob/main/LICENSE.txt"');
	const connectAbout = `const aboutDocument = ${encode(offlineAbout)};
document.querySelector('a[href="about.html"]').href = URL.createObjectURL(new Blob([
	aboutDocument.replaceAll('__QUIZ_URL__', location.href)
], { type: 'text/html;charset=utf-8' }));`;
	const quiz = inlinePage(html, css, 'unsafe-inline')
		.replace(/<script src="(?:engine|blobby-outfits|quiz)\.js" defer><\/script>\s*/g, '')
		.replace('src="assets/blobby-personalities/cozy.png"', `src="${images.cozy}"`)
		.replaceAll('href="./"', 'href="#main"')
		.replace('</body>', `<script>const BlobbyImages = ${encode(images)};\n${engine}\n${outfits}\n${offlineUi}\n${connectAbout}</script>\n</body>`);
	const guide = JSON.parse(guideMatch[1]);
	const credits = JSON.parse(creditsMatch[2]);
	deck = deck.replace(quizPattern, () => `const quizUrl = URL.createObjectURL(new Blob([${encode(quiz)}], { type: 'text/html;charset=utf-8' }));`)
		.replace(guidePattern, () => `const guideDocument = ${encode(guide)}`)
		.replace(creditsPattern, () => `${creditsMatch[1]}${encode(credits)}${creditsMatch[3]}`);
	await fs.writeFile(filename, deck);
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		await page.goto(pathToFileURL(filename).href);
		await page.locator('.slide').first().waitFor({ state: 'visible' });
		const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
		await fs.writeFile(filename, deck.replace(pdfPattern, () => `const pdfBytes = Uint8Array.from(atob("${pdf.toString('base64')}"), character => character.charCodeAt(0));`));
		console.log(`Refreshed the offline quiz, guide, and PDF with ${personalities.length} Blobby personalities.`);
	} finally {
		await browser.close();
	}
}

build().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
