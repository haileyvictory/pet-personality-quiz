# Credits and provenance

## Blobby

The Blobby sprite is Microsoft Corporation artwork from the MIT-licensed
[microsoft/vscode](https://github.com/microsoft/vscode) project:
[buddy-idle-stable-96.png](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/chat/browser/widget/media/chatPet/buddy-idle-stable-96.png).

It is redistributed under the accompanying [MIT license](LICENSE.txt).
The original asset credits identify this exact source. Blobby is not
AI-generated quiz artwork. Use here does not imply endorsement or grant
trademark rights.

### Career outfits

The hat atlases in `art-source/accessories/` are Microsoft Corporation artwork
from the same MIT-licensed
[public VS Code accessories directory](https://github.com/microsoft/vscode/tree/main/src/vs/workbench/contrib/chat/browser/widget/media/chatPet/accessories).
Each imported atlas was verified against its public upstream Git blob hash.
The accompanying [MIT license](LICENSE.txt) applies to these assets and the
derived outfit PNGs in `public/assets/blobby-careers/`.

The quiz's career images combine the original body and hats with original
pixel-art props and custom palette variations. The idle head attachment and
antenna masking follow the public VS Code accessory rig. These are independent
quiz illustrations, not official career outfits or VS Code achievement unlocks.
No VS Code runtime code is shipped. `scripts/build-blobby.cjs` builds the
composites locally, and every career has an authored visual description.

## Prepared pet portraits

`public/assets/pet-careers.png` is original prepared AI-generated artwork made
for this quiz. It is not a photograph of a person or a user's pet. The image
atlas is bundled locally; no image-generation service is called by the app.
Nonessential embedded metadata is removed from the distributed PNG.

`public/assets/pet-portraits/` contains 48 optimized WebP illustrations:
six crops of the original cat/dog atlas and 42 newly prepared AI illustrations
matching its warm storybook style. The original snack-inspector cat, not the
incorrect dog cell in the newly generated cat contact sheet, is used for
`cat-snacks.webp`. Only reviewed individual portraits are distributed; the
generated contact sheets are not included. Re-encoding removes source metadata.

`public/assets/cat.webp` and `public/assets/dog.webp` are prepared AI-generated
plain animal illustrations in the same storybook style, without costumes or
job props. They appear in selection and interview views before a
career has been determined. They contain no source generation metadata.

## Code

The quiz code originated in the standalone quiz
prototype. Existing Microsoft copyright and MIT notices are preserved.
No VS Code editor implementation, credentials, presentation, session history,
or personal configuration is included.
