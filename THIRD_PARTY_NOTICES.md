# Credits and provenance

## Blobby

The Blobby sprite is Microsoft Corporation artwork from the MIT-licensed
[microsoft/vscode](https://github.com/microsoft/vscode) project:
[buddy-idle-stable-96.png](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/chat/browser/widget/media/chatPet/buddy-idle-stable-96.png).

It is redistributed under the accompanying [MIT license](LICENSE.txt).
The original asset credits identify this exact source. Blobby is not
AI-generated quiz artwork. Use here does not imply endorsement or grant
trademark rights.

### Personality illustrations

The hat atlases in `art-source/accessories/` are Microsoft Corporation artwork
from the same MIT-licensed
[public VS Code accessories directory](https://github.com/microsoft/vscode/tree/main/src/vs/workbench/contrib/chat/browser/widget/media/chatPet/accessories).
Each imported atlas was verified against its public upstream Git blob hash.
The accompanying [MIT license](LICENSE.txt) applies to these assets and the
derived outfit PNGs in `public/assets/blobby-personalities/`.

The quiz's personality images combine the original body and hats with original
pixel-art props and custom palette variations. The idle head attachment and
antenna masking follow the public VS Code accessory rig. These are independent
quiz illustrations, not official personality types or VS Code achievement unlocks.
No VS Code runtime code is shipped. `scripts/build-blobby.cjs` builds the
composites locally, and every personality has an authored visual description.

## Original quiz writing

The human scenarios, choices, and Blobby personality descriptions are original
writing for this quiz. No text from another publisher's quizzes is reproduced.

## Code

The quiz code originated in the standalone quiz
prototype. Existing Microsoft copyright and MIT notices are preserved.
No VS Code editor implementation, credentials, presentation, session history,
or personal configuration is included.
