'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const { careers } = require('../public/engine.js');

async function main() {
	const [catFile, dogFile, happyCatFile] = process.argv.slice(2);
	if (!catFile || !dogFile) {
		throw new Error('Usage: node scripts/import-portraits.cjs <cat-sheet.png> <dog-sheet.png> [happy-cat-sheet.png]');
	}
	const root = path.resolve(__dirname, '..');
	const encode = async filename => `data:image/png;base64,${(await fs.readFile(filename)).toString('base64')}`;
	const sources = {
		cat: await encode(catFile),
		dog: await encode(dogFile),
		original: await encode(path.join(root, 'public', 'assets', 'pet-careers.png'))
	};
	if (happyCatFile) sources.happyCat = await encode(happyCatFile);
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		const portraits = await page.evaluate(async ({ sources, careers }) => {
			const images = {};
			for (const [key, source] of Object.entries(sources)) {
				const image = new Image();
				image.src = source;
				await image.decode();
				images[key] = image;
			}
			const output = [];
			for (const species of ['cat', 'dog']) {
				for (const [index, career] of careers.entries()) {
					const classicColumn = { cardboard: 0, snacks: 1, surveillance: 2 }[career.id];
					const happyCat = species === 'cat' && images.happyCat;
					const classic = !happyCat && classicColumn !== undefined;
					const image = happyCat || (classic ? images.original : images[species]);
					let x, y, width, height;
					if (happyCat) {
						width = image.width / 4;
						height = image.height / 6;
						x = (index % 4) * width;
						y = Math.floor(index / 4) * height;
					} else if (classic) {
						width = image.width / 3;
						height = image.height / 3;
						x = classicColumn * width;
						y = (species === 'cat' ? 0 : 1) * height;
					} else {
						width = image.width / 4;
						x = (index % 4) * width;
						const row = Math.floor(index / 4);
						// Reviewed row bounds exclude props protruding from neighboring cells.
						const starts = species === 'dog' ? [0, 238, 464, 659, 855, 1051] : [0, 280, 536, 788, 1042, 1295];
						const ends = species === 'dog' ? [226, 448, 647, 843, 1039, 1254] : [274, 522, 770, 1024, 1278, 1536];
						const sourceHeight = species === 'dog' ? 1254 : 1536;
						y = starts[row] / sourceHeight * image.height;
						height = (ends[row] - starts[row]) / sourceHeight * image.height;
					}
					const canvas = document.createElement('canvas');
					canvas.width = canvas.height = 480;
					const context = canvas.getContext('2d');
					context.fillStyle = '#faf4df';
					context.fillRect(0, 0, 480, 480);
					const scale = Math.min(480 / width, 480 / height);
					context.drawImage(image, x, y, width, height, (480 - width * scale) / 2, (480 - height * scale) / 2, width * scale, height * scale);
					output.push({ species, id: career.id, bytes: canvas.toDataURL('image/webp', 0.9).split(',')[1] });
				}
			}
			return output;
		}, { sources, careers });
		const destination = path.join(root, 'public', 'assets', 'pet-portraits');
		await fs.mkdir(destination, { recursive: true });
		for (const portrait of portraits) {
			await fs.writeFile(path.join(destination, `${portrait.species}-${portrait.id}.webp`), Buffer.from(portrait.bytes, 'base64'));
		}
		console.log(`Imported ${portraits.length} portraits${happyCatFile ? ' with happy cat expressions' : ', including all six original cat/dog illustrations'}.`);
	} finally {
		await browser.close();
	}
}

main().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
