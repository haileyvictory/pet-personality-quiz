/* Copyright (c) Microsoft Corporation. All rights reserved. */
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { personalities, families, questions, createQuiz, determinePersonality, quizLength } = require('../public/engine.js');
const select = ids => ids.map(id => questions.find(question => question.id === id));
const answerFor = (question, personalityId) => question.options.find(option => option.personalityId === personalityId).id;

test('all 24 Blobby personalities are reachable through six distinct human scenarios', () => {
	assert.equal(personalities.length, 24);
	const results = personalities.map(personality => {
		const quiz = questions.filter(question => question.options.some(option => option.personalityId === personality.id)).slice(0, quizLength);
		assert.equal(quiz.length, 6, `${personality.title} needs enough real answer paths`);
		return determinePersonality(quiz, quiz.map(question => answerFor(question, personality.id))).id;
	});
	assert.deepStrictEqual(results, personalities.map(personality => personality.id));
});

test('72 original scenarios have valid, balanced answer paths and varied personality combinations', () => {
	assert.equal(questions.length, 72);
	const personalityIds = new Set(personalities.map(personality => personality.id));
	assert.equal(personalityIds.size, personalities.length);
	assert.equal(new Set(questions.map(question => question.id)).size, questions.length);
	assert.equal(new Set(questions.map(question => question.prompt)).size, questions.length);
	for (const question of questions) {
		assert.equal(question.options.length, 4);
		assert.equal(new Set(question.options.map(option => option.id)).size, 4);
		assert.equal(new Set(question.options.map(option => option.personalityId)).size, 4);
		assert.ok(question.options.every(option => personalityIds.has(option.personalityId) && option.text));
		assert.doesNotMatch(JSON.stringify(question), /\b(?:your pet|cat|dog|pawprints?|purr|career|squirrel)\b/i);
	}
	for (const personality of personalities) {
		const paths = questions.filter(question => question.options.some(option => option.personalityId === personality.id));
		assert.equal(paths.length, 12, `${personality.title} should have balanced representation`);
		const companions = new Set(paths.flatMap(question => question.options.map(option => option.personalityId)));
		assert.ok(companions.size >= 12, `${personality.title} needs varied alternatives, not one repeated set`);
		assert.ok(families[personality.family]);
	}
});

test('replay avoids all previous questions and shuffles both questions and stable answer identities', () => {
	const before = JSON.stringify(questions);
	const first = createQuiz([], () => 0);
	const second = createQuiz(first.map(question => question.id), () => 0);
	const different = createQuiz([], () => 0.99);
	assert.equal(first.length, 6);
	assert.equal(second.length, 6);
	assert.equal(new Set(first.map(question => question.id)).size, 6);
	assert.ok(second.every(question => !first.some(previous => previous.id === question.id)));
	assert.notDeepStrictEqual(first.map(question => question.id), different.map(question => question.id));
	assert.ok(first.every(question => question.options[0].id !== questions.find(original => original.id === question.id).options[0].id));
	assert.equal(JSON.stringify(questions), before);
});

test('results are stable across shuffled options and change when answers are revised', () => {
	const quiz = select(['free-saturday', 'spare-hour', 'desk-space', 'playlist-duty', 'canceled-plans', 'long-week']);
	const answers = quiz.map(question => answerFor(question, 'cozy'));
	assert.equal(determinePersonality(quiz, answers).id, 'cozy');
	assert.equal(determinePersonality(quiz.map(question => ({ ...question, options: [...question.options].reverse() })), answers).id, 'cozy');
	answers.splice(0, 4, ...quiz.slice(0, 4).map(question => answerFor(question, 'spreadsheet')));
	assert.equal(determinePersonality(quiz, answers).id, 'spreadsheet');
	assert.equal(determinePersonality(quiz, answers).id, 'spreadsheet');
});

test('a consistent vibe family counts and ties use the first supporting answer', () => {
	const mixed = select(['free-saturday', 'group-chat', 'bonus-afternoon', 'important-email', 'group-project', 'good-news']);
	const pattern = ['cozy', 'midnight', 'sunshine', 'spreadsheet', 'spreadsheet', 'hype'];
	assert.equal(determinePersonality(mixed, mixed.map((question, index) => answerFor(question, pattern[index]))).id, 'cozy');
	const tied = select(['free-saturday', 'spare-hour', 'desk-space', 'playlist-duty', 'canceled-plans', 'important-email']);
	const choices = ['cozy', 'spreadsheet', 'cozy', 'spreadsheet', 'cozy', 'spreadsheet'];
	const answers = tied.map((question, index) => answerFor(question, choices[index]));
	assert.equal(determinePersonality(tied, answers).id, 'cozy');
	assert.equal(determinePersonality([...tied].reverse(), [...answers].reverse()).id, 'spreadsheet');
});

test('incomplete, sparse, foreign, or positional answers cannot produce a personality', () => {
	const quiz = createQuiz([], () => 0);
	const valid = quiz.map(question => question.options[0].id);
	for (const answers of [[], valid.slice(1), Array(6), [0, ...valid.slice(1)], ['foreign', ...valid.slice(1)], null]) {
		assert.throws(() => determinePersonality(quiz, answers), /complete|choose/i);
	}
	assert.throws(() => determinePersonality(Array(6).fill(quiz[0]), valid), /complete/i);
	assert.throws(() => createQuiz(questions.map(question => question.id)), /not enough fresh/i);
});
