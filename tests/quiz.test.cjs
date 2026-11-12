/* Copyright (c) Microsoft Corporation. All rights reserved. */
'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { careers, questions, createInterview, determineCareer, interviewLength } = require('../public/engine.js');
const select = ids => ids.map(id => questions.find(question => question.id === id));
const answerFor = (question, careerId) => question.options.find(option => option.careerId === careerId).id;

test('at least 20 careers are genuinely reachable through six distinct authored scenarios', () => {
	assert.ok(careers.length >= 20);
	const results = careers.map(career => {
		const interview = questions.filter(question => question.options.some(option => option.careerId === career.id)).slice(0, interviewLength);
		assert.equal(interview.length, 6, `${career.title} needs enough real answer paths`);
		return determineCareer(interview, interview.map(question => answerFor(question, career.id))).id;
	});
	assert.deepStrictEqual(results, careers.map(career => career.id));
});

test('the varied question bank has unique scenarios and valid stable answer identities', () => {
	assert.ok(questions.length >= 48);
	const careerIds = new Set(careers.map(career => career.id));
	assert.deepStrictEqual({
		uniqueQuestions: new Set(questions.map(question => question.id)).size,
		uniquePrompts: new Set(questions.map(question => question.prompt)).size,
		invalid: questions.filter(question => question.options.length !== 4 ||
			new Set(question.options.map(option => option.id)).size !== 4 ||
			question.options.some(option => !careerIds.has(option.careerId) || !option.text))
	}, { uniqueQuestions: questions.length, uniquePrompts: questions.length, invalid: [] });
});

test('repeat interviews avoid the previous six questions and shuffle answer positions without mutating content', () => {
	const before = JSON.stringify(questions);
	const first = createInterview([], () => 0);
	const second = createInterview(first.map(question => question.id), () => 0);
	const firstIds = new Set(first.map(question => question.id));
	assert.deepStrictEqual({
		lengths: [first.length, second.length],
		unique: [new Set(first.map(question => question.id)).size, new Set(second.map(question => question.id)).size],
		repeated: second.filter(question => firstIds.has(question.id)),
		changedOrder: first.every(question => question.options[0].id !== questions.find(original => original.id === question.id).options[0].id),
		bankUnchanged: JSON.stringify(questions) === before
	}, { lengths: [6, 6], unique: [6, 6], repeated: [], changedOrder: true, bankUnchanged: true });
});

test('current answers determine the result even after options are shuffled and answers are revised', () => {
	const interview = select(['parcel', 'delivery', 'business-card', 'talent-show', 'award', 'art-gallery']);
	const answers = interview.map((question, index) => answerFor(question, index < 4 ? 'cardboard' : 'artist'));
	const before = determineCareer(interview, answers).id;
	const reordered = determineCareer(interview.map(question => ({ ...question, options: [...question.options].reverse() })), answers).id;
	answers.splice(0, 4, ...interview.slice(0, 4).map(question => answerFor(question, 'artist')));
	assert.deepStrictEqual({ before, reordered, after: determineCareer(interview, answers).id }, { before: 'cardboard', reordered: 'cardboard', after: 'artist' });
});

test('a pattern across related careers counts, and ties follow the first supporting answer', () => {
	const mixed = select(['parcel', 'day-off', 'blanket', 'visitor', 'uniform', 'morning']);
	const pattern = ['cardboard', 'naps', 'forts', 'snacks', 'snacks', 'marketing'];
	const tied = select(['parcel', 'delivery', 'business-card', 'talent-show', 'award', 'art-gallery']);
	const first = ['artist', 'cardboard', 'artist', 'cardboard', 'artist', 'cardboard'];
	assert.deepStrictEqual({
		pattern: determineCareer(mixed, mixed.map((question, index) => answerFor(question, pattern[index]))).id,
		tie: determineCareer(tied, tied.map((question, index) => answerFor(question, first[index]))).id
	}, { pattern: 'cardboard', tie: 'artist' });
});

test('incomplete, sparse, foreign, or index-based answers cannot produce a result', () => {
	const interview = createInterview([], () => 0);
	const valid = interview.map(question => question.options[0].id);
	for (const answers of [[], valid.slice(1), Array(6), [0, ...valid.slice(1)], ['foreign', ...valid.slice(1)], null]) {
		assert.throws(() => determineCareer(interview, answers), /complete|choose/i);
	}
	assert.throws(() => determineCareer(Array(6).fill(interview[0]), valid), /complete/i);
});
