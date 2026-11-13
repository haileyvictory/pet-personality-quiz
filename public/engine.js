/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const BlobbyQuiz = (() => {
	const families = {
		grounded: 'The recharge club',
		organized: 'The master planners',
		creative: 'The imagination department',
		expressive: 'The main-stage energy',
		connector: 'The people people',
		adventurous: 'The plot-twist society'
	};
	const personality = (id, family, title, tagline, description, traits, mantra) => ({
		id, family, title, tagline, description, traits, mantra
	});
	const personalities = [
		personality('cozy', 'grounded', 'Cozy Blobby', 'Unavailable. Comfortably.',
			'You make slowing down look like an art form. Your ideal plans involve soft lighting, a very good blanket, and absolutely no surprise activities.',
			['Protects downtime like a national treasure', 'Knows which seat has the best blanket access', 'Makes doing nothing feel like a proper occasion'], 'A quiet evening is a complete plan.'),
		personality('midnight', 'grounded', 'Midnight Blobby', 'One more tab. One more little idea.',
			'Your brain starts its best work just as everyone else is logging off. A midnight playlist, a warm drink, and a mildly unnecessary rabbit hole? Perfect.',
			['Has a second wind with impeccable bad timing', 'Finds the good stuff after the crowds leave', 'Calls 11:47 p.m. an early start'], 'Tomorrow can wait five more minutes.'),
		personality('sunshine', 'grounded', 'Sunshine Blobby', 'A walking forecast of mostly excellent.',
			'You spot the bright side without pretending the clouds are not there. You bring a little optimism, a little perspective, and surprisingly good outdoor plans.',
			['Makes ordinary afternoons feel promising', 'Spots the small good thing everyone missed', 'Can turn a setback into a scenic detour'], 'There is probably a nice way to do this.'),
		personality('rainy-day', 'grounded', 'Rainy Day Blobby', 'Soft soundtrack. Strong inner monologue.',
			'You appreciate a little atmosphere. Give you a book, a window, and weather with dramatic potential, and you can turn an ordinary day into a beautifully quiet scene.',
			['Has a playlist for staring thoughtfully out of windows', 'Enjoys a plan with room to breathe', 'Treats a rainy afternoon as a feature, not a bug'], 'Let the world be loud somewhere else.'),
		personality('spreadsheet', 'organized', 'Spreadsheet Blobby', 'Yes, there is a tab for that.',
			'You bring order to the group chat and receipts to the friendly debate. Some people see a messy plan. You see an opportunity for tasteful conditional formatting.',
			['Has already compared the options', 'Turns complicated plans into readable little boxes', 'Finds suspicious amounts of joy in a working formula'], 'We can have fun and a shared document.'),
		personality('prepared', 'organized', 'Just-in-Case Blobby', 'Packed an umbrella. And a backup umbrella.',
			'You are the person everyone is quietly relieved to have around. Spare charger, extra layer, plan B: you have thought of it without making a whole production of it.',
			['Carries the thing someone is about to need', 'Builds a backup plan into the actual plan', 'Can locate an exit, a charger, and a snack in seconds'], 'Future us will be very grateful.'),
		personality('fixer', 'organized', 'Fix-It Blobby', 'Give me five minutes and a tiny screwdriver.',
			'You like making things work. When the situation gets tangled, you skip the dramatic speech and find the loose cable, the missing step, or the surprisingly simple solution.',
			['Reads the instructions when it actually matters', 'Makes complicated problems feel fixable', 'Has strong opinions about a properly labeled cable'], 'Before we panic, have we tried the obvious thing?'),
		personality('overthinker', 'organized', 'Overthinking Blobby', 'The message said "okay." Interesting.',
			'Your brain has excellent research capabilities and no obvious closing time. You notice details, consider every angle, and can give a two-word text a full director commentary.',
			['Has considered at least three interpretations', 'Asks the useful question nobody else thought of', 'Can plan a conversation that has not happened yet'], 'Let me just think about this one more time.'),
		personality('artsy', 'creative', 'Artsy Blobby', 'That would look good in a sketchbook.',
			'You collect colors, textures, and little sparks of inspiration wherever you go. You are not just looking at the world. You are mentally rearranging its composition.',
			['Finds inspiration in deeply ordinary objects', 'Makes things by hand, then changes one more detail', 'Always notices the interesting color combination'], 'What if we made something out of this?'),
		personality('aesthetic', 'creative', 'Aesthetic Blobby', 'The lighting is part of the plan.',
			'You know the power of a good atmosphere. A well-placed lamp, a perfectly chosen playlist, a coordinated notebook: you make daily life feel a little more intentional.',
			['Can improve a room by moving exactly one object', 'Has a mood board for something very specific', 'Believes function and beautiful little details can coexist'], 'It works. Now let us make it feel right.'),
		personality('tinkerer', 'creative', 'Tinkering Blobby', 'It was a small project. Three projects ago.',
			'You cannot resist a good "what if." You learn by poking around, making prototypes, and occasionally turning a simple task into a delightfully unnecessary invention.',
			['Has at least one prototype in a drawer', 'Learns the thing by building a slightly odd thing', 'Sees spare parts where others see a junk drawer'], 'There is definitely a more interesting way to do this.'),
		personality('daydreamer', 'creative', 'Daydream Blobby', 'Physically here. Mentally in the sequel.',
			'You have a whole universe running in the background. An everyday moment can become a new idea, an imaginary adventure, or the opening scene of something brilliant.',
			['Turns waiting time into world-building time', 'Has a surprisingly detailed imaginary future', 'Finds a possibility hiding inside a boring afternoon'], 'Okay, but imagine if...'),
		personality('main-character', 'expressive', 'Main Character Blobby', 'This errand has a soundtrack.',
			'You bring a little cinematic energy to ordinary life. A dramatic entrance, a memorable story, a perfectly timed song: why not make the day worth retelling?',
			['Turns a short story into a very good story', 'Has an entrance song, at least mentally', 'Finds the scene in every mundane situation'], 'This feels like an important part of the montage.'),
		personality('hype', 'expressive', 'Hype Blobby', 'Your small win is now a major event.',
			'You are the enthusiastic voice in the corner who means every word. Someone tried a new thing? Sent the email? Finally finished the task? You are ready to celebrate it.',
			['Gives a pep talk with actual conviction', 'Makes other people feel brave enough to try', 'Treats progress as something worth cheering for'], 'Wait. That is actually huge.'),
		personality('party', 'expressive', 'Party Blobby', 'A normal Tuesday? We can fix that.',
			'You can find an occasion in almost anything. You bring the playlist, the ridiculous game, and just enough momentum to make "maybe" become a story everybody remembers.',
			['Turns casual plans into an actual occasion', 'Knows when the playlist needs a ridiculous song', 'Can convince a room to try one more round'], 'We are already here. We might as well make it fun.'),
		personality('extra', 'expressive', 'Extra Blobby', 'A little much. Exactly enough.',
			'You enjoy a flourish. If a cupcake can have a tiny flag, an outfit can have a statement accessory, or a regular dinner can have a theme, you see no reason to hold back.',
			['Commits wholeheartedly to the bit', 'Packs a statement accessory for a minor occasion', 'Can add a finishing touch to a finishing touch'], 'Subtle was one of the options. I chose this.'),
		personality('host', 'connector', 'Host Blobby', 'Come in. I already made enough.',
			'You make people feel like they belong before they have even taken off their coat. You remember the little details and build the kind of plans people feel comfortable inside.',
			['Remembers what everyone likes', 'Makes room for the quieter person in the group', 'Has an extremely generous definition of a small gathering'], 'There is room for one more.'),
		personality('pen-pal', 'connector', 'Pen Pal Blobby', 'Saw this and thought of you.',
			'You keep friendships alive through little thoughtful signals. A good link, a handwritten note, a perfectly specific check-in: your superpower is making someone feel remembered.',
			['Sends the link that is exactly their kind of weird', 'Remembers a detail from a conversation months ago', 'Turns a quick check-in into something genuinely thoughtful'], 'This reminded me of our very specific conversation.'),
		personality('heart', 'connector', 'Big Heart Blobby', 'No speech required. I am here.',
			'You notice what people need, including when they do not need advice. You bring warmth, patience, and the rare ability to sit beside somebody without trying to fix the whole universe.',
			['Checks on the person behind the update', 'Makes awkward moments feel a little gentler', 'Knows that listening counts as doing something'], 'Do you want ideas, company, or just a really good snack?'),
		personality('foodie', 'connector', 'Foodie Blobby', 'We can discuss it over something delicious.',
			'You know good food is an experience worth sharing. You have a saved restaurant list, strong pastry opinions, and a gift for turning a meal into the best part of the day.',
			['Has a place in mind before anyone asks', 'Believes a shared snack can improve most situations', 'Remembers a trip through its standout meals'], 'First, a very important question: what are we eating?'),
		personality('side-quest', 'adventurous', 'Side Quest Blobby', 'The destination was more of a suggestion.',
			'You follow interesting little leads. A new street, an unfamiliar shop, an oddly specific workshop: you are excellent at finding the adventure hiding next to the actual plan.',
			['Finds the interesting place two turns off the route', 'Collects experiences with very little explanation', 'Comes back from one errand with an unexpected story'], 'We have time for one tiny detour. Probably.'),
		personality('detective', 'adventurous', 'Detective Blobby', 'A harmless mystery? I am listening.',
			'You like connecting the dots. You notice a clue, ask a good question, and become pleasantly invested in figuring out why that sign, sound, or strangely specific detail exists.',
			['Can spot the detail everyone else walked past', 'Enjoys a mystery with refreshingly low stakes', 'Asks follow-up questions that make the story better'], 'Wait. There is definitely a story here.'),
		personality('momentum', 'adventurous', 'Momentum Blobby', 'Already put the shoes on.',
			'You get things moving. You may not need the perfect plan, but you do need a first step. Your gift is turning a vague good idea into something that is actually happening.',
			['Makes starting feel easier than talking about starting', 'Turns a spare hour into visible progress', 'Can move a plan out of the group chat and into real life'], 'We can figure out the rest on the way.'),
		personality('wildcard', 'adventurous', 'Plot Twist Blobby', 'Not on the itinerary. Excellent.',
			'You make room for the unexpected. You are willing to try the odd option, change direction, and discover that a slightly chaotic day might be the one you remember best.',
			['Tries the unfamiliar thing just to see what happens', 'Can adapt without mourning the entire old plan', 'Makes a surprising choice feel like an invitation'], 'What is the least boring option?')
	];
	const q = (id, prompt, options) => ({
		id, prompt, options: options.map(([personalityId, text]) => ({ id: `${id}-${personalityId}`, personalityId, text }))
	});
	const questions = [
		q('free-saturday', 'You wake up with a completely free Saturday. First move?', [['cozy', 'Move the blanket to the sofa. Big day ahead.'], ['spreadsheet', 'Make a satisfying little list of all the possibilities.'], ['main-character', 'Put on a soundtrack and become the opening scene.'], ['side-quest', 'Leave the house and follow the first interesting sign.']]),
		q('group-chat', 'The group chat has 87 unread messages. You...', [['midnight', 'Catch up at 1 a.m. This is my natural habitat.'], ['overthinker', 'Read every message to understand the full social context.'], ['hype', 'Send one incredibly enthusiastic message in all caps.'], ['pen-pal', 'Reply to the thing my friend mentioned three days ago.']]),
		q('rain-plan', 'Rain has officially ruined the outdoor plan. What now?', [['rainy-day', 'A book, a window, and a beautifully moody playlist.'], ['prepared', 'Activate the indoor backup plan I already saved.'], ['artsy', 'Turn the afternoon into a messy creative project.'], ['wildcard', 'Go out anyway. Wear the rain boots. Become a story.']]),
		q('house-party', 'At a small house party, you are most likely to be...', [['host', 'Making sure the new person has somebody to talk to.'], ['foodie', 'Asking who made this incredible dip.'], ['party', 'Suggesting a game with extremely unserious rules.'], ['aesthetic', 'Adjusting one lamp. Trust me, it changes everything.']]),
		q('broken-gadget', 'A gadget stops working right before you need it. Your response?', [['fixer', 'Check the cable, the settings, and the very obvious switch.'], ['tinkerer', 'Open it up. I have been curious about this thing anyway.'], ['detective', 'Investigate the exact sequence of events before it failed.'], ['heart', 'Reassure the stressed person before doing anything else.']]),
		q('bonus-afternoon', 'A meeting gets canceled and you gain a whole afternoon. You...', [['sunshine', 'Go outside and enjoy this suspiciously lovely development.'], ['daydreamer', 'Imagine three completely different futures for the next four hours.'], ['extra', 'Treat myself to something wildly fancy for a regular afternoon.'], ['momentum', 'Finally start the thing I keep saying I will start.']]),
		q('road-trip', 'Your friends announce a last-minute road trip. You bring...', [['prepared', 'Chargers, a first-aid kit, and a backup route.'], ['foodie', 'A cooler and a very carefully selected snack lineup.'], ['side-quest', 'A list of strange little stops along the way.'], ['party', 'A playlist that will become everybody else\'s problem.']]),
		q('late-night', 'It is late and you are still wide awake. What are you doing?', [['midnight', 'Having my most productive hour, annoyingly.'], ['daydreamer', 'Designing an imaginary life in an imaginary city.'], ['tinkerer', 'Making a small improvement that requires twelve new parts.'], ['pen-pal', 'Sending a friend a link they will find in the morning.']]),
		q('presentation', 'You have to give a five-minute presentation. Your preparation is...', [['main-character', 'A strong opening line and an entrance with purpose.'], ['spreadsheet', 'Clean slides, clear timings, and a beautifully organized outline.'], ['overthinker', 'Rehearsing every possible follow-up question.'], ['hype', 'Reminding myself and the team that we are going to crush this.']]),
		q('thrift-store', 'You have 20 minutes in a thrift store. You look for...', [['aesthetic', 'The perfect object to complete a very specific corner.'], ['artsy', 'Materials with interesting shapes, textures, or potential.'], ['extra', 'An accessory that absolutely needs its own occasion.'], ['detective', 'The item with the most unexplained backstory.']]),
		q('canceled-plans', 'A friend cancels tonight\'s plans. Your honest first thought?', [['cozy', 'My comfortable clothes just received a promotion.'], ['rainy-day', 'A quiet evening has a certain cinematic appeal.'], ['host', 'Maybe I can invite them over for something low-key instead.'], ['heart', 'I hope they are okay. I will check in gently.']]),
		q('closed-route', 'Your usual route is closed. You...', [['sunshine', 'Decide the new route might actually be nicer.'], ['fixer', 'Find the simplest workable alternative.'], ['momentum', 'Pick a direction and keep moving.'], ['wildcard', 'Take the unfamiliar route and see where it leads.']]),
		q('cafe-line', 'The cafe line is moving extremely slowly. You...', [['foodie', 'Use the extra time to investigate the pastry situation.'], ['spreadsheet', 'Calculate whether another cafe would actually be faster.'], ['heart', 'Make sure the overwhelmed barista knows there is no rush.'], ['midnight', 'Wonder why I agreed to do anything this early.']]),
		q('new-apartment', 'You move into a new place. What gets sorted first?', [['aesthetic', 'The lighting. I need this place to feel like me.'], ['prepared', 'The essentials box I packed separately for this exact moment.'], ['fixer', 'The Wi-Fi and anything that needs assembling.'], ['host', 'A comfortable spot where friends can hang out.']]),
		q('new-hobby', 'You decide to try a new hobby. You choose...', [['tinkerer', 'Something I can learn by building a slightly odd prototype.'], ['side-quest', 'The class with a description I do not fully understand.'], ['artsy', 'Something involving color, paper, or getting my hands messy.'], ['daydreamer', 'The one that makes me imagine a whole new version of myself.']]),
		q('group-photo', 'Someone says, "Let us take a group photo." You...', [['main-character', 'Find the angle. This is clearly the album cover.'], ['extra', 'Ask if we can do one more with a more dramatic pose.'], ['hype', 'Tell everybody they look incredible, loudly.'], ['sunshine', 'Smile and try to catch the candid, happy moment.']]),
		q('train-delay', 'Your train is delayed by an hour. You...', [['overthinker', 'Work through every possible knock-on effect of the delay.'], ['detective', 'Become invested in why platform four keeps changing.'], ['rainy-day', 'Get a warm drink and watch the station like a quiet film.'], ['cozy', 'Find the softest seat and lower all expectations.']]),
		q('surprise-invite', 'An invitation arrives for an event you know nothing about. You...', [['party', 'Ask who is coming and whether there is a dance floor.'], ['wildcard', 'Say yes. Knowing nothing is part of the appeal.'], ['momentum', 'Put it in the calendar before I can overcomplicate it.'], ['pen-pal', 'Send it to the friend whose specific interests it matches.']]),
		q('spare-hour', 'You have one unexpected hour to yourself. You spend it...', [['cozy', 'Comfortably horizontal with my phone on silent.'], ['daydreamer', 'Mentally redesigning my life while looking at the ceiling.'], ['spreadsheet', 'Finally sorting a small, extremely satisfying mess.'], ['momentum', 'Doing the first three steps of a project.']]),
		q('theme-song', 'Your day needs a theme song. What is the vibe?', [['main-character', 'The one that makes a grocery run feel like a movie.'], ['midnight', 'Something excellent that sounds better after midnight.'], ['foodie', 'Whatever is playing in my favorite little restaurant.'], ['extra', 'Full orchestral drama. For brushing my teeth.']]),
		q('scavenger-hunt', 'A friend invents a neighborhood scavenger hunt. Your approach?', [['detective', 'Study the clues and notice the oddly specific details.'], ['prepared', 'Pack water, a charger, and a pen that actually works.'], ['artsy', 'Make the clue sheet into a little illustrated map.'], ['wildcard', 'Follow the funniest lead, even if it is probably wrong.']]),
		q('birthday-plan', 'Your friend says they want a low-key birthday. You...', [['host', 'Make a relaxed plan where they do not have to organize anything.'], ['heart', 'Ask what would genuinely make the day feel good for them.'], ['party', 'Suggest one tiny celebration that could become three.'], ['pen-pal', 'Write a note with a memory only the two of us share.']]),
		q('meeting-chaos', 'A meeting has gone completely off the rails. You...', [['fixer', 'Identify what we actually need to decide.'], ['tinkerer', 'Suggest a new approach nobody has tried yet.'], ['hype', 'Bring a little enthusiasm back into the room.'], ['overthinker', 'Wonder whether the agenda had a hidden second meaning.']]),
		q('perfect-forecast', 'Pick the forecast for your ideal afternoon.', [['sunshine', 'Clear skies and a good reason to walk somewhere.'], ['rainy-day', 'Gentle rain and no requirement to leave the house.'], ['aesthetic', 'Golden light that makes every room look better.'], ['side-quest', 'Changing conditions. An excellent excuse to change the plan.']]),
		q('important-email', 'You are about to send an important email. Final step?', [['spreadsheet', 'Check the details against my tidy little checklist.'], ['pen-pal', 'Add one genuinely thoughtful, specific sentence.'], ['overthinker', 'Reread it until "Hi" starts looking strange.'], ['hype', 'Hit send, then celebrate the fact that I did it.']]),
		q('museum-room', 'You enter a museum room with one mysterious object. You...', [['artsy', 'Study the shape and sketch it in the margin.'], ['detective', 'Read every bit of the label, including the footnotes.'], ['daydreamer', 'Invent the entire life of whoever owned it.'], ['main-character', 'Imagine the scene where I dramatically discover it.']]),
		q('dinner-for-friends', 'You cook for a few friends. Your signature move?', [['foodie', 'A recipe I have been saving for exactly this occasion.'], ['host', 'Quietly checking everyone\'s preferences before planning the menu.'], ['tinkerer', 'An experimental version with one slightly unusual ingredient.'], ['extra', 'A garnish that has absolutely no practical purpose.']]),
		q('long-week', 'After a very long week, your reset button is...', [['cozy', 'A blanket, an easy show, and permission to do nothing.'], ['rainy-day', 'A quiet walk followed by a book and a warm lamp.'], ['sunshine', 'Fresh air and noticing something good outside my inbox.'], ['heart', 'An honest conversation with someone who gets it.']]),
		q('mystery-button', 'A harmless display has a button labeled "Try me." You...', [['fixer', 'Look at how the mechanism works before pressing it.'], ['prepared', 'Read the instructions and check what happens next.'], ['wildcard', 'Press it. That is clearly why it exists.'], ['midnight', 'Save it for when nobody else is around to interrupt.']]),
		q('day-in-a-new-city', 'You get a whole day in a city you have never visited. You...', [['side-quest', 'Wander toward whatever looks interesting.'], ['party', 'Find something happening that I can join.'], ['momentum', 'Pick a first stop and get out the door.'], ['aesthetic', 'Find the prettiest cafe and the nicest street to sit on.']]),
		q('bag-essentials', 'One item from your everyday bag says the most about you.', [['prepared', 'The spare charger that has saved six different people.'], ['foodie', 'The snack I picked because a good snack matters.'], ['aesthetic', 'The unnecessarily beautiful notebook.'], ['side-quest', 'A receipt from somewhere I never intended to visit.']]),
		q('new-group', 'You join a group where you do not know anyone. You...', [['host', 'Find a way to make another newcomer feel comfortable.'], ['heart', 'Listen first and notice who might feel a bit left out.'], ['overthinker', 'Prepare three possible conversation openings.'], ['main-character', 'Walk in like this was always part of my story.']]),
		q('creative-block', 'You want to make something, but inspiration is missing. You...', [['artsy', 'Start with a color and make a mess without a plan.'], ['tinkerer', 'Build a deliberately silly version to see what happens.'], ['midnight', 'Wait for the hour when my brain actually clocks in.'], ['daydreamer', 'Imagine the finished thing in spectacular detail.']]),
		q('app-update', 'Your favorite app gets a completely new layout. You...', [['fixer', 'Work out where the useful settings moved.'], ['spreadsheet', 'Compare the new features against the old workflow.'], ['detective', 'Investigate the one mysterious icon with no label.'], ['wildcard', 'Tap around until I discover something unexpected.']]),
		q('friday-night', 'Pick your extremely specific perfect Friday night.', [['cozy', 'Clean sheets, comfortable clothes, nothing in the calendar.'], ['rainy-day', 'A bookshop, a quiet drink, and a little drizzle.'], ['party', 'A casual plan that somehow ends with karaoke.'], ['extra', 'Getting properly dressed up for a wildly ordinary dinner.']]),
		q('good-news', 'A friend shares a small piece of good news. You...', [['hype', 'React like they have just won a major international award.'], ['pen-pal', 'Send something that references how long they have wanted this.'], ['sunshine', 'Tell them how genuinely nice it is to see this work out.'], ['momentum', 'Ask what the first exciting next step is.']]),
		q('one-errand', 'You leave home to do one simple errand. What happens?', [['momentum', 'It is done quickly. I might do two more while I am out.'], ['prepared', 'I bring the list, the bag, and the return item I nearly forgot.'], ['side-quest', 'I discover a new shop and come back with a story.'], ['daydreamer', 'I spend the walk imagining a completely different life.']]),
		q('walk-playlist', 'What does your walking playlist do for you?', [['main-character', 'Turns the sidewalk into my personal opening credits.'], ['midnight', 'Keeps me company when the streets get quiet.'], ['artsy', 'Gives me ideas for things I want to make.'], ['heart', 'Reminds me of people and moments I care about.']]),
		q('flat-pack', 'A flat-pack shelf and several mysterious screws await. You...', [['fixer', 'Sort the parts and follow the instructions.'], ['tinkerer', 'Wonder if the shelf could also be something else.'], ['spreadsheet', 'Create a very clear inventory of the pieces.'], ['overthinker', 'Study the diagram as if it contains a trick question.']]),
		q('hotel-room', 'You open the door to a hotel room. First thing you notice?', [['cozy', 'The bed. I will be investigating immediately.'], ['rainy-day', 'The window and the view from the quietest chair.'], ['foodie', 'The menu for the place downstairs.'], ['aesthetic', 'Whether the lighting has any intention of being flattering.']]),
		q('found-note', 'A book from the library contains a handwritten note. You...', [['detective', 'Try to work out the very low-stakes mystery behind it.'], ['pen-pal', 'Think about how lovely it is to leave a message for somebody.'], ['sunshine', 'Take it as an unexpectedly nice moment in the day.'], ['wildcard', 'Let it decide where I go for the afternoon.']]),
		q('ordinary-tuesday', 'How would you improve an ordinary Tuesday evening?', [['host', 'Invite a couple of people over for something easy.'], ['party', 'Give it a theme and a game nobody asked for.'], ['hype', 'Celebrate one thing somebody finally finished.'], ['extra', 'Put tiny decorations on the very regular dinner.']]),
		q('morning-alarm', 'Your alarm goes off. Your first coherent thought is...', [['midnight', 'That was extremely inconsiderate of the morning.'], ['cozy', 'This blanket and I are not finished with our meeting.'], ['momentum', 'Shoes on. I will wake up on the way.'], ['prepared', 'Good thing I set everything out last night.']]),
		q('conference-break', 'You have a break at a conference. You are...', [['main-character', 'Practicing the excellent question I want to ask on the mic.'], ['host', 'Including someone who is standing on their own.'], ['detective', 'Finding the booth with the most intriguing demo.'], ['pen-pal', 'Sending a friend a talk that reminded me of them.']]),
		q('new-notebook', 'A completely blank notebook is basically...', [['artsy', 'A collection of future sketches and interesting shapes.'], ['daydreamer', 'A doorway into several imaginary projects.'], ['spreadsheet', 'An opportunity for a deeply satisfying indexing system.'], ['aesthetic', 'An object so beautiful I may need a second one to write in.']]),
		q('potluck', 'You are going to a potluck. You bring...', [['foodie', 'Something delicious that I have wanted an excuse to make.'], ['extra', 'A dish with a tiny handwritten sign and a dramatic garnish.'], ['heart', 'The thing I know a particular friend has been missing.'], ['tinkerer', 'An experimental recipe with a very honest explanation.']]),
		q('weather-shift', 'The weather changes halfway through your day out. You...', [['rainy-day', 'Find a quiet indoor spot and enjoy the new atmosphere.'], ['sunshine', 'Look for the unexpectedly good part of the change.'], ['side-quest', 'Use it as an excuse to visit somewhere completely different.'], ['wildcard', 'Commit to the new direction with unreasonable enthusiasm.']]),
		q('group-panic', 'The group is panicking about a small planning problem. You...', [['fixer', 'Find the one thing we can actually solve right now.'], ['overthinker', 'List every possible consequence, just in case.'], ['party', 'Suggest we turn the problem into a ridiculous mini-game.'], ['hype', 'Remind everyone that we have handled weirder things than this.']]),
		q('desk-space', 'Your ideal desk has room for...', [['aesthetic', 'A good lamp and exactly the right little objects.'], ['spreadsheet', 'A clearly labeled system that makes sense to me.'], ['tinkerer', 'Three works in progress and a tool I might need.'], ['cozy', 'A comfortable drink and nothing that can surprise me.']]),
		q('odd-sound', 'Your building has a new, harmless but unexplained sound. You...', [['detective', 'Become casually committed to figuring out what it is.'], ['prepared', 'Check the building noticeboard for a sensible explanation.'], ['overthinker', 'Develop a surprisingly detailed list of possibilities.'], ['midnight', 'Notice it at 2 a.m., when the world finally gets quiet.']]),
		q('thoughtful-gift', 'What makes a gift feel like your kind of gift?', [['heart', 'It quietly shows that I understood what they needed.'], ['artsy', 'I made it myself and added a personal little detail.'], ['foodie', 'We can share it over a really good meal.'], ['extra', 'The wrapping has its own personality and probably a ribbon.']]),
		q('invitation-style', 'How do you invite people to hang out?', [['host', 'Make it easy, comfortable, and clear that everybody is welcome.'], ['party', 'Pitch a fun idea and promise excellent music.'], ['main-character', 'Make it sound like the beginning of a great story.'], ['pen-pal', 'Send a personal message with a reference only they will get.']]),
		q('power-cut', 'The power goes out for a little while. You...', [['fixer', 'Check what happened and whether there is anything to do.'], ['sunshine', 'Enjoy the unexpected excuse for a screen break.'], ['rainy-day', 'Light a candle and lean into the atmosphere.'], ['hype', 'Announce that we are going to make this a surprisingly good time.']]),
		q('wrong-floor', 'The elevator opens on the wrong floor. You...', [['side-quest', 'Take a quick look. Maybe something interesting is here.'], ['daydreamer', 'Imagine this as the opening of a very elaborate story.'], ['momentum', 'Find the stairs and keep going.'], ['wildcard', 'Consider it a free preview of a different day.']]),
		q('game-night', 'At game night, you are the person who...', [['detective', 'Pays attention to the tiny clues everyone dismisses.'], ['spreadsheet', 'Understands the scoring system before round one.'], ['party', 'Insists the funniest round needs an encore.'], ['overthinker', 'Considers whether an innocent move is secretly strategic.']]),
		q('souvenir', 'You bring home a souvenir. It is...', [['artsy', 'Something handmade with an interesting texture.'], ['aesthetic', 'A beautiful little object that fits my space perfectly.'], ['pen-pal', 'Something that immediately made me think of a friend.'], ['side-quest', 'An odd item from the stop that was not on the itinerary.']]),
		q('best-compliment', 'Which compliment would make your whole day?', [['heart', '"I felt really comfortable talking to you."'], ['fixer', '"You made that so much easier."'], ['hype', '"You made me feel like I could actually do it."'], ['sunshine', '"You always notice something good."']]),
		q('two-am-idea', 'A brilliant idea arrives at 2 a.m. You...', [['midnight', 'Accept that my actual working hours have begun.'], ['tinkerer', 'Start building a tiny version immediately.'], ['daydreamer', 'Imagine its entire future before writing down the first sentence.'], ['momentum', 'Write the first step and do it before the idea escapes.']]),
		q('theme-night', 'Your friends suggest a themed dinner. Your contribution?', [['main-character', 'A dramatic outfit with a carefully considered entrance.'], ['extra', 'Decorations, accessories, and a commitment to the bit.'], ['prepared', 'A clear plan so nobody has to guess what to bring.'], ['wildcard', 'A completely unexpected interpretation of the theme.']]),
		q('personal-retreat', 'Design a one-day personal retreat.', [['cozy', 'Soft clothes, a sofa, and an extremely short agenda.'], ['rainy-day', 'A quiet bookshop and a long afternoon by the window.'], ['foodie', 'A tour of several excellent places to eat.'], ['host', 'A small group in a comfortable place with no pressure.']]),
		q('browser-tabs', 'Your browser currently has a suspicious number of tabs. Why?', [['overthinker', 'I am comparing options and may need all of them.'], ['detective', 'One little question led to a surprisingly interesting investigation.'], ['midnight', 'These are from last night. I will get back to them tonight.'], ['daydreamer', 'They are windows into several possible future lives.']]),
		q('picnic', 'You are organizing a picnic. Your most important contribution?', [['host', 'Making it easy for everyone to join and feel comfortable.'], ['prepared', 'The blanket, napkins, weather check, and backup spot.'], ['sunshine', 'Finding a lovely place and getting people excited about being outside.'], ['foodie', 'A food lineup that takes a regular picnic very seriously.']]),
		q('quick-favor', 'A friend asks for a quick favor. You...', [['heart', 'Check what they actually need, not just what they asked for.'], ['fixer', 'Work out the simplest way to help.'], ['momentum', 'Do the first step before the conversation ends.'], ['pen-pal', 'Remember the context and send the exact useful thing.']]),
		q('mystery-shop', 'A shop has opened with a name you cannot explain. You...', [['side-quest', 'Go in. This is exactly the kind of detour I like.'], ['artsy', 'Notice the lettering and the interesting window display.'], ['tinkerer', 'Wonder how the unusual thing in the window works.'], ['wildcard', 'Try whatever the person behind the counter recommends.']]),
		q('profile-picture', 'You need a new profile picture. Your approach?', [['main-character', 'Choose the one with strong cover-art energy.'], ['aesthetic', 'Find the best light and a very intentional background.'], ['extra', 'Add an accessory that deserves to be in the picture.'], ['hype', 'Ask a friend, then remind them theirs is also incredible.']]),
		q('playlist-duty', 'You have been put in charge of the playlist. You...', [['party', 'Build toward the moment everyone sings badly together.'], ['spreadsheet', 'Arrange a smooth sequence with no awkward energy drops.'], ['rainy-day', 'Choose songs that make the evening feel quietly cinematic.'], ['cozy', 'Keep it comfortable enough that nobody has to shout.']]),
		q('tiny-superpower', 'Pick an extremely low-stakes superpower.', [['daydreamer', 'Turn waiting rooms into vivid imaginary adventures.'], ['fixer', 'Know which cable, button, or setting solves the problem.'], ['heart', 'Always know when somebody could use a gentle check-in.'], ['side-quest', 'Find the most interesting place within a ten-minute walk.']]),
		q('vacation-arrival', 'You arrive on vacation. Your first priority?', [['prepared', 'Get settled and confirm the few important practical details.'], ['aesthetic', 'Find the beautiful spot I have been saving for months.'], ['foodie', 'Eat the thing this place does especially well.'], ['cozy', 'Test the bed. For quality assurance.']]),
		q('group-project', 'In a group project, you naturally take charge of...', [['spreadsheet', 'Making the plan understandable and keeping track of the details.'], ['tinkerer', 'Trying out the strange idea that might actually work.'], ['hype', 'Keeping people excited when the first attempt gets messy.'], ['host', 'Making sure everybody has a role and feels included.']]),
		q('next-chapter', 'You are ready for a new chapter. What starts it?', [['midnight', 'A late-night realization and a very good playlist.'], ['artsy', 'Making something small that feels like a fresh beginning.'], ['sunshine', 'Noticing that the next thing might actually be good.'], ['overthinker', 'A careful review of every possible version of the next thing.']]),
		q('memoir-title', 'Choose the title of your deeply unserious memoir.', [['main-character', '"This Was Clearly My Entrance."'], ['detective', '"Wait, That Detail Is Important."'], ['pen-pal', '"Saw This and Thought of You."'], ['rainy-day', '"A Window, a Book, and Several Thoughts."']]),
		q('blank-calendar', 'Your calendar has a completely blank week. You...', [['momentum', 'Finally turn one of my ideas into an actual first step.'], ['wildcard', 'Keep it open. Something wonderfully odd might happen.'], ['party', 'Find a few reasons to get people together.'], ['extra', 'Give the whole week an unnecessary but excellent theme.']])
	];
	const quizLength = 6;

	function shuffle(items, random) {
		const result = [...items];
		for (let index = result.length - 1; index > 0; index--) {
			const swap = Math.floor(random() * (index + 1));
			[result[index], result[swap]] = [result[swap], result[index]];
		}
		return result;
	}

	function createQuiz(previousQuestionIds = [], random = Math.random) {
		const previous = new Set(previousQuestionIds);
		const pool = questions.filter(question => !previous.has(question.id));
		if (pool.length < quizLength) {
			throw new RangeError('Not enough fresh questions for another quiz.');
		}
		return shuffle(pool, random).slice(0, quizLength).map(question => ({
			...question, options: shuffle(question.options, random)
		}));
	}

	function determinePersonality(quiz, answers) {
		if (!Array.isArray(quiz) || quiz.length !== quizLength ||
			new Set(quiz.map(question => question.id)).size !== quizLength ||
			!Array.isArray(answers) || answers.length !== quizLength) {
			throw new TypeError('Complete one quiz before revealing your Blobby.');
		}
		const choices = Array.from(answers, (answer, index) => quiz[index].options.find(option => option.id === answer));
		if (choices.some(choice => !choice)) {
			throw new TypeError('Choose a valid answer for every question before revealing your Blobby.');
		}
		const votes = new Map(personalities.map(item => [item.id, 0]));
		const familyVotes = new Map();
		for (const choice of choices) {
			const selected = personalities.find(item => item.id === choice.personalityId);
			if (!selected) {
				throw new TypeError('The selected answer has no matching Blobby personality.');
			}
			votes.set(selected.id, votes.get(selected.id) + 1);
			familyVotes.set(selected.family, (familyVotes.get(selected.family) || 0) + 1);
		}
		const scores = personalities.map(item => (familyVotes.get(item.family) || 0) * 3 + votes.get(item.id) * 2);
		const highest = Math.max(...scores);
		const tied = new Set(personalities.filter((item, index) => scores[index] === highest).map(item => item.id));
		// First supporting answer breaks a tie; revisiting a result never rerolls it.
		const winner = choices.find(choice => tied.has(choice.personalityId));
		return personalities.find(item => item.id === winner.personalityId);
	}

	return { personalities, families, questions, quizLength, createQuiz, determinePersonality };
})();

if (typeof module !== 'undefined') {
	module.exports = BlobbyQuiz;
}
