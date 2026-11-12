/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

(() => {
	const { species, careers, createInterview, determineCareer, interviewLength } = PetCareers;
	const byId = id => document.getElementById(id);
	const views = ['welcome', 'interview', 'result'];
	let answers = [];
	let questionIndex = 0;
	let speciesIndex = 0;
	let petName = '';
	let questions = [];
	let previousQuestionIds = [];
	let previewCareerId = window.history.state?.careerPreview;
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
		input.addEventListener('change', () => renderCandidateSetup(pet));
		const symbol = document.createElement('span');
		symbol.className = 'species-symbol';
		symbol.setAttribute('aria-hidden', 'true');
		if (pet.id === 'blobby') {
			const image = document.createElement('img');
			image.src = 'assets/blobby.png';
			image.alt = '';
			symbol.append(image);
		} else {
			const image = document.createElement('img');
			image.src = `assets/${pet.id}.webp`;
			image.alt = '';
			image.className = 'pet-option';
			symbol.append(image);
		}
		const text = document.createElement('span');
		text.className = 'species-copy';
		const title = document.createElement('strong');
		title.textContent = pet.label;
		const pun = document.createElement('small');
		pun.textContent = pet.pun;
		text.append(title, pun);
		label.append(input, symbol, text);
		return label;
	}));

	function renderSticker(target, career, pet = species[speciesIndex]) {
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
		const image = document.createElement('img');
		image.src = career ? `assets/pet-portraits/${pet.id}-${career.id}.webp` : `assets/${pet.id}.webp`;
		image.className = 'pet-portrait';
		image.width = image.height = 480;
		image.alt = '';
		target.replaceChildren(image);
		target.setAttribute('aria-label', career
			? `Storybook illustration of a ${pet.id === 'cat' ? 'fluffy orange cat' : 'golden retriever dog'} dressed as ${career.title}, with job-specific clothing and props.`
			: `Plain illustrated ${pet.id} at the career interview, with no job outfit yet.`);
	}

	function renderCareerPreview(pet) {
		const candidates = careers.filter(career => career.id !== previewCareerId);
		const career = candidates[Math.floor(Math.random() * candidates.length)];
		renderSticker(byId('preview-art'), career, pet);
		byId('preview-title').textContent = career.title;
		byId('preview-description').textContent = career.traits[0];
		byId('preview-number').textContent = String(careers.indexOf(career) + 1).padStart(2, '0');
		previewCareerId = career.id;
		window.history.replaceState({ careerPreview: career.id }, '');
	}

	function renderCandidateSetup(pet) {
		byId('pet-name').placeholder = pet.defaultName;
		renderCareerPreview(pet);
	}

	function updateJourney() {
		const complete = questions.length === interviewLength && questions.every((question, index) =>
			question.options.some(option => option.id === answers[index]));
		document.querySelectorAll('.journey [data-view]').forEach(step => {
			step.disabled = step.dataset.view === 'result' && !complete;
			if (step.dataset.view === document.body.dataset.view) {
				step.setAttribute('aria-current', 'step');
			} else {
				step.removeAttribute('aria-current');
			}
		});
	}

	function show(view, focusId) {
		for (const id of views) {
			byId(id).hidden = id !== view;
		}
		document.body.dataset.view = view;
		updateJourney();
		byId(focusId).focus();
		window.scrollTo({ top: 0, behavior: 'instant' });
	}

	function renderQuestion() {
		const question = questions[questionIndex];
		byId('question-title').textContent = question.prompt;
		byId('question-count').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
		byId('progress').value = questionIndex + 1;
		byId('encouragement').textContent = encouragement[questionIndex];
		byId('candidate-name').textContent = petName || species[speciesIndex].defaultName;
		renderSticker(byId('interview-mascot'));
		const fieldset = byId('answers');
		fieldset.querySelectorAll('label').forEach(label => label.remove());
		question.options.forEach((option, index) => {
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
				updateJourney();
			});
			const copy = document.createElement('span');
			copy.textContent = option.text;
			const letter = document.createElement('span');
			letter.className = 'answer-letter';
			letter.setAttribute('aria-hidden', 'true');
			letter.textContent = String.fromCharCode(65 + index);
			label.append(letter, copy, input);
			fieldset.append(label);
		});
		byId('next-label').textContent = questionIndex === questions.length - 1 ? 'Reveal their career' : 'Next question';
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
		byId('qualifications').replaceChildren(...career.traits.map(trait => {
			const item = document.createElement('li');
			item.textContent = trait;
			return item;
		}));
		show('result', 'result-title');
	}

	byId('step-meet').addEventListener('click', () => show('welcome', 'pet-name'));
	byId('step-interview').addEventListener('click', () => {
		if (questions.length === 0) {
			byId('start-form').requestSubmit();
		} else {
			renderQuestion();
		}
	});
	byId('step-result').addEventListener('click', renderResult);

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
		questions = [];
		questionIndex = 0;
		speciesIndex = 0;
		petName = '';
		byId('start-form').reset();
		renderCandidateSetup(species[0]);
		show('welcome', 'pet-name');
	});
	renderCandidateSetup(species[0]);
	updateJourney();
	byId('start-controls').disabled = false;
	byId('startup-status').hidden = true;
})();
