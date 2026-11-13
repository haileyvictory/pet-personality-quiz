const { test, expect } = require('@playwright/test');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { personalities } = require('../public/engine.js');
const outfits = require('../public/blobby-outfits.js');

test('the human quiz is keyboard-accessible, private, and safely renders an optional name', async ({ page, baseURL }) => {
	const failures = [];
	const requests = [];
	page.on('pageerror', error => failures.push(error.message));
	page.on('console', message => {
		if (message.type() === 'error') failures.push(message.text());
	});
	page.on('request', request => requests.push(request.url()));
	await page.goto('/');
	await expect(page).toHaveTitle(/Which Blobby are you/);
	await expect(page.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute('href', 'https://github.com/haileyvictory/which-blobby-are-you');
	await expect(page.locator('#species-options, input[name="species"]')).toHaveCount(0);
	await expect(page.locator('.journey [aria-current="step"]')).toHaveAttribute('data-view', 'welcome');
	const name = '<img src=x onerror=alert(1)>';
	await page.locator('#quiz-name').fill(name);
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: 'Find my Blobby', exact: true })).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator('#question-title')).toBeFocused();
	await expect(page.locator('#quiz-player')).toHaveText(name);
	await expect(page.locator('#quiz-player img')).toHaveCount(0);
	await page.locator('#next').click();
	await expect(page.locator('#answer-error')).toBeVisible();
	await expect(page.locator('#answers input').first()).toBeFocused();
	await page.keyboard.press('Space');
	await page.keyboard.press('ArrowDown');
	await expect(page.locator('#answers input').nth(1)).toBeChecked();
	await expect(page.locator('#answer-error')).toBeHidden();
	const firstPrompt = await page.locator('#question-title').textContent();
	const firstAnswer = await page.locator('#answers input:checked').inputValue();
	await page.locator('#next').click();
	await page.locator('#back').click();
	await expect(page.locator('#question-title')).toHaveText(firstPrompt);
	await expect(page.locator('#answers input:checked')).toHaveValue(firstAnswer);
	for (let index = 0; index < 6; index++) {
		await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	await expect(page.locator('#result-title')).toHaveText(`${name}, meet your Blobby.`);
	await expect(page.locator('#result-title img')).toHaveCount(0);
	await expect(page.locator('#personality-title')).not.toBeEmpty();
	await expect(page.locator('#traits li')).toHaveCount(3);
	await expect(page.locator('#result-art img')).toBeVisible();
	await expect(page.locator('#result-art svg')).toHaveCount(0);
	await expect(page.locator('.vscode-onboarding')).toBeVisible();
	await expect(page.locator('.vscode-onboarding')).toContainText('/vscode-pet');
	await expect(page.locator('.vscode-onboarding')).toContainText('Achievements');
	await expect(page.getByRole('link', { name: 'Download VS Code', exact: true })).toHaveAttribute('href', 'https://code.visualstudio.com/download');
	await expect(page.getByRole('link', { name: 'Download VS Code', exact: true })).toHaveAttribute('target', '_blank');
	await expect(page.locator('.vscode-onboarding')).toContainText('does not unlock a VS Code achievement');
	expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: '' });
	expect(requests.every(url => url.startsWith(baseURL + '/') && !url.includes('quizName'))).toBe(true);
	await page.reload();
	await expect(page.locator('#welcome')).toBeVisible();
	await expect(page.locator('#quiz-name')).toHaveValue('');
	await expect(page.locator('#step-result')).toBeDisabled();
	expect(await page.evaluate(() => Object.keys(history.state))).toEqual(['blobbyPreview']);
	expect(failures).toEqual([]);
});

