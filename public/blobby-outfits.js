'use strict';

const BlobbyOutfits = {
	cozy: { color: 'lilac', hat: 'wizard-hat', prop: 'pillow', style: 'Lilac / starry cap', description: 'Lilac Blobby in a starry cap, holding a pillow under a crescent moon.' },
	midnight: { color: 'azure', hat: 'baseball-cap', prop: 'coffee', style: 'Azure / midnight cap', description: 'Azure Blobby in a baseball cap, holding a warm mug with little wisps of steam.' },
	sunshine: { color: 'honey', hat: 'straw-hat', prop: 'solar', style: 'Honey gold / sun hat', description: 'Honey-gold Blobby in a sun hat, holding a solar panel beside a bright sun.' },
	'rainy-day': { color: 'lilac', hat: 'sailor-hat', prop: 'book', style: 'Lilac / quiet-day cap', description: 'Lilac Blobby in a sailor cap, reading an open book.' },
	spreadsheet: { color: 'azure', hat: 'grand-top-hat-monocle', prop: 'ledger', style: 'Azure / top hat and monocle', description: 'Azure Blobby in a top hat and monocle, holding a neatly organized ledger and golden coins.' },
	prepared: { color: 'honey', hat: 'sailor-hat', prop: 'umbrella', style: 'Honey gold / all-weather cap', description: 'Honey-gold Blobby in a sailor cap, carrying a pink umbrella beneath a rainy cloud.' },
	fixer: { color: 'mint', hat: 'construction-hard-hat', prop: 'wrench', style: 'Mint / hard hat', description: 'Mint Blobby in a hard hat, holding a wrench beside a tiny keyboard.' },
	overthinker: { color: 'honey', hat: 'dark-sailor-hat', prop: 'notes', style: 'Honey gold / thinking cap', description: 'Honey-gold Blobby in a navy cap, holding colorful notes beneath a question mark.' },
	artsy: { color: 'lilac', hat: 'artist-beret', prop: 'palette', style: 'Lilac / artist beret', description: 'Lilac Blobby in an artist beret, holding a paint palette and a paintbrush.' },
	aesthetic: { color: 'peach', hat: 'artist-beret', prop: 'roller', style: 'Peach / designer beret', description: 'Peach Blobby in a beret, matching paint swatches with a tiny roller.' },
	tinkerer: { color: 'mint', hat: 'propeller-hat', prop: 'robot', style: 'Mint / propeller cap', description: 'Mint Blobby in a propeller cap, testing a colorful little robot.' },
	daydreamer: { color: 'lilac', hat: 'wizard-hat', prop: 'cloud', style: 'Lilac / daydream hat', description: 'Lilac Blobby in a wizard hat, holding a fluffy cloud beneath golden stars.' },
	'main-character': { color: 'rose', hat: 'grand-top-hat-monocle', prop: 'spotlight', style: 'Rose / dramatic top hat', description: 'Rose Blobby in a top hat and monocle, holding a microphone beside a golden spotlight star.' },
	hype: { color: 'peach', hat: 'grand-top-hat-monocle', prop: 'megaphone', style: 'Peach / celebration top hat', description: 'Peach Blobby in a top hat, cheering through a megaphone.' },
	party: { color: 'rose', hat: 'pink-party-hat', prop: 'party', style: 'Rose / party hat', description: 'Rose Blobby in a party hat, celebrating beneath bunting with a confetti popper.' },
	extra: { color: 'honey', hat: 'crown', prop: 'sparkles', style: 'Honey gold / statement crown', description: 'Honey-gold Blobby in a crown, holding a golden trophy surrounded by sparkles.' },
	host: { color: 'honey', hat: 'crown', prop: 'flowers', style: 'Honey gold / welcome crown', description: 'Honey-gold Blobby in a crown, offering a bright bouquet of flowers.' },
	'pen-pal': { color: 'lilac', hat: 'grand-top-hat-monocle', prop: 'letter', style: 'Lilac / thoughtful top hat', description: 'Lilac Blobby in a top hat and monocle, delivering a heart-sealed letter.' },
	heart: { color: 'peach', hat: 'crown', prop: 'heart', style: 'Peach / little crown', description: 'Peach Blobby in a little crown, hugging a heart-shaped cushion.' },
	foodie: { color: 'honey', hat: 'white-chef-hat', prop: 'cupcake', style: 'Honey gold / chef hat', description: 'Honey-gold Blobby in a chef hat, presenting a freshly frosted cupcake.' },
	'side-quest': { color: 'mint', hat: 'cowboy-hat', prop: 'compass', style: 'Mint / adventure hat', description: 'Mint Blobby in an explorer hat, carrying a trail map and a compass.' },
	detective: { color: 'azure', hat: 'dark-sailor-hat', prop: 'binoculars', style: 'Azure / lookout cap', description: 'Azure Blobby in a navy cap, peering through binoculars at a little window.' },
	momentum: { color: 'azure', hat: 'baseball-cap', prop: 'trolley', style: 'Azure / get-going cap', description: 'Azure Blobby in a baseball cap, steering a trolley stacked with parcels.' },
	wildcard: { color: 'mint', hat: 'sailor-hat', prop: 'boots', style: 'Mint / plot-twist cap', description: 'Mint Blobby in a sailor cap and yellow rain boots, splashing in a blue puddle.' }
};

if (typeof module !== 'undefined') {
	module.exports = BlobbyOutfits;
}
