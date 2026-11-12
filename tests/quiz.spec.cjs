const { test, expect } = require('@playwright/test');
const { createHash } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { careers } = require('../public/engine.js');
const outfits = require('../public/blobby-outfits.js');

test('Blobby leads, supports keyboard selection, and completes a private, replayable interview', async ({ page, baseURL }) => {
	const failures = [];
	const requests = [];
	page.on('pageerror', error => failures.push(error.message));
	page.on('console', message => {
		if (message.type() === 'error') failures.push(message.text());
	});
	page.on('request', request => requests.push(request.url()));
	await page.goto('/');
	await expect(page.locator('.journey [aria-current="step"]')).toHaveAttribute('data-view', 'welcome');
	const pets = page.locator('#species-options input');
	await expect(pets).toHaveCount(3);
	expect(await pets.evaluateAll(inputs => inputs.map(input => input.value))).toEqual(['blobby', 'cat', 'dog']);
	await expect(pets.first()).toBeChecked();
	await page.locator('#pet-name').fill('<img src=x onerror=alert(1)>');
	await page.keyboard.press('Tab');
	await expect(pets.first()).toBeFocused();
	await page.keyboard.press('ArrowRight');
	await expect(pets.nth(1)).toBeChecked();
	await page.keyboard.press('ArrowLeft');
	await expect(pets.first()).toBeChecked();
	await page.getByRole('button', { name: 'Begin the paw-formance review' }).click();
	await expect(page.locator('.journey [aria-current="step"]')).toHaveAttribute('data-view', 'interview');
	await expect(page.locator('#candidate-name')).toHaveText('<img src=x onerror=alert(1)>');
	await expect(page.locator('#candidate-name img')).toHaveCount(0);
	await expect(page.locator('#question-title')).toBeFocused();
	await page.locator('#next').click();
	await expect(page.locator('#answer-error')).toBeVisible();
	const firstPrompt = await page.locator('#question-title').textContent();
	await page.locator('#answers input').first().check();
	const firstAnswer = await page.locator('#answers input:checked').inputValue();
	await page.locator('#next').click();
	await page.locator('#back').click();
	await expect(page.locator('#question-title')).toHaveText(firstPrompt);
	await expect(page.locator(`#answers input[value="${firstAnswer}"]`)).toBeChecked();
	await page.locator('#answers input').nth(1).check();
	const revisedAnswer = await page.locator('#answers input:checked').inputValue();
	for (let index = 0; index < 6; index++) {
		if (index > 0) await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	await expect(page.locator('#result')).toBeVisible();
	await expect(page.locator('.journey [aria-current="step"]')).toHaveAttribute('data-view', 'result');
	await expect(page.locator('#result-title')).toHaveText("<img src=x onerror=alert(1)>, you're hired.");
	await expect(page.locator('#result-title img')).toHaveCount(0);
	await expect(page.locator('#career-title')).not.toBeEmpty();
	await expect(page.locator('#result-art')).toHaveAttribute('aria-label', /Blobby/);
	await expect(page.locator('#result-art img.blobby-career')).toBeVisible();
	await expect(page.locator('#result-art svg')).toHaveCount(0);
	await page.locator('#edit-answers').click();
	await expect(page.locator('#answers input:checked')).toHaveValue(revisedAnswer);
	for (let index = 0; index < 6; index++) await page.locator('#next').click();
	await page.locator('#restart').click();
	await expect(page.locator('#welcome')).toBeVisible();
	await expect(page.locator('.journey [aria-current="step"]')).toHaveAttribute('data-view', 'welcome');
	await expect(page.locator('#pet-name')).toHaveValue('');
	await expect(pets.first()).toBeChecked();
	await expect(page.locator('#preview-art')).toHaveAttribute('aria-label', /Blobby/);
	expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: '' });
	expect(requests.every(url => url.startsWith(baseURL + '/') && !url.includes('petName'))).toBe(true);
	expect(failures).toEqual([]);
});

