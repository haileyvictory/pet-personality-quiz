'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const outfits = require('../public/blobby-outfits.js');
const { personalities } = require('../public/engine.js');

const root = path.resolve(__dirname, '..');

async function build() {
	if (personalities.length !== Object.keys(outfits).length || personalities.some(personality => !outfits[personality.id])) {
		throw new Error('Every Blobby personality needs exactly one outfit.');
	}
	const imageData = async filename => `data:image/png;base64,${(await fs.readFile(filename)).toString('base64')}`;
	const body = await imageData(path.join(root, 'public', 'assets', 'blobby.png'));
	const hats = Object.fromEntries(await Promise.all([...new Set(Object.values(outfits).map(outfit => outfit.hat))].map(async name => [
		name, await imageData(path.join(root, 'art-source', 'accessories', `${name}.png`))
	])));
	const browser = await chromium.launch();
	try {
		const page = await browser.newPage();
		const images = await page.evaluate(async ({ body, hats, outfits }) => {
			const load = async source => {
				const image = new Image();
				image.src = source;
				await image.decode();
				return image;
			};
			const bodyImage = await load(body);
			const hatImages = Object.fromEntries(await Promise.all(Object.entries(hats).map(async ([name, source]) => [name, await load(source)])));
			const palettes = {
				azure: ['#004e7c', '#0077b8', '#23a8f2'],
				mint: ['#005b50', '#008b75', '#24c8a9'],
				lilac: ['#51427d', '#8463b5', '#b69aee'],
				peach: ['#943e39', '#ce6d59', '#f7a887'],
				honey: ['#92600d', '#c99420', '#f6cd55'],
				rose: ['#8c355d', '#c85c8a', '#f59fc0']
			};
			const output = {};
			for (const [id, outfit] of Object.entries(outfits)) {
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = 160;
				const context = canvas.getContext('2d');
				context.imageSmoothingEnabled = false;
				const [deep, shade, light] = palettes[outfit.color];
				const bodyCanvas = document.createElement('canvas');
				bodyCanvas.width = bodyCanvas.height = 96;
				const bodyContext = bodyCanvas.getContext('2d');
				bodyContext.drawImage(bodyImage, 0, 0);
				const pixels = bodyContext.getImageData(0, 0, 96, 96);
				const replacements = { '0,78,124': deep, '0,119,184': shade, '35,168,242': light };
				for (let index = 0; index < pixels.data.length; index += 4) {
					const hex = replacements[`${pixels.data[index]},${pixels.data[index + 1]},${pixels.data[index + 2]}`];
					if (pixels.data[index + 3] && hex) {
						const rgb = hex.match(/[a-f0-9]{2}/gi).map(value => parseInt(value, 16));
						pixels.data.set(rgb, index);
					}
				}
				bodyContext.putImageData(pixels, 0, 0);
				// Idle head anchor (48, 40), including the eight-pixel wear offset.
				bodyContext.clearRect(16, 0, 64, 32);
				const hat = hatImages[outfit.hat];
				const cell = hat.width / 4;
				if (![64, 96].includes(cell) || hat.height !== cell * 3) {
					throw new Error(`Unexpected accessory atlas: ${outfit.hat}`);
				}
				const x = cell === 96 ? 32 : 48;
				const y = cell === 96 ? 40 : 32;
				context.drawImage(hat, 0, 0, cell, cell, x, y, cell, cell);
				context.drawImage(bodyCanvas, 32, 40);
				context.drawImage(hat, 0, cell, cell, cell, x, y, cell, cell);
				context.drawImage(hat, 0, cell * 2, cell, cell, 88, 96, cell, cell);
				const r = (x, y, width, height, color) => {
					context.fillStyle = color;
					context.fillRect(x * 8, y * 8, width * 8, height * 8);
				};
				const ink = '#303d52', cream = '#fff0cf', gold = '#e9b64d', pink = '#e8759b', teal = '#317d77', brown = '#996741';
				const hand = (x, y) => r(x, y, 1, 1, light);
				switch (outfit.prop) {
					case 'coffee':
						r(11, 14, 6, 4, cream); r(12, 13, 4, 1, brown); r(17, 14, 2, 1, ink); r(18, 15, 1, 2, ink); r(17, 17, 2, 1, ink);
						r(12, 10, 1, 2, '#bcc5d3'); r(14, 9, 1, 2, '#bcc5d3'); hand(10, 15);
						break;
					case 'pillow':
						r(8, 16, 9, 3, '#665e9d'); r(9, 15, 7, 3, '#e5d9fa'); r(10, 16, 5, 1, '#fff1fd');
						r(16, 3, 1, 3, gold); r(17, 2, 1, 1, gold); r(17, 6, 1, 1, gold);
						hand(8, 16); hand(16, 16);
						break;
					case 'book':
						r(8, 14, 10, 5, '#5d7358'); r(9, 14, 4, 4, cream); r(14, 14, 3, 4, cream);
						r(13, 14, 1, 5, brown); r(10, 15, 2, 1, teal); r(15, 16, 1, 1, teal); hand(7, 16); hand(18, 16);
						break;
					case 'solar':
						r(10, 13, 8, 4, ink); r(11, 14, 2, 2, '#9dd7ec'); r(14, 14, 3, 2, '#4e9ec8'); r(13, 17, 2, 1, brown);
						r(2, 3, 3, 3, gold); r(3, 2, 1, 1, gold); r(3, 6, 1, 1, gold); r(1, 4, 1, 1, gold); r(5, 4, 1, 1, gold); hand(10, 13);
						break;
					case 'ledger':
						r(10, 12, 6, 6, '#4c6b68'); r(11, 12, 4, 5, cream);
						r(12, 13, 2, 1, teal); r(12, 15, 2, 1, teal); r(16, 16, 2, 2, gold); r(17, 15, 2, 1, '#f8d77f'); hand(10, 14);
						break;
					case 'notes':
						r(9, 15, 4, 4, '#f6cd55'); r(12, 14, 5, 4, '#f6b6ce'); r(10, 16, 2, 1, brown); r(13, 15, 3, 1, '#bb527e');
						r(3, 3, 3, 1, gold); r(5, 4, 1, 2, gold); r(4, 5, 1, 2, gold); r(4, 8, 1, 1, gold); hand(8, 16);
						break;
					case 'cupcake':
						r(11, 14, 7, 1, cream); r(12, 15, 5, 3, '#b37b5a'); r(13, 15, 1, 3, '#dba979'); r(15, 15, 1, 3, '#dba979');
						r(12, 12, 5, 2, pink); r(13, 11, 3, 1, '#f6b6ce'); r(14, 10, 1, 1, '#b84b65'); hand(11, 14);
						break;
					case 'binoculars':
						r(8, 11, 3, 4, ink); r(13, 11, 3, 4, ink); r(11, 12, 2, 1, ink);
						r(9, 12, 1, 2, '#8fc8e3'); r(14, 12, 1, 2, '#8fc8e3'); hand(7, 12); hand(16, 12);
						r(2, 8, 4, 5, '#b08561'); r(3, 9, 2, 3, '#b9def0');
						break;
					case 'cloud':
						r(8, 16, 10, 2, '#dce7ec'); r(9, 15, 8, 2, cream); r(11, 14, 4, 2, cream); hand(7, 16);
						r(3, 4, 1, 3, gold); r(2, 5, 3, 1, gold); r(16, 3, 1, 3, gold); r(15, 4, 3, 1, gold);
						break;
					case 'spotlight':
						r(14, 11, 3, 3, ink); r(15, 14, 1, 4, '#9babb4'); r(14, 11, 3, 1, '#9babb4'); hand(14, 15);
						r(3, 3, 1, 5, gold); r(1, 5, 5, 1, gold); r(2, 4, 3, 3, gold);
						break;
					case 'sparkles':
						r(12, 12, 5, 3, gold); r(13, 15, 3, 1, gold); r(14, 16, 1, 2, gold); r(12, 18, 5, 1, brown);
						r(11, 12, 1, 3, gold); r(17, 12, 1, 3, gold); r(3, 6, 1, 3, pink); r(2, 7, 3, 1, pink); r(17, 3, 1, 3, gold); r(16, 4, 3, 1, gold); hand(11, 15);
						break;
					case 'umbrella':
						r(11, 6, 6, 1, pink); r(10, 7, 8, 1, pink); r(9, 8, 10, 1, '#b8547d'); r(14, 9, 1, 8, brown); r(13, 16, 1, 1, brown);
						r(2, 4, 4, 2, '#b9cddd'); r(3, 3, 2, 1, '#dce7ec'); r(2, 7, 1, 1, '#73b5d8'); r(5, 8, 1, 1, '#73b5d8'); hand(13, 13);
						break;
					case 'palette':
						r(11, 14, 6, 4, '#e3b478'); r(12, 13, 4, 1, '#e3b478'); r(12, 14, 1, 1, '#dc6e73'); r(14, 14, 1, 1, gold);
						r(15, 16, 1, 1, teal); r(12, 16, 1, 1, '#8b72bb'); r(17, 10, 1, 5, brown); r(17, 9, 1, 2, pink); hand(11, 15);
						break;
					case 'roller':
						r(13, 10, 5, 2, pink); r(12, 11, 1, 3, ink); r(13, 13, 2, 1, ink); r(14, 14, 1, 3, brown);
						r(5, 14, 2, 4, '#c29cda'); r(7, 14, 2, 4, '#e9b64d'); r(9, 14, 2, 4, '#79b5a5'); hand(13, 15);
						break;
					case 'robot':
						r(12, 12, 5, 3, '#dfba59'); r(13, 11, 3, 1, '#f5d480'); r(13, 13, 1, 1, ink); r(15, 13, 1, 1, ink);
						r(12, 15, 5, 2, '#ce7591'); r(11, 15, 1, 1, '#8f5578'); r(17, 15, 1, 1, '#8f5578'); r(12, 17, 2, 1, ink); r(15, 17, 2, 1, ink); hand(11, 14);
						break;
					case 'megaphone':
						r(10, 13, 3, 2, cream); r(13, 12, 2, 4, cream); r(15, 11, 2, 6, '#cf6067'); r(11, 15, 1, 3, ink);
						r(18, 12, 1, 1, gold); r(18, 15, 1, 1, gold); hand(10, 14);
						break;
					case 'flowers':
						r(12, 13, 1, 5, teal); r(15, 12, 1, 6, teal); r(11, 12, 3, 2, pink); r(14, 10, 3, 2, '#b49cd7');
						r(12, 12, 1, 1, gold); r(15, 10, 1, 1, gold); r(11, 16, 6, 1, '#dfc698'); hand(11, 15);
						break;
					case 'letter':
						r(9, 15, 9, 4, '#d4ac85'); r(10, 15, 7, 3, cream); r(11, 16, 1, 1, '#d4ac85'); r(15, 16, 1, 1, '#d4ac85');
						r(12, 16, 1, 1, pink); r(14, 16, 1, 1, pink); r(12, 17, 3, 1, pink); r(13, 18, 1, 1, pink); hand(9, 17);
						break;
					case 'party':
						r(2, 3, 16, 1, brown); r(3, 4, 3, 1, pink); r(4, 5, 1, 1, pink); r(9, 4, 3, 1, gold); r(10, 5, 1, 1, gold); r(15, 4, 3, 1, teal); r(16, 5, 1, 1, teal);
						r(13, 14, 3, 3, gold); r(14, 13, 3, 1, pink); r(17, 11, 1, 1, teal); r(11, 11, 1, 1, gold); r(17, 14, 1, 1, pink); hand(12, 15);
						break;
					case 'heart':
						r(8, 15, 3, 1, pink); r(12, 15, 3, 1, pink); r(7, 16, 9, 1, pink);
						r(8, 17, 7, 1, '#bb527e'); r(10, 18, 3, 1, '#bb527e'); r(9, 15, 1, 1, '#ffd4e0'); hand(7, 16); hand(15, 16);
						break;
					case 'trolley':
						r(10, 17, 8, 1, ink); r(17, 12, 1, 5, ink); r(16, 11, 2, 1, ink); r(11, 18, 1, 1, ink); r(16, 18, 1, 1, ink);
						r(10, 14, 6, 3, '#d4a36a'); r(12, 14, 1, 3, cream); r(11, 12, 4, 2, '#efc38b'); r(13, 12, 1, 2, cream); hand(16, 12);
						break;
					case 'compass':
						r(9, 14, 7, 4, cream); r(10, 15, 1, 2, teal); r(11, 16, 2, 1, teal);
						r(14, 12, 3, 1, gold); r(13, 13, 5, 3, gold); r(14, 16, 3, 1, gold); r(15, 13, 1, 2, '#bc5e67'); r(15, 15, 1, 1, ink); hand(9, 15);
						break;
					case 'wrench':
						r(14, 10, 1, 3, '#9babb4'); r(17, 10, 1, 3, '#9babb4'); r(15, 12, 2, 2, '#9babb4'); r(15, 14, 1, 4, '#9babb4');
						r(6, 17, 7, 2, ink); r(7, 17, 1, 1, cream); r(9, 17, 1, 1, cream); r(11, 17, 1, 1, cream); r(8, 18, 3, 1, '#9babb4'); hand(14, 15);
						break;
					case 'boots':
						r(4, 18, 13, 1, '#85c5dd'); r(6, 17, 9, 1, '#b6e0eb'); r(6, 16, 3, 2, gold); r(11, 16, 3, 2, gold);
						r(5, 17, 4, 1, '#c9932e'); r(11, 17, 4, 1, '#c9932e'); r(2, 15, 1, 1, '#85c5dd'); r(17, 14, 1, 1, '#85c5dd');
						break;
					default:
						throw new Error(`Unknown personality prop: ${outfit.prop}`);
				}
				const rgba = context.getImageData(0, 0, 160, 160).data;
				if (rgba.some((value, index) => index % 4 === 3 && value !== 0 && value !== 255)) {
					throw new Error(`Antialiased pixels in ${id}`);
				}
				let eyePixels = 0;
				for (let index = 0; index < rgba.length; index += 4) {
					if (rgba[index] === 25 && rgba[index + 1] === 26 && rgba[index + 2] === 27 && rgba[index + 3] === 255) {
						eyePixels++;
					}
				}
				if (outfit.prop !== 'binoculars' && eyePixels < 128) {
					throw new Error(`Props obscure both eyes in ${id}`);
				}
				output[id] = canvas.toDataURL('image/png').split(',')[1];
			}
			return output;
		}, { body, hats, outfits });
		const destination = path.join(root, 'public', 'assets', 'blobby-personalities');
		await fs.mkdir(destination, { recursive: true });
		for (const [id, image] of Object.entries(images)) {
			await fs.writeFile(path.join(destination, `${id}.png`), Buffer.from(image, 'base64'));
		}
		console.log(`Built ${Object.keys(images).length} Blobby personalities at 160 x 160 with hard pixel edges.`);
	} finally {
		await browser.close();
	}
}

build().catch(error => {
	console.error(error);
	process.exitCode = 1;
});
