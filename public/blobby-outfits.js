'use strict';

const BlobbyOutfits = {
	cardboard: { color: 'azure', hat: 'grand-top-hat-monocle', prop: 'box', description: 'Azure Blobby in a top hat and monocle, tucked into a tiny cardboard office.' },
	naps: { color: 'lilac', hat: 'wizard-hat', prop: 'pillow', description: 'Lilac Blobby in a starry sleeping cap, holding a pillow under a crescent moon.' },
	forts: { color: 'mint', hat: 'construction-hard-hat', prop: 'blueprint', description: 'Mint Blobby in a hard hat, building a blanket fort from a little blueprint.' },
	sunbeams: { color: 'honey', hat: 'straw-hat', prop: 'solar', description: 'Honey-gold Blobby in a sun hat, tending a solar panel in the sunshine.' },
	snacks: { color: 'peach', hat: 'white-chef-hat', prop: 'cookie', description: 'Peach Blobby in a chef hat, inspecting an oversized chocolate-chip cookie.' },
	treats: { color: 'azure', hat: 'grand-top-hat-monocle', prop: 'ledger', description: 'Azure Blobby in a top hat and monocle, auditing a treat ledger and golden coins.' },
	crumbs: { color: 'mint', hat: 'baseball-cap', prop: 'broom', description: 'Mint Blobby in a baseball cap, sweeping crumbs into a little dustpan.' },
	chef: { color: 'honey', hat: 'white-chef-hat', prop: 'cupcake', description: 'Honey-gold Blobby in a chef hat, presenting a freshly frosted cupcake.' },
	surveillance: { color: 'azure', hat: 'dark-sailor-hat', prop: 'binoculars', description: 'Azure Blobby in a navy lookout cap, peering through binoculars at a little window.' },
	squirrels: { color: 'mint', hat: 'cowboy-hat', prop: 'acorn', description: 'Mint Blobby in a field hat, examining an acorn beside a woodland case file.' },
	doorbell: { color: 'honey', hat: 'dark-sailor-hat', prop: 'bell', description: 'Honey-gold Blobby in an investigator cap, inspecting a brass doorbell with a magnifying glass.' },
	weather: { color: 'azure', hat: 'sailor-hat', prop: 'umbrella', description: 'Azure Blobby in a sailor cap, carrying an umbrella beneath a rainy cloud.' },
	artist: { color: 'lilac', hat: 'artist-beret', prop: 'palette', description: 'Lilac Blobby in an artist beret, holding a paint palette and a paintbrush.' },
	decorator: { color: 'peach', hat: 'artist-beret', prop: 'roller', description: 'Peach Blobby in a designer beret, testing paint swatches with a tiny roller.' },
	toys: { color: 'mint', hat: 'propeller-hat', prop: 'robot', description: 'Mint Blobby in a propeller cap, testing a colorful wind-up toy robot.' },
	marketing: { color: 'peach', hat: 'grand-top-hat-monocle', prop: 'megaphone', description: 'Peach Blobby in a top hat, announcing a new campaign through a megaphone.' },
	greetings: { color: 'honey', hat: 'crown', prop: 'flowers', description: 'Honey-gold Blobby in a welcome crown, offering a bright bouquet of flowers.' },
	relations: { color: 'lilac', hat: 'grand-top-hat-monocle', prop: 'letter', description: 'Lilac Blobby in a top hat and monocle, delivering a heart-sealed letter.' },
	events: { color: 'rose', hat: 'pink-party-hat', prop: 'party', description: 'Rose Blobby in a party hat, celebrating beneath bunting with a confetti popper.' },
	support: { color: 'lilac', hat: 'crown', prop: 'heart', description: 'Lilac Blobby in a little crown, hugging a heart-shaped cushion.' },
	logistics: { color: 'azure', hat: 'baseball-cap', prop: 'trolley', description: 'Azure Blobby in a delivery cap, steering a parcel trolley with speedy little wheels.' },
	sniffari: { color: 'mint', hat: 'cowboy-hat', prop: 'compass', description: 'Mint Blobby in an explorer hat, carrying a trail map and a compass.' },
	fetch: { color: 'azure', hat: 'construction-hard-hat', prop: 'wrench', description: 'Azure Blobby in an engineering hard hat, tuning a tennis-ball launcher with a wrench.' },
	puddles: { color: 'mint', hat: 'sailor-hat', prop: 'boots', description: 'Mint Blobby in a sailor cap and yellow rain boots, splashing in a blue puddle.' }
};

if (typeof module !== 'undefined') {
	module.exports = BlobbyOutfits;
}
