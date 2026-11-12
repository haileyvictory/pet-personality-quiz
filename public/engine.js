/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const PetCareers = (() => {
	const career = (id, category, title, department, symbol, traits, offer) => ({ id, category, title, department, symbol, traits, offer });
	const careers = [
		career('cardboard', 'cozy', 'Chief Cardboard Officer', 'Strategic box pawperations', '📦',
			['Thinks outside the box. Sleeps inside it.', 'Turns packaging into prime real estate', 'Has a very impressive pawrtfolio'], 'A corner office. Made of cardboard.'),
		career('naps', 'cozy', 'Director of Napplications', 'Rest and development', '💤',
			['Brings a sleep-first mindset', 'Can snooze through any all-paws meeting', 'Dreams big. Then dreams a little more.'], 'Flexible hours. Mostly horizontal.'),
		career('forts', 'cozy', 'Blanket Fort Architect', 'Cozy infrastructure', '🏰',
			['Builds load-bearing pillow arrangements', 'Specializes in open-plan blanket living', 'Always includes an emergency snooze exit'], 'Full creative control of the duvet district.'),
		career('sunbeams', 'cozy', 'Sunbeam Sustainability Consultant', 'Renewable purr-energy', '☀️',
			['Runs entirely on warm patches', 'Tracks the sun with alarming accuracy', 'Has a pawsitive energy policy'], 'Solar-powered benefits. A heated seat.'),
		career('snacks', 'snacks', 'Senior Snack Inspector', 'Biscuit quality ass-paw-rance', '🍪',
			['Hears a wrapper three rooms away', 'Never skips a quality-control sample', 'Has a very strong lunch-based work ethic'], 'Competitive biscuits. Unlimited taste tests.'),
		career('treats', 'snacks', 'Treat Treasury Auditor', 'Financial ac-counting', '🧮',
			['Knows exactly how many treats are missing', 'Always finds room in the snack budget', 'Will work for a very small signing bonus'], 'A pension paid entirely in little crunchies.'),
		career('crumbs', 'snacks', 'Head of Crumb Recovery', 'Floor-to-table logistics', '🥐',
			['Finds value where others see crumbs', 'Responds instantly to dropped opportunities', 'Leaves no biscuit behind'], 'First refusal on everything under the table.'),
		career('chef', 'snacks', 'Executive Pawtisserie Chef', 'Bakes and recreation', '🧁',
			['Kneads absolutely no introduction', 'Produces award-winning imaginary biscuits', 'Adds a little extra fluff to every recipe'], 'A chef hat. A spoon-licking allowance.'),
		career('surveillance', 'curious', 'Director of Neighborhood Surveillance', 'Window-based intelligence', '🔭',
			['Knows the delivery schedule by heart', 'Investigates every suspicious leaf', 'Has never once trusted a squirrel'], 'A window seat. A very important badge.'),
		career('squirrels', 'curious', 'Senior Squirrel Intelligence Analyst', 'Nutwork security', '🐿️',
			['Maintains several branches of intelligence', 'Sees a conspiracy in every acorn', 'Keeps the neighborhood under pawservation'], 'Binoculars and a classified acorn dossier.'),
		career('doorbell', 'curious', 'Chief Doorbell Investigator', 'Knock-knock incident response', '🔔',
			['Treats every ding as breaking news', 'Will not rest until the visitor is identified', 'Runs a very loud alerting system'], 'A badge, a bell, and unlimited hallway access.'),
		career('weather', 'curious', 'Window-Watching Meteorologist', 'The fur-cast desk', '🌦️',
			['Predicts rain by refusing to go outside', 'Keeps a close eye on flying leaves', 'Reports a high chance of couch'], 'A panoramic window and fair-weather Fridays.'),
		career('artist', 'creative', 'Principal Pawtrait Artist', 'Fine arts and muddy surfaces', '🎨',
			['Expresses feelings through unexpected footprints', 'Believes every white rug is a blank canvas', 'Has a distinctive pawstmodern style'], 'An unlimited supply of washable masterpieces.'),
		career('decorator', 'creative', 'Senior Interior Redecorator', 'Furnishings and unfurnishings', '🛋️',
			['Challenges the traditional location of cushions', 'Has a bold fringe-removal aesthetic', 'Thinks the rug could use more personality'], 'Complete artistic freedom. Supervised access to cushions.'),
		career('toys', 'creative', 'Lead Squeak Experience Designer', 'User ex-paw-rience', '🧸',
			['Finds the squeaker in every problem', 'Tests every prototype to destruction', 'Believes good design should make some noise'], 'A lab full of squeaky stakeholders.'),
		career('marketing', 'creative', 'Director of Barketing', 'Brand paw-sitioning', '📣',
			['Makes every announcement a little louder', 'Gets eyes on the product by sitting on it', 'Has outstanding organic tail reach'], 'Your own campaign. Very few spelling requirements.'),
		career('greetings', 'social', 'Chief Greeting Officer', 'First im-purr-essions', '🌷',
			['Makes every arrival feel like a premiere', 'Remembers everyone by their shoes', 'Considers personal space a negotiable concept'], 'A reception desk and unlimited hello privileges.'),
		career('relations', 'social', 'Public Pawlations Manager', 'Stakeholder snugglement', '💌',
			['Turns strangers into friends immediately', 'Resolves disputes with tactical cuteness', 'Has excellent sit-uational awareness'], 'A contact list full of excellent people.'),
		career('events', 'social', 'Zoomies Event Coordinator', 'Pawty planning', '🎉',
			['Turns a quiet evening into an occasion', 'Schedules surprise all-hands zoomies', 'Never lets the energy drop below ridiculous'], 'A confetti budget and a flexible bedtime.'),
		career('support', 'social', 'Emotional Support Supervisor', 'People and purrformance', '💗',
			['Knows when someone needs a soft colleague', 'Excels at quiet, reassuring presence', 'Makes every difficult day more bearable'], 'Unlimited cuddle breaks. No performance reviews.'),
		career('logistics', 'adventure', 'Head of Zoomies Logistics', 'Rapid trans-paw-tation', '🚀',
			['Plans routes nobody else can understand', 'Achieves remarkable sofa-to-hallway throughput', 'Always delivers at full wiggle'], 'A clear runway and a well-earned water break.'),
		career('sniffari', 'adventure', 'Expedition Sniffari Guide', 'Exploration and re-scent-search', '🧭',
			['Reads the world one smell at a time', 'Finds adventure in the same old sidewalk', 'Never rushes a thorough sniff-vestigation'], 'New trails. Extremely generous sniffing leave.'),
		career('fetch', 'adventure', 'Fetch Systems Engineer', 'Ballistic retrieval services', '🎾',
			['Works in a very reliable fetch-and-return loop', 'Debugs problems by bringing them to you', 'Considers every throw an exciting new ticket'], 'A ball-based bonus and no sprint retrospectives.'),
		career('puddles', 'adventure', 'Senior Puddle Inspector', 'Splash risk assessment', '🫧',
			['Tests every puddle with the whole team', 'Has a splash-first discovery process', 'Brings fresh mud to old problems'], 'Waterproof benefits. Towels included.')
	];
	const species = [
		{ id: 'blobby', label: 'Blobby', defaultName: 'Blobby', symbol: '💙', pun: 'Tiny morale officer' },
		{ id: 'cat', label: 'Cat', defaultName: 'Kitty', symbol: '🐱', pun: 'Purr-fessional' },
		{ id: 'dog', label: 'Dog', defaultName: 'Rover', symbol: '🐶', pun: 'Paw-fessional' }
	];
	const q = (id, prompt, options) => ({
		id, prompt, options: options.map(([careerId, text]) => ({ id: `${id}-${careerId}`, careerId, text }))
	});
	const questions = [
		q('parcel', 'A package arrives. Your pet...', [['cardboard', 'Claims the box as a prestigious corner office.'], ['crumbs', 'Inspects the packing paper for snack debris.'], ['artist', 'Adds a few signature pawprints.'], ['events', 'Announces the unboxing pawty. Everyone must attend.']]),
		q('day-off', 'Their perfect day off involves...', [['naps', 'Being unavailable in four different sleeping locations.'], ['chef', 'Kneading a blanket like a tiny celebrity baker.'], ['decorator', 'Giving the cushions a surprising new floor plan.'], ['support', 'Keeping their favorite human company.']]),
		q('blanket', 'You leave a blanket on the floor. They...', [['forts', 'Build a headquarters. Apply for planning purrmission.'], ['surveillance', 'Use it as camouflage for neighborhood operations.'], ['toys', 'Invent a new game with a sock and great ambition.'], ['logistics', 'Launch a high-speed obstacle course.']]),
		q('morning', 'How does your pet start the morning?', [['sunbeams', 'Clocks in at the first sunny patch.'], ['squirrels', 'Checks for unauthorized acorn activity.'], ['marketing', 'Makes an announcement nobody can ignore.'], ['sniffari', 'Reads the overnight news, one smell at a time.']]),
		q('visitor', 'A visitor comes over. First order of business?', [['snacks', 'Check their snack credentials.'], ['doorbell', 'Investigate how they got past the bell.'], ['greetings', 'Welcome them like a returning astronaut.'], ['fetch', 'Hand them a ball. Onboarding begins now.']]),
		q('rain', 'It starts raining. Your pet...', [['treats', 'Negotiates an indoor treat compensation package.'], ['weather', 'Delivers a detailed fur-cast from the window.'], ['relations', 'Talks everyone into a cozy indoor gathering.'], ['puddles', 'Sees a very promising research opportunity.']]),
		q('dinner-party', 'Their role at a dinner pawty?', [['crumbs', 'Floor-level catering recovery.'], ['artist', 'Creates an avant-garde napkin installation.'], ['events', 'Makes sure the energy stays unreasonably high.'], ['cardboard', 'Manages the extremely important empty boxes.']]),
		q('work-email', 'They receive their first work email. They...', [['chef', 'Reply with a biscuit recipe.'], ['decorator', 'Rearrange the keyboard. For aesthetics.'], ['support', 'Sense your stress and offer a soft shoulder.'], ['naps', 'Set an out-of-office reply. Indefinitely.']]),
		q('mystery', 'Something moves behind the curtain. Your pet...', [['surveillance', 'Begins a discreet pawservation operation.'], ['toys', 'Turns the curtain into an interactive toy.'], ['logistics', 'Takes the fastest possible route through three rooms.'], ['forts', 'Adds the curtain to their secret hideout.']]),
		q('promotion', 'What would earn them a promotion?', [['squirrels', 'A breakthrough in squirrel intelligence.'], ['marketing', 'A campaign with unprecedented bark engagement.'], ['sniffari', 'Discovering a fascinating new smell.'], ['sunbeams', 'Keeping the sunbeam occupied all afternoon.']]),
		q('toy-ball', 'A ball rolls under the sofa. What next?', [['doorbell', 'Investigate whether the delivery person was involved.'], ['greetings', 'Recruit a new friend to help.'], ['fetch', 'Submit a highly urgent retrieval ticket.'], ['snacks', 'Check whether the ball is edible first.']]),
		q('vacation', 'Their dream vacation includes...', [['weather', 'A window with changing skies.'], ['relations', 'Meeting absolutely everybody.'], ['puddles', 'All-inclusive splash privileges.'], ['treats', 'A meticulously audited minibar.']]),
		q('business-card', 'Their business card would feature...', [['artist', 'An original pawprint. Every card is a masterpiece.'], ['events', 'An invitation to an unscheduled pawty.'], ['cardboard', 'A tiny fold-out cardboard office.'], ['crumbs', 'A tasteful crumb, for networking purposes.']]),
		q('deadline', 'A big deadline is approaching. Your pet...', [['decorator', 'Decides this is the moment to move the furniture.'], ['support', 'Sits beside you for moral suppawt.'], ['naps', 'Recommends sleeping on it. Immediately.'], ['chef', 'Offers freshly kneaded emotional support biscuits.']]),
		q('hallway', 'The hallway is suspiciously quiet. Your pet...', [['toys', 'Tests a new squeaker. Extensively.'], ['logistics', 'Starts a hallway-based speed trial.'], ['forts', 'Builds a secure pillow checkpoint.'], ['surveillance', 'Watches from a discreet observation post.']]),
		q('achievement', 'Their proudest achievement?', [['marketing', 'Getting the whole household to notice one announcement.'], ['sniffari', 'Cataloging every smell on one ordinary walk.'], ['sunbeams', 'Following the same sunbeam across three rooms.'], ['squirrels', 'Making a squirrel think twice.']]),
		q('new-colleague', 'A new colleague joins the team. Your pet...', [['greetings', 'Gives the warmest welcome in recorded history.'], ['fetch', 'Shares the standard-issue tennis ball.'], ['snacks', 'Conducts a biscuit-based interview.'], ['doorbell', 'Reviews the entry procedure. Thoroughly.']]),
		q('budget', 'They are given a tiny budget. They buy...', [['relations', 'Something nice for the whole group.'], ['puddles', 'Rain boots they absolutely will not wear.'], ['treats', 'Treats, with detailed receipts.'], ['weather', 'A premium window seat.']]),
		q('talent-show', 'Their entry in the office talent show?', [['events', 'Hosting the whole thing, with surprise encores.'], ['cardboard', 'Fitting into a box that is clearly too small.'], ['crumbs', 'Locating a crumb everyone else missed.'], ['artist', 'Painting with four feet at once.']]),
		q('bad-day', 'Someone has had a rough day. Your pet...', [['support', 'Offers quiet company. No agenda.'], ['naps', 'Demonstrates a restorative nap.'], ['chef', 'Starts kneading comfort biscuits.'], ['decorator', 'Builds a better couch situation.']]),
		q('empty-room', 'An empty room is basically...', [['logistics', 'A racetrack awaiting certification.'], ['forts', 'A future blanket-fort development.'], ['surveillance', 'An unmonitored sector. Concerning.'], ['toys', 'A blank slate for recreational squeaking.']]),
		q('garden', 'Their priority in the garden?', [['sniffari', 'Every fascinating centimeter of it.'], ['sunbeams', 'The warmest patch of afternoon light.'], ['squirrels', 'Whatever the squirrels think they are doing.'], ['marketing', 'Making a public statement about being outside.']]),
		q('uniform', 'Choose their dream work uniform.', [['fetch', 'A ball-carrying utility vest.'], ['snacks', 'A lab coat with biscuit pockets.'], ['doorbell', 'A very official investigator badge.'], ['greetings', 'A bow tie and unlimited enthusiasm.']]),
		q('meeting', 'What do they bring to an all-paws meeting?', [['puddles', 'Fresh field samples. On the carpet.'], ['treats', 'A firm position on the snack budget.'], ['weather', 'A forecast: partly cloudy, mostly couch.'], ['relations', 'A plan to make everyone feel included.']]),
		q('delivery', 'A very important delivery contains...', [['cardboard', 'A box. Contents irrelevant.'], ['crumbs', 'A trail of potentially recoverable crumbs.'], ['artist', 'New materials for a pawsterpiece.'], ['events', 'Decorations for the next surprise celebration.']]),
		q('weekend', 'Their weekend calendar says...', [['naps', 'Booked solid. All appointments are naps.'], ['chef', 'Advanced biscuit production workshop.'], ['decorator', 'Cushion placement: a radical rethinking.'], ['support', 'Quality time with my favorite human.']]),
		q('sock', 'You discover a lone sock. Your pet...', [['forts', 'Adds it to the fort insulation system.'], ['surveillance', 'Records it as evidence.'], ['toys', 'Recognizes an exciting new product prototype.'], ['logistics', 'Transports it at maximum speed.']]),
		q('alarm', 'The alarm goes off. Your pet...', [['sunbeams', 'Checks whether the sun is accepting appointments.'], ['squirrels', 'Assumes the squirrels are responsible.'], ['marketing', 'Adds their own announcement to the mix.'], ['sniffari', 'Starts preparing for a morning sniffari.']]),
		q('doorstep', 'There is a mysterious bag at the door.', [['snacks', 'This calls for a taste-based investigation.'], ['doorbell', 'Review the doorbell footage. Or just stare harder.'], ['greetings', 'Perhaps the bag would like a friendly welcome.'], ['fetch', 'Deliver it directly to the nearest human.']]),
		q('forecast', 'The forecast says storms. Their response?', [['treats', 'We will require emergency snack reserves.'], ['weather', 'I have been reporting this for hours.'], ['relations', 'Let us get everyone somewhere comfortable.'], ['puddles', 'Finally. The fieldwork grant came through.']]),
		q('restaurant', 'They open a restaurant. The specialty?', [['crumbs', 'Tasting menus served below table height.'], ['artist', 'Beautiful plating with decorative pawprints.'], ['events', 'Dinner, dancing, and surprise zoomies.'], ['cardboard', 'Private dining in exceptionally good boxes.']]),
		q('password', 'Their password would probably be...', [['chef', 'something involving biscuits and more biscuits'], ['decorator', 'cushions_belong_on_the_floor'], ['support', 'you_are_doing_great'], ['naps', 'do_not_disturb_zzzzz']]),
		q('office', 'They get to design the office. What comes first?', [['surveillance', 'An observation window with excellent coverage.'], ['toys', 'A rigorous squeaker-testing facility.'], ['logistics', 'A completely unnecessary indoor racetrack.'], ['forts', 'A network of interconnected blanket offices.']]),
		q('newsletter', 'What is in their neighborhood newsletter?', [['squirrels', 'A strongly worded acorn activity report.'], ['marketing', 'A big announcement about themselves.'], ['sniffari', 'A guide to the ten best local smells.'], ['sunbeams', 'The weekly sunbeam availability forecast.']]),
		q('team-project', 'Their contribution to a team project?', [['doorbell', 'Securing the perimeter against unexpected visitors.'], ['greetings', 'Making sure everyone feels welcome.'], ['fetch', 'Bringing back anything the team throws at them.'], ['snacks', 'Ensuring the snacks meet strict quality standards.']]),
		q('commute', 'Their ideal commute is...', [['weather', 'Bed to window. Subject to weather conditions.'], ['relations', 'A chance to greet every living thing.'], ['puddles', 'The route with the most splashing potential.'], ['treats', 'Short enough to preserve the breakfast budget.']]),
		q('award', 'What award would they win?', [['artist', 'Most Expressive Use of Mud.'], ['events', 'Best Unscheduled Celebration.'], ['cardboard', 'Outstanding Achievement in Box Occupancy.'], ['crumbs', 'Lifetime Services to Fallen Toast.']]),
		q('team-retreat', 'Their suggestion for the team retreat?', [['decorator', 'A hands-on cushion demolition workshop.'], ['support', 'A comfortable circle of kind people.'], ['naps', 'An offsite. With beds. And no agenda.'], ['chef', 'A pawtisserie masterclass.']]),
		q('innovation', 'Their latest invention is...', [['toys', 'A toy with fourteen independent squeakers.'], ['logistics', 'A faster route from the sofa to nowhere.'], ['forts', 'A two-story duvet headquarters.'], ['surveillance', 'A curtain gap with perfect visibility.']]),
		q('noticeboard', 'What have they pinned to the noticeboard?', [['marketing', 'A very flattering poster of themselves.'], ['sniffari', 'A map annotated entirely with smells.'], ['sunbeams', 'Do Not Move This Chair: Solar Operations.'], ['squirrels', 'Wanted: squirrel. Extremely suspicious.']]),
		q('work-perk', 'Their most important work perk?', [['greetings', 'Unlimited guest-welcoming privileges.'], ['fetch', 'A personal equipment budget. All balls.'], ['snacks', 'Access to the test kitchen.'], ['doorbell', 'Their own official ringing device.']]),
		q('problem-solving', 'How do they solve a tricky problem?', [['relations', 'Get everyone together and be charming.'], ['puddles', 'Jump in and see what happens.'], ['treats', 'Demand to see the treat-related numbers.'], ['weather', 'Watch carefully from somewhere dry.']]),
		q('art-gallery', 'They visit an art gallery. They...', [['events', 'Assume it is a launch pawty.'], ['cardboard', 'Admire the shipping crates.'], ['crumbs', 'Locate the opening-night refreshments. At floor level.'], ['artist', 'Consider adding their own work to the collection.']]),
		q('human-late', 'You are home late. Your pet...', [['support', 'Is just happy you are back.'], ['naps', 'Has barely noticed. The nap was excellent.'], ['chef', 'Has been kneading a blanket in anticipation.'], ['decorator', 'Has made some bold design decisions.']]),
		q('superpower', 'Their superpower would be...', [['logistics', 'Instant sofa-to-sofa teleportation.'], ['forts', 'Summoning the perfect cozy hideout.'], ['surveillance', 'Seeing through every curtain at once.'], ['toys', 'Making anything squeak on command.']]),
		q('memoir', 'The title of their memoir?', [['sniffari', 'Eat, Sniff, Love.'], ['sunbeams', 'Here Comes the Sunbeam.'], ['squirrels', 'The Squirrels Know What They Did.'], ['marketing', 'Me: An Unauthorized Barkography.']]),
		q('emergency', 'The office declares a tiny emergency.', [['fetch', 'Bring the emergency ball. Obviously.'], ['snacks', 'Check the biscuit quality immediately.'], ['doorbell', 'Secure all doors. Investigate every ding.'], ['greetings', 'Welcome the emergency response team enthusiastically.']]),
		q('five-year-plan', 'Their ambitious five-year plan?', [['puddles', 'A larger puddle. Perhaps with a splash annex.'], ['treats', 'A diversified portfolio of snack assets.'], ['weather', 'An even better window.'], ['relations', 'Become friends with absolutely everyone.']])
	];
	const interviewLength = 6;

	function shuffle(items, random) {
		const result = [...items];
		for (let index = result.length - 1; index > 0; index--) {
			const swap = Math.floor(random() * (index + 1));
			[result[index], result[swap]] = [result[swap], result[index]];
		}
		return result;
	}

	function createInterview(previousQuestionIds = [], random = Math.random) {
		const previous = new Set(previousQuestionIds);
		const pool = questions.filter(question => !previous.has(question.id));
		if (pool.length < interviewLength) {
			throw new RangeError('Not enough fresh questions for another interview.');
		}
		return shuffle(pool, random).slice(0, interviewLength).map(question => ({
			...question, options: shuffle(question.options, random)
		}));
	}

	function determineCareer(interview, answers) {
		if (!Array.isArray(interview) || interview.length !== interviewLength ||
			new Set(interview.map(question => question.id)).size !== interviewLength ||
			!Array.isArray(answers) || answers.length !== interviewLength) {
			throw new TypeError('Complete one interview before revealing a career.');
		}
		const choices = Array.from(answers, (answer, index) => interview[index].options.find(option => option.id === answer));
		if (choices.some(choice => !choice)) {
			throw new TypeError('Choose a valid answer for every question before revealing a career.');
		}
		const votes = new Map(careers.map(item => [item.id, 0]));
		const categories = new Map();
		for (const choice of choices) {
			const selected = careers.find(item => item.id === choice.careerId);
			if (!selected) {
				throw new TypeError('The selected answer has no matching career.');
			}
			votes.set(selected.id, votes.get(selected.id) + 1);
			categories.set(selected.category, (categories.get(selected.category) || 0) + 1);
		}
		const scores = careers.map(item => (categories.get(item.category) || 0) * 3 + votes.get(item.id) * 2);
		const highest = Math.max(...scores);
		const tied = new Set(careers.filter((item, index) => scores[index] === highest).map(item => item.id));
		// First supporting answer breaks a tie; reviewing a result never rerolls it.
		const winner = choices.find(choice => tied.has(choice.careerId));
		return careers.find(item => item.id === winner.careerId);
	}

	return { careers, species, questions, interviewLength, createInterview, determineCareer };
})();

if (typeof module !== 'undefined') {
	module.exports = PetCareers;
}