test('Home, Quiz, and Your Blobby preserve answers, support revision, and replay fresh scenarios', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.route('**/engine.js', async route => {
		const response = await route.fetch();
		await route.fulfill({
			response,
			body: `${await response.text()}\n(() => {
				const create = BlobbyQuiz.createQuiz;
				BlobbyQuiz.createQuiz = previous => previous.length ? create(previous) :
					['free-saturday', 'spare-hour', 'desk-space', 'playlist-duty', 'canceled-plans', 'long-week'].map(id => BlobbyQuiz.questions.find(question => question.id === id));
			})();`
		});
	});
	await page.goto('/');
	const home = page.getByRole('button', { name: 'Home', exact: true });
	const quiz = page.getByRole('button', { name: 'Quiz', exact: true });
	const result = page.getByRole('button', { name: 'Your Blobby', exact: true });
	await expect(page.locator('#quiz-name')).toHaveAttribute('placeholder', 'Blobby');
	await expect(result).toBeDisabled();
	await quiz.click();
	await expect(page.locator('#quiz-player')).toHaveText('Blobby');
	const prompts = [await page.locator('#question-title').textContent()];
	await page.locator('#answers input[value$="-cozy"]').check();
	await page.locator('#next').click();
	await page.locator('#answers input[value$="-cozy"]').check();
	const resumedPrompt = await page.locator('#question-title').textContent();
	const resumedAnswer = await page.locator('#answers input:checked').inputValue();
	await home.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('#welcome')).toBeVisible();
	await expect(page.locator('#quiz-name')).toBeFocused();
	await expect(result).toBeDisabled();
	await page.locator('#quiz-name').fill('Alex');
	await quiz.focus();
	await page.keyboard.press('Space');
	await expect(page.locator('#question-title')).toBeFocused();
	await expect(page.locator('#question-title')).toHaveText(resumedPrompt);
	await expect(page.locator('#answers input:checked')).toHaveValue(resumedAnswer);
	await expect(page.locator('#quiz-player')).toHaveText('Alex');
	for (let index = 1; index < 6; index++) {
		prompts.push(await page.locator('#question-title').textContent());
		await page.locator('#answers input[value$="-cozy"]').check();
		if (index < 5) await page.locator('#next').click();
	}
	await expect(result).toBeEnabled();
	await result.click();
	await expect(page.locator('#personality-title')).toHaveText('Cozy Blobby');
	await expect(page.locator('#result-title')).toHaveText('Alex, meet your Blobby.');
	await home.click();
	await page.locator('#quiz-name').fill('   ');
	await result.click();
	await expect(page.locator('#result-title')).toBeFocused();
	await expect(page.locator('#result-title')).toHaveText('Blobby, meet your Blobby.');
	await expect(page.locator('#personality-title')).toHaveText('Cozy Blobby');
	await quiz.click();
	await expect(page.locator('#question-count')).toHaveText('Question 6 of 6');
	await expect(page.locator('#quiz-player')).toHaveText('Blobby');
	await expect(page.locator('#answers input[value$="-cozy"]')).toBeChecked();
	await result.click();
	await page.locator('#edit-answers').click();
	for (let index = 0; index < 6; index++) {
		await page.locator(`#answers input[value$="-${index < 4 ? 'spreadsheet' : 'cozy'}"]`).check();
		if (index < 5) await page.locator('#next').click();
	}
	await result.click();
	await expect(page.locator('#personality-title')).toHaveText('Spreadsheet Blobby');
	await home.click();
	await page.locator('#quiz-name').fill('Robin');
	await result.click();
	await page.locator('#restart').click();
	await expect(result).toBeDisabled();
	await expect(page.locator('#quiz-player')).toHaveText('Robin');
	await expect(page.locator('#question-count')).toHaveText('Question 1 of 6');
	await expect(page.locator('#answers input:checked')).toHaveCount(0);
	for (let index = 0; index < 6; index++) {
		expect(prompts).not.toContain(await page.locator('#question-title').textContent());
		await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	await expect(page.locator('#result')).toBeVisible();
});

test('the homepage previews different Blobby personalities on consecutive refreshes', async ({ page }) => {
	await page.addInitScript(() => { Math.random = () => 0; });
	await page.goto('/');
	for (let index = 0; index < 3; index++) {
		const previousTitle = await page.locator('#preview-title').textContent();
		await page.reload();
		await expect(page.locator('#preview-title')).not.toHaveText(previousTitle);
		const title = await page.locator('#preview-title').textContent();
		const personality = personalities.find(personality => personality.title === title);
		await expect(page.locator('#preview-description')).toHaveText(personality.tagline);
		await expect(page.locator('#preview-art img')).toHaveAttribute('src', `assets/blobby-personalities/${personality.id}.png`);
		await page.locator('#preview-art img').evaluate(image => image.decode());
		await expect(page.locator('#blobby-showcase')).toHaveAttribute('data-palette', outfits[personality.id].color);
	}
});

