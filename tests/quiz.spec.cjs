const { test, expect } = require('@playwright/test');

test('Blobby leads, supports keyboard selection, and completes a private, replayable interview', async ({ page, baseURL }) => {
	const failures = [];
	const requests = [];
	page.on('pageerror', error => failures.push(error.message));
	page.on('console', message => {
		if (message.type() === 'error') failures.push(message.text());
	});
	page.on('request', request => requests.push(request.url()));
	await page.goto('/');
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
	await expect(page.locator('#result-title')).toHaveText("<img src=x onerror=alert(1)>, you're hired.");
	await expect(page.locator('#result-title img')).toHaveCount(0);
	await expect(page.locator('#career-title')).not.toBeEmpty();
	await expect(page.locator('#result-art')).toHaveAttribute('aria-label', /Blobby/);
	await page.locator('#edit-answers').click();
	await expect(page.locator('#answers input:checked')).toHaveValue(revisedAnswer);
	for (let index = 0; index < 6; index++) await page.locator('#next').click();
	await page.locator('#restart').click();
	await expect(page.locator('#welcome')).toBeVisible();
	await expect(page.locator('#pet-name')).toHaveValue('');
	await expect(pets.first()).toBeChecked();
	expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: '' });
	expect(requests.every(url => url.startsWith(baseURL + '/') && !url.includes('petName'))).toBe(true);
	expect(failures).toEqual([]);
});

test('cat and dog artwork loads, and the page fits narrow screens and reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/');
	await expect(page.locator('.species-symbol img')).toBeVisible();
	expect(await page.locator('.species-symbol img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
	const artResponse = await page.request.get('assets/pet-careers.png');
	expect(artResponse.ok()).toBe(true);
	for (const pet of ['cat', 'dog']) {
		await page.locator(`#species-options input[value="${pet}"]`).check();
		await page.getByRole('button', { name: 'Begin the paw-formance review' }).click();
		await expect(page.locator('#interview-mascot')).toHaveAttribute('aria-label', new RegExp(pet));
		for (let index = 0; index < 6; index++) {
			await page.locator('#answers input').first().check();
			await page.locator('#next').click();
		}
		await expect(page.locator('#result-art')).toHaveAttribute('aria-label', new RegExp(pet));
		expect(await page.locator('#result-art').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await page.locator('#restart').click();
	}
	await page.setViewportSize({ width: 320, height: 800 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
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
		expect(navigations).toHaveLength(1);
		await context.close();
	}
});