test('stage navigation starts, resumes, and revisits the quiz without losing answers', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.route('**/engine.js', async route => {
		const response = await route.fetch();
		await route.fulfill({
			response,
			body: `${await response.text()}\n(() => {
				const create = PetCareers.createInterview;
				PetCareers.createInterview = previous => previous.length ? create(previous) :
					PetCareers.questions.filter(question => ['parcel', 'delivery', 'business-card', 'talent-show', 'award', 'art-gallery'].includes(question.id));
			})();`
		});
	});
	await page.goto('/');
	const meet = page.getByRole('button', { name: 'Meet', exact: true });
	const interview = page.getByRole('button', { name: 'Interview', exact: true });
	const hired = page.getByRole('button', { name: 'Hired!', exact: true });
	await expect(hired).toBeDisabled();
	await page.locator('#pet-name').fill('Mochi');
	await interview.click();
	const prompts = [await page.locator('#question-title').textContent()];
	await page.locator('#answers input[value$="-cardboard"]').check();
	await page.locator('#next').click();
	await page.locator('#answers input[value$="-artist"]').check();
	const resumedPrompt = await page.locator('#question-title').textContent();
	const resumedAnswer = await page.locator('#answers input:checked').inputValue();
	await meet.focus();
	await page.keyboard.press('Enter');
	await expect(page.locator('#welcome')).toBeVisible();
	await expect(page.locator('#pet-name')).toBeFocused();
	await expect(page.locator('#pet-name')).toHaveValue('Mochi');
	await expect(meet).toHaveAttribute('aria-current', 'step');
	await expect(hired).toBeDisabled();
	await interview.focus();
	await page.keyboard.press('Space');
	await expect(page.locator('#question-title')).toBeFocused();
	await expect(page.locator('#question-title')).toHaveText(resumedPrompt);
	await expect(page.locator('#answers input:checked')).toHaveValue(resumedAnswer);
	for (let index = 1; index < 6; index++) {
		prompts.push(await page.locator('#question-title').textContent());
		await page.locator('#answers input[value$="-cardboard"]').check();
		if (index < 5) await page.locator('#next').click();
	}
	await expect(hired).toBeEnabled();
	await hired.click();
	await expect(page.locator('#result-title')).toHaveText("Mochi, you're hired.");
	await expect(page.locator('#career-title')).toHaveText('Chief Cardboard Officer');
	await meet.click();
	await expect(page.locator('#welcome')).toBeVisible();
	await hired.click();
	await expect(page.locator('#result-title')).toBeFocused();
	await expect(hired).toHaveAttribute('aria-current', 'step');
	await interview.click();
	await expect(page.locator('#question-count')).toHaveText('Question 6 of 6');
	await expect(page.locator('#answers input[value$="-cardboard"]')).toBeChecked();
	await hired.click();
	await page.locator('#edit-answers').click();
	for (let index = 0; index < 6; index++) {
		await page.locator('#answers input[value$="-artist"]').check();
		if (index < 5) await page.locator('#next').click();
	}
	await hired.click();
	await expect(page.locator('#career-title')).toHaveText('Principal Pawtrait Artist');
	await page.locator('#restart').click();
	await expect(hired).toBeDisabled();
	await interview.click();
	await expect(page.locator('#candidate-name')).toHaveText('Blobby');
	await expect(page.locator('#question-count')).toHaveText('Question 1 of 6');
	await expect(page.locator('#answers input:checked')).toHaveCount(0);
	expect(prompts).not.toContain(await page.locator('#question-title').textContent());
	await page.setViewportSize({ width: 320, height: 800 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('career previews change on refresh and match each selected pet', async ({ page }) => {
	await page.addInitScript(() => { Math.random = () => 0; });
	await page.goto('/');
	const title = page.locator('#preview-title');
	const art = page.locator('#preview-art');
	for (let index = 0; index < 3; index++) {
		const previousTitle = await title.textContent();
		await page.reload();
		await expect(title).not.toHaveText(previousTitle);
		await expect(page.locator('#species-options input[value="blobby"]')).toBeChecked();
		await expect(art).toHaveAttribute('aria-label', /Blobby/);
	}
	for (const pet of ['cat', 'dog', 'blobby']) {
		const previousTitle = await title.textContent();
		await page.locator(`#species-options input[value="${pet}"]`).check();
		await expect(title).not.toHaveText(previousTitle);
		const currentTitle = await title.textContent();
		const currentCareer = careers.find(career => career.title === currentTitle);
		expect(currentCareer).toBeDefined();
		await expect(page.locator('#preview-description')).toHaveText(currentCareer.traits[0]);
		await expect(art).toHaveAttribute('aria-label', new RegExp(pet, 'i'));
		const source = pet === 'blobby' ? `assets/blobby-careers/${currentCareer.id}.png` : `assets/pet-portraits/${pet}-${currentCareer.id}.webp`;
		await expect(art.locator('img')).toHaveAttribute('src', source);
		await art.locator('img').evaluate(image => image.decode());
		await expect(art.locator('svg')).toHaveCount(0);
	}
});

test('default names follow the pet and preserve a custom name', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	const nameField = page.locator('#pet-name');
	for (const [pet, name] of [['blobby', 'Blobby'], ['cat', 'Kitty'], ['dog', 'Rover']]) {
		await page.locator(`#species-options input[value="${pet}"]`).check();
		await expect(nameField).toHaveAttribute('placeholder', name);
		await nameField.fill('   ');
		await page.locator('.start-button').click();
		await expect(page.locator('#candidate-name')).toHaveText(name);
		for (let index = 0; index < 6; index++) {
			await page.locator('#answers input').first().check();
			await page.locator('#next').click();
		}
		await expect(page.locator('#result-title')).toHaveText(`${name}, you're hired.`);
		await page.locator('#restart').click();
		await expect(nameField).toHaveAttribute('placeholder', 'Blobby');
		await expect(nameField).toHaveValue('');
	}
	await nameField.fill('Mochi');
	for (const pet of ['cat', 'dog', 'blobby']) {
		await page.locator(`#species-options input[value="${pet}"]`).check();
		await expect(nameField).toHaveValue('Mochi');
	}
	await page.locator('.start-button').click();
	await expect(page.locator('#candidate-name')).toHaveText('Mochi');
});

test('candidate portraits match the selection cards and fit narrow screens with reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	expect(await page.locator('.hero-card').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
	await expect(page.locator('.species-symbol img').first()).toBeVisible();
	expect(await page.locator('.species-symbol img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
	const artResponse = await page.request.get('assets/pet-careers.png');
	expect(artResponse.ok()).toBe(true);
	for (const pet of ['blobby', 'cat', 'dog']) {
		const selectionImage = page.locator(`#species-options input[value="${pet}"]`).locator('..').locator('img');
		const genericSource = pet === 'blobby' ? 'assets/blobby.png' : `assets/${pet}.webp`;
		await expect(selectionImage).toHaveAttribute('src', genericSource);
		await page.locator(`#species-options input[value="${pet}"]`).check();
		await page.locator('#preview-art img').evaluate(image => image.decode());
		await page.getByRole('button', { name: 'Begin the paw-formance review' }).click();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		expect(await page.locator('.answer').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
		await expect(page.locator('#interview-mascot')).toHaveAttribute('aria-label', new RegExp(pet, 'i'));
		await expect(page.locator('#interview-mascot img')).toHaveAttribute('src', await selectionImage.getAttribute('src'));
		await page.locator('#interview-mascot img').evaluate(image => image.decode());
		for (let index = 0; index < 6; index++) {
			await page.locator('#answers input').first().check();
			await page.locator('#next').click();
		}
		await expect(page.locator('#result-art')).toHaveAttribute('aria-label', new RegExp(pet, 'i'));
		expect(await page.locator('#result-art').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await page.locator('#restart').click();
		await expect(page.locator('#preview-art')).toHaveAttribute('aria-label', /Blobby/);
	}
	await page.setViewportSize({ width: 320, height: 800 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.getByRole('button', { name: 'Begin the paw-formance review' }).click();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	for (let index = 0; index < 6; index++) {
		await page.locator('#answers input').first().check();
		await page.locator('#next').click();
	}
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.locator('#restart').click();
	await page.getByRole('link', { name: 'Privacy & credits' }).click();
	await expect(page.getByRole('heading', { name: /Privacy.*credits/ })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('all 72 pet and career combinations render distinct, loaded artwork instead of emoji badges', async ({ page }) => {
	test.setTimeout(240000);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	let currentCareer;
	const failures = [];
	const hashes = new Set();
	page.on('pageerror', error => failures.push(error.message));
	page.on('response', response => {
		if (response.status() >= 400) failures.push(`HTTP ${response.status()}: ${response.url()}`);
	});
	// Fix only the question selection; retain authored answers, scoring, and the production UI.
	await page.route('**/engine.js', async route => {
		const response = await route.fetch();
		const source = await response.text();
		await route.fulfill({
			response,
			body: `${source}\nPetCareers.createInterview = () => PetCareers.questions.filter(question => question.options.some(option => option.careerId === ${JSON.stringify(currentCareer)})).slice(0, PetCareers.interviewLength);`
		});
	});
	for (const species of ['blobby', 'cat', 'dog']) {
	for (const career of careers) {
		currentCareer = career.id;
		await page.goto('/');
		await page.locator(`#species-options input[value="${species}"]`).check();
		await page.getByRole('button', { name: 'Begin the paw-formance review' }).click();
		for (let index = 0; index < 6; index++) {
			await page.locator(`#answers input[value$="-${career.id}"]`).check();
			await page.locator('#next').click();
		}
		await expect(page.locator('#career-title')).toHaveText(career.title);
		const image = page.locator('#result-art img');
		const source = species === 'blobby' ? `assets/blobby-careers/${career.id}.png` : `assets/pet-portraits/${species}-${career.id}.webp`;
		await expect(image).toHaveAttribute('src', source);
		await image.evaluate(image => image.decode());
		const dimension = species === 'blobby' ? 160 : 480;
		expect(await image.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([dimension, dimension]);
		if (species === 'blobby') {
			await expect(page.locator('#result-art')).toHaveAttribute('aria-label', `${outfits[career.id].description} Dressed for the ${career.title} career.`);
		} else {
			await expect(page.locator('#result-art')).toHaveAttribute('aria-label', new RegExp(`${species}.*${career.title}`));
		}
		await expect(page.locator('#result-art svg, #result-art text')).toHaveCount(0);
		const bytes = await fs.readFile(path.join(__dirname, '..', 'public', source));
		hashes.add(createHash('sha256').update(bytes).digest('hex'));
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	}
	}
	expect(hashes.size).toBe(72);
	expect(failures).toEqual([]);
});

test('disabled or broken JavaScript cannot submit a pet name', async ({ browser, baseURL }) => {
	for (const javaScriptEnabled of [false, true]) {
		const context = await browser.newContext({ javaScriptEnabled });
		const page = await context.newPage();
		if (javaScriptEnabled) await page.route('**/quiz.js', route => route.abort());
		const navigations = [];
		page.on('request', request => {
			if (request.isNavigationRequest()) navigations.push(request.url());
		});
		await page.goto(baseURL);
		await expect(page.locator('#pet-name')).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Begin the paw-formance review' })).toBeDisabled();
		await expect(page.locator('#startup-status')).toBeVisible();
		await expect(page.locator('.journey button:enabled')).toHaveCount(0);
		expect(navigations).toHaveLength(1);
		await context.close();
	}
});