test('all 24 personalities reveal distinct loaded outfits, human descriptions, and matching palettes', async ({ page }) => {
	test.setTimeout(120000);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	let currentPersonality;
	const failures = [];
	const hashes = new Set();
	page.on('pageerror', error => failures.push(error.message));
	page.on('response', response => {
		if (response.status() >= 400) failures.push(`HTTP ${response.status()}: ${response.url()}`);
	});
	await page.route('**/engine.js', async route => {
		const response = await route.fetch();
		await route.fulfill({
			response,
			body: `${await response.text()}\nBlobbyQuiz.createQuiz = () => BlobbyQuiz.questions.filter(question => question.options.some(option => option.personalityId === ${JSON.stringify(currentPersonality)})).slice(0, BlobbyQuiz.quizLength);`
		});
	});
	for (const personality of personalities) {
		currentPersonality = personality.id;
		await page.goto('/');
		await page.getByRole('button', { name: 'Find my Blobby', exact: true }).click();
		for (let index = 0; index < 6; index++) {
			await page.locator(`#answers input[value$="-${personality.id}"]`).check();
			await page.locator('#next').click();
		}
		await expect(page.locator('#personality-title')).toHaveText(personality.title);
		await expect(page.locator('#personality-description')).toHaveText(personality.description);
		await expect(page.locator('#personality-tagline')).toHaveText(personality.tagline);
		await expect(page.locator('#mantra')).toHaveText(personality.mantra);
		const image = page.locator('#result-art img');
		const source = `assets/blobby-personalities/${personality.id}.png`;
		await expect(image).toHaveAttribute('src', source);
		await image.evaluate(image => image.decode());
		expect(await image.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([160, 160]);
		await expect(page.locator('#result-art')).toHaveAttribute('aria-label', `${personality.title}. ${outfits[personality.id].description}`);
		await expect(page.locator('#result')).toHaveAttribute('data-palette', outfits[personality.id].color);
		await expect(page.locator('#result-style')).toHaveText(outfits[personality.id].style);
		await expect(page.locator('#result-art svg, #result-art text')).toHaveCount(0);
		const bytes = await fs.readFile(path.join(__dirname, '..', 'public', ...source.split('/')));
		hashes.add(createHash('sha256').update(bytes).digest('hex'));
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	}
	expect(hashes.size).toBe(24);
	expect(failures).toEqual([]);
});

test('the quiz and VS Code onboarding fit narrow screens and honor reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 320, height: 800 });
	await page.goto('/');
	expect(await page.locator('.hero-card').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.getByRole('button', { name: 'Find my Blobby', exact: true }).click();
	await expect(page.locator('#quiz-player')).toHaveText('Blobby');
	await expect(page.locator('#quiz-mascot img')).toHaveAttribute('src', 'assets/blobby.png');
	expect(await page.locator('.answer').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
	for (let index = 0; index < 6; index++) {
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	expect(await page.locator('#result-art').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
	await expect(page.locator('#result-title')).toHaveText('Blobby, meet your Blobby.');
	const download = page.getByRole('link', { name: 'Download VS Code', exact: true });
	await download.scrollIntoViewIfNeeded();
	await expect(download).toBeInViewport();
	expect(await download.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.getByRole('link', { name: 'Privacy & credits' }).click();
	await expect(page.getByRole('heading', { name: /Privacy.*credits/ })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('disabled or broken JavaScript cannot submit a name or navigate into an unfinished quiz', async ({ browser, baseURL }) => {
	for (const blockedScript of [null, 'quiz.js', 'engine.js', 'blobby-outfits.js']) {
		const context = await browser.newContext({ javaScriptEnabled: blockedScript !== null });
		const page = await context.newPage();
		if (blockedScript) await page.route(`**/${blockedScript}`, route => route.abort());
		const navigations = [];
		page.on('request', request => {
			if (request.isNavigationRequest()) navigations.push(request.url());
		});
		await page.goto(baseURL);
		await expect(page.locator('#quiz-name')).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Find my Blobby', exact: true })).toBeDisabled();
		await expect(page.locator('#startup-status')).toBeVisible();
		await expect(page.locator('.journey button:enabled')).toHaveCount(0);
		expect(navigations).toHaveLength(1);
		await context.close();
	}
});
