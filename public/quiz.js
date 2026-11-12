/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

(() => {
	const { species, createInterview, determineCareer, interviewLength } = PetCareers;
	const byId = id => document.getElementById(id);
	const views = ['welcome', 'interview', 'result'];
	let answers = [];
	let questionIndex = 0;
	let speciesIndex = 0;
	let petName = '';
	let questions = [];
	let previousQuestionIds = [];
	byId('progress').max = interviewLength;
	const encouragement = ['First im-purr-essions count.', 'Excellent. Very paw-suasive.', 'The hiring committee is taking notes.', 'An impressive pawrtfolio is emerging.', 'Almost offish-ially qualified.', 'One last reference. No thumbs required.'];

	byId('species-options').replaceChildren(...species.map((pet, index) => {
		const label = document.createElement('label');
		const input = document.createElement('input');
		input.type = 'radio';
		input.name = 'species';
		input.value = pet.id;
		input.checked = index === 0;
		input.defaultChecked = index === 0;
		const symbol = document.createElement('span');
		symbol.className = 'species-symbol';
		symbol.setAttribute('aria-hidden', 'true');
		if (pet.id === 'blobby') {
			const image = document.createElement('img');
			image.src = 'assets/blobby.png';
			image.alt = '';
			symbol.append(image);
		} else {
			symbol.textContent = pet.symbol;
		}
		const text = document.createElement('span');
		const title = document.createElement('strong');
		title.textContent = pet.label;
		const pun = document.createElement('small');
		pun.textContent = pet.pun;
		text.append(title, pun);
		label.append(input, symbol, text);
		return label;
	}));

	function renderSticker(target, career) {
		const pet = species[speciesIndex];
		if (pet.id === 'blobby') {
			const image = document.createElement('img');
			image.alt = '';
			if (career) {
				const outfit = BlobbyOutfits[career.id];
				if (!outfit) {
					throw new Error(`Missing Blobby career outfit: ${career.id}`);
				}
				image.src = `assets/blobby-careers/${career.id}.png`;
				image.className = 'blobby-career';
				image.width = image.height = 160;
				target.setAttribute('aria-label', `${outfit.description} Dressed for the ${career.title} career.`);
			} else {
				image.src = 'assets/blobby.png';
				image.className = 'blobby-interview';
				image.width = image.height = 96;
				target.setAttribute('aria-label', 'Blobby, the blue VS Code pet, at the career interview.');
			}
			target.replaceChildren(image);
			return;
		}
		const ears = {
			cat: '<path d="M118 160 105 68 180 119M242 119 315 68 302 160" fill="#edb275"/>',
			dog: '<ellipse cx="113" cy="170" rx="33" ry="76" fill="#ba784c" transform="rotate(18 113 170)"/><ellipse cx="307" cy="170" rx="33" ry="76" fill="#ba784c" transform="rotate(-18 307 170)"/>'
		};
		const fills = { cat: '#f3c58d', dog: '#e9bc91' };
		const character = `${ears[pet.id]}<ellipse cx="210" cy="212" rx="111" ry="98" fill="${fills[pet.id]}"/><ellipse cx="210" cy="286" rx="66" ry="54" fill="${fills[pet.id]}"/><ellipse cx="168" cy="208" rx="8" ry="11" fill="#283747"/><ellipse cx="252" cy="208" rx="8" ry="11" fill="#283747"/><ellipse cx="145" cy="232" rx="18" ry="10" fill="#f0a3ab" opacity=".65"/><ellipse cx="275" cy="232" rx="18" ry="10" fill="#f0a3ab" opacity=".65"/><path d="m201 229 9 8 9-8Z" fill="#ae6b70"/><path d="M210 238q-8 17-21 5m21-5q8 17 21 5" fill="none" stroke="#6b554d" stroke-width="3" stroke-linecap="round"/><path d="m183 292 27 12 27-12v30l-27-13-27 13Z" fill="#347e75"/><circle cx="210" cy="306" r="7" fill="#efb95c"/>`;
		target.innerHTML = `<svg viewBox="0 0 420 400" aria-hidden="true" focusable="false"><circle cx="210" cy="206" r="154" fill="#fff5d5"/><g fill="#e8b44e"><path d="m65 92 5 13 14 5-14 5-5 13-5-13-14-5 14-5Z"/><path d="m354 265 5 13 14 5-14 5-5 13-5-13-14-5 14-5Z"/></g><ellipse cx="210" cy="346" rx="110" ry="13" fill="#315744" opacity=".1"/>${character}<circle cx="320" cy="300" r="52" fill="white" stroke="#d4dfcb" stroke-width="2"/><text x="320" y="319" text-anchor="middle" font-size="54" font-family="Segoe UI Emoji, sans-serif">${career ? career.symbol : '🐾'}</text></svg>`;
		const description = `Illustrated ${pet.label.toLowerCase()}`;
		target.setAttribute('aria-label', career ? `${description} with a ${career.title} career badge.` : `${description} at the career interview.`);
	}

	function show(view, focusId) {
		for (const id of views) {
			byId(id).hidden = id !== view;
		}
		byId(focusId).focus();
		window.scrollTo({ top: 0, behavior: 'instant' });
	}

	function renderQuestion() {
		const question = questions[questionIndex];
		byId('question-title').textContent = question.prompt;
		byId('question-count').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
		byId('progress').value = questionIndex + 1;
		byId('encouragement').textContent = encouragement[questionIndex];
		renderSticker(byId('interview-mascot'));
		const fieldset = byId('answers');
		fieldset.querySelectorAll('label').forEach(label => label.remove());
		question.options.forEach(option => {
			const label = document.createElement('label');
			label.className = 'answer';
			const input = document.createElement('input');
			input.type = 'radio';
			input.name = 'answer';
			input.value = option.id;
			input.checked = answers[questionIndex] === option.id;
			input.addEventListener('change', () => {
				answers[questionIndex] = option.id;
				byId('answer-error').hidden = true;
			});
			const copy = document.createElement('span');
			copy.textContent = option.text;
			label.append(input, copy);
			fieldset.append(label);
		});
		byId('next').textContent = questionIndex === questions.length - 1 ? 'Paw-sitively ready. Reveal their career!' : 'Next question →';
		byId('answer-error').hidden = true;
		show('interview', 'question-title');
	}

	function renderResult() {
		const career = determineCareer(questions, answers);
		const name = petName || species[speciesIndex].defaultName;
		byId('result-title').textContent = `${name}, you're hired.`;
		byId('career-title').textContent = career.title;
		byId('result-department').textContent = career.department;
		byId('offer').textContent = career.offer;
		const art = byId('result-art');
		renderSticker(art, career);
		const preparedColumn = { cardboard: 0, snacks: 1, surveillance: 2 }[career.id];
		const preparedRow = { cat: 0, dog: 1 }[species[speciesIndex].id];
		const prepared = byId('prepared-art');
		prepared.hidden = preparedColumn === undefined || preparedRow === undefined;
		if (!prepared.hidden) {
			prepared.style.setProperty('--column', preparedColumn);
			prepared.style.setProperty('--row', preparedRow);
			prepared.setAttribute('aria-label', `Prepared AI illustration of a ${species[speciesIndex].label.toLowerCase()} working as ${career.title}.`);
		}
		byId('qualifications').replaceChildren(...career.traits.map(trait => {
			const item = document.createElement('li');
			item.textContent = trait;
			return item;
		}));
		show('result', 'result-title');
	}

	byId('start-form').addEventListener('submit', event => {
		event.preventDefault();
		petName = byId('pet-name').value.trim();
		const selected = new FormData(event.currentTarget).get('species');
		speciesIndex = species.findIndex(pet => pet.id === selected);
		if (speciesIndex === -1) {
			throw new Error('Choose a supported pet type before starting.');
		}
		answers = [];
		questionIndex = 0;
		questions = createInterview(previousQuestionIds);
		previousQuestionIds = questions.map(question => question.id);
		renderQuestion();
	});

	byId('answer-form').addEventListener('submit', event => {
		event.preventDefault();
		if (!questions[questionIndex].options.some(option => option.id === answers[questionIndex])) {
			byId('answer-error').hidden = false;
			byId('answers').querySelector('input').focus();
			return;
		}
		if (questionIndex === questions.length - 1) {
			renderResult();
		} else {
			questionIndex++;
			renderQuestion();
		}
	});

	byId('back').addEventListener('click', () => {
		if (questionIndex === 0) {
			show('welcome', 'pet-name');
		} else {
			questionIndex--;
			renderQuestion();
		}
	});

	byId('edit-answers').addEventListener('click', () => {
		questionIndex = 0;
		renderQuestion();
	});

	byId('restart').addEventListener('click', () => {
		answers = [];
		questionIndex = 0;
		speciesIndex = 0;
		petName = '';
		byId('start-form').reset();
		show('welcome', 'pet-name');
	});
	byId('start-controls').disabled = false;
	byId('startup-status').hidden = true;
})();
