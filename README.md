An editor for ascii music tablature files. You can see a live preview of this app [here](https://tab-edit.github.io/tab-edit/).
This project is planned to support linting and playing of tablature files, as well as conversion into the MusicXML format and pdf previews of the tablature score.

This project implements an [incremental parsing system](https://github.com/tab-edit/tab-ast) to generate a semantically consistent abstract syntax tree for the unique semantics of tablature files.

It also implements an extensible rule-based [state management system](https://github.com/tab-edit/tab-state), inspired by the [eslint](https://github.com/eslint/eslint) project, which makes it possible to implement custom features like linting or MusicXML conversion by simply defining a set of rules which extend on the state of the system.

Work on this project is currently underway and is still in its very early stages.
