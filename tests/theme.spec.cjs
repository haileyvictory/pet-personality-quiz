const { test, expect } = require('@playwright/test');

test('dark workspace keeps text and keyboard controls readable across the quiz and in print', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');

	async function checkContrast(selectors, { dark = true } = {}) {
		const samples = await page.locator(selectors).evaluateAll(elements => {
			const luminance = color => {
				const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => {
					const channel = value / 255;
					return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
				});
				return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
			};
			return elements.filter(element => element.getClientRects().length).map(element => {
				let ancestor = element;
				let background;
				while (ancestor) {
					background = getComputedStyle(ancestor).backgroundColor;
					if (background !== 'rgba(0, 0, 0, 0)') break;
					ancestor = ancestor.parentElement;
				}
				if (!ancestor) throw new Error('No opaque background for contrast check.');
				const style = getComputedStyle(element);
				const light = luminance(background);
				const contrast = foreground => {
					const value = luminance(foreground);
					return (Math.max(value, light) + .05) / (Math.min(value, light) + .05);
				};
				return {
					text: element.textContent.trim().slice(0, 60) || element.id,
					background: light,
					darkSurface: !element.matches('.primary, .answer-letter'),
					textContrast: contrast(style.color),
					focusContrast: style.outlineStyle === 'none' ? null : contrast(style.outlineColor),
					borderContrast: element.matches('.answer') ? contrast(style.borderColor) : null
				};
			});
		});
		expect(samples.length).toBeGreaterThan(0);
		for (const sample of samples) {
			if (dark && sample.darkSurface) expect(sample.background, sample.text).toBeLessThan(.06);
			expect(sample.textContrast, sample.text).toBeGreaterThanOrEqual(4.5);
			if (sample.focusContrast !== null) expect(sample.focusContrast, sample.text).toBeGreaterThanOrEqual(3);
			if (sample.borderContrast !== null) expect(sample.borderContrast, sample.text).toBeGreaterThanOrEqual(3);
		}
	}

	await page.locator('#quiz-name').focus();
	await expect(page.locator('#quiz-name')).toHaveCSS('outline-style', 'solid');
	await checkContrast('.intro .lede, .eyebrow, .application-heading h2, #quiz-name, .quiz-promise, .primary, .privacy, figcaption strong, .personality-tag, .floating-note, .potential-seal');
	await page.locator('.start-button').click();
	await page.locator('#next').click();
	await checkContrast('#question-title, #question-count, #encouragement, .answer, .answer-letter, #answer-error, .primary, .secondary');
	await page.locator('#answers input').first().check();
	await checkContrast('.answer:has(:checked), .answer:has(:checked) .answer-letter');
	for (let index = 0; index < 6; index++) {
		if (index > 0) await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	await page.locator('.onboarding-details summary').click();
	await checkContrast('#result-title, #personality-title, #personality-tagline, #personality-description, #result-family, #traits li, #mantra, .result-rosette, .primary, .secondary, .onboarding-details summary, .onboarding-steps code, .onboarding-steps a');
	await page.locator('.onboarding-intro .primary').hover();
	await checkContrast('.onboarding-intro .primary');
	const palette = await page.locator('#result').getAttribute('data-palette');
	const palettes = await page.evaluate(() => [...new Set(Object.values(BlobbyOutfits).map(outfit => outfit.color))]);
	const accentColors = new Set();
	for (const color of palettes) {
		await page.locator('#result').evaluate((element, color) => { element.dataset.palette = color; }, color);
		await checkContrast('#personality-title, #mantra, #result-style');
		accentColors.add(await page.locator('#personality-title').evaluate(element => getComputedStyle(element).color));
	}
	expect(accentColors.size).toBe(palettes.length);
	await page.locator('#result').evaluate((element, color) => { element.dataset.palette = color; }, palette);
	await page.emulateMedia({ media: 'print' });
	await checkContrast('#result-title, #personality-title, #traits li, #mantra, #result-style', { dark: false });
	await page.emulateMedia({ media: 'screen' });
	await page.goto('/about.html');
	await checkContrast('.legal-heading h1, .legal-heading em, .legal-copy h2, .legal-copy p, .legal-copy a, .legal-body code');
});

test('quiz sidebar decoration never overlaps the advice text', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await page.locator('.start-button').click();
	for (const width of [1440, 1024]) {
		await page.setViewportSize({ width, height: 1000 });
		await expect(page.locator('.aside-note')).toBeVisible();
		const overlapping = await page.locator('.quiz-aside').evaluate(aside => {
			const range = document.createRange();
			range.selectNodeContents(aside.querySelector('.aside-note'));
			const textRects = Array.from(range.getClientRects());
			return Array.from(aside.querySelectorAll('[aria-hidden="true"]')).filter(decoration => {
				if (!decoration.getClientRects().length) return false;
				const rect = decoration.getBoundingClientRect();
				return textRects.some(text => rect.left < text.right && rect.right > text.left &&
					rect.top < text.bottom && rect.bottom > text.top);
			}).map(decoration => decoration.className);
		});
		expect(overlapping, `Sidebar text at ${width}px`).toEqual([]);
	}
});

test('workspace motion settles and reduced motion disables entrances and signal traces', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/');
	expect(await page.locator('.showcase-signals use').count()).toBeGreaterThan(0);
	const count = await page.locator('#welcome').evaluate(async element => {
		const animations = element.getAnimations({ subtree: true });
		if (animations.some(animation => animation.effect.getTiming().iterations !== 1)) {
			throw new Error('Workspace decoration must not loop.');
		}
		await Promise.all(animations.map(animation => animation.finished));
		return animations.length;
	});
	expect(count).toBeGreaterThan(0);
	expect(await page.locator('.signal-packet').evaluateAll(elements =>
		elements.every(element => getComputedStyle(element).opacity === '0'))).toBe(true);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.reload();
	const motion = page.locator('.intro, .application-card, .blobby-showcase, .hero-card, .showcase-signals use');
	expect(await motion.evaluateAll(elements => elements.every(element =>
		getComputedStyle(element).animationName === 'none' && getComputedStyle(element).transitionDuration === '0s'))).toBe(true);
	expect(await page.locator('.signal-packet').evaluateAll(elements =>
		elements.every(element => getComputedStyle(element).opacity === '0'))).toBe(true);
});
