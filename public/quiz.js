/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

(() => {
	const { personalities, families, createQuiz, determinePersonality, quizLength } = BlobbyQuiz;
	const byId = id => document.getElementById(id);
	const displayName = () => byId('quiz-name').value.trim() || 'Blobby';
	const views = ['welcome', 'quiz', 'result'];
	let answers = [];
	let questionIndex = 0;
	let questions = [];
	let previousQuestionIds = [];
	let previewId = window.history.state?.blobbyPreview;
	byId('progress').max = quizLength;
	const encouragement = [
		'First instinct. Best instinct. Probably.',
		'A highly specific vibe is emerging.',
		'Your inner Blobby is taking notes.',
		'Excellent. Deeply you-shaped behavior.',
		'One step closer to a very good hat.',
		'The final plot twist. Make it yours.'
	];

	function renderBlobby(target, personality) {
		const image = document.createElement('img');
		image.alt = '';
		if (personality) {
			const outfit = BlobbyOutfits[personality.id];
			if (!outfit) {
				throw new Error(`Missing Blobby personality outfit: ${personality.id}`);
			}
			image.src = `assets/blobby-personalities/${personality.id}.png`;
			image.className = 'blobby-portrait';
			image.width = image.height = 160;
			target.setAttribute('aria-label', `${personality.title}. ${outfit.description}`);
		} else {
			image.src = 'assets/blobby.png';
			image.className = 'blobby-avatar';
			image.width = image.height = 96;
			target.setAttribute('aria-label', 'Blue Blobby, your tiny guide to the personality quiz.');
		}
		target.replaceChildren(image);
	}

	function renderPreview() {
		const candidates = personalities.filter(personality => personality.id !== previewId);
		const personality = candidates[Math.floor(Math.random() * candidates.length)];
		renderBlobby(byId('preview-art'), personality);
		byId('preview-title').textContent = personality.title;
		byId('preview-description').textContent = personality.tagline;
		byId('preview-number').textContent = String(personalities.indexOf(personality) + 1).padStart(2, '0');
		byId('blobby-showcase').dataset.palette = BlobbyOutfits[personality.id].color;
		previewId = personality.id;
		window.history.replaceState({ blobbyPreview: personality.id }, '');
	}

	function updateJourney() {
		const complete = questions.length === quizLength && questions.every((question, index) =>
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
		byId('quiz-player').textContent = displayName();
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
		byId('next-label').textContent = questionIndex === questions.length - 1 ? 'Reveal my Blobby' : 'Next question';
		byId('answer-error').hidden = true;
		show('quiz', 'question-title');
	}

	function renderResult() {
		const personality = determinePersonality(questions, answers);
		byId('result-title').textContent = `${displayName()}, meet your Blobby.`;
		byId('personality-title').textContent = personality.title;
		byId('result-family').textContent = families[personality.family];
		byId('personality-tagline').textContent = personality.tagline;
		byId('personality-description').textContent = personality.description;
		byId('mantra').textContent = personality.mantra;
		byId('result-style').textContent = BlobbyOutfits[personality.id].style;
		byId('result').dataset.palette = BlobbyOutfits[personality.id].color;
		renderBlobby(byId('result-art'), personality);
		byId('traits').replaceChildren(...personality.traits.map(trait => {
			const item = document.createElement('li');
			item.textContent = trait;
			return item;
		}));
		show('result', 'result-title');
	}

	function startQuiz() {
		answers = [];
		questionIndex = 0;
		questions = createQuiz(previousQuestionIds);
		previousQuestionIds = questions.map(question => question.id);
		renderQuestion();
	}

	byId('step-home').addEventListener('click', () => show('welcome', 'quiz-name'));
	byId('step-quiz').addEventListener('click', () => {
		if (questions.length === 0) {
			byId('start-form').requestSubmit();
		} else {
			renderQuestion();
		}
	});
	byId('step-result').addEventListener('click', renderResult);
	byId('start-form').addEventListener('submit', event => {
		event.preventDefault();
		startQuiz();
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
			show('welcome', 'quiz-name');
		} else {
			questionIndex--;
			renderQuestion();
		}
	});
	byId('edit-answers').addEventListener('click', () => {
		questionIndex = 0;
		renderQuestion();
	});
	byId('restart').addEventListener('click', startQuiz);
	renderBlobby(byId('quiz-mascot'));
	renderPreview();
	updateJourney();
	byId('start-controls').disabled = false;
	byId('startup-status').hidden = true;
})();
