An editor for ascii music tablature text. You can see a live preview of this app [here](https://tab-edit.github.io/tab-edit/).
This project is planned to support linting and playing of ascii tablature text, as well as conversion into the MusicXML format and pdf previews of the tablature score.

This project implements an [incremental parsing system](https://github.com/tab-edit/tab-ast) which generate a semantically consistent abstract syntax tree for the unique semantics of ascii music tab text (i.e. some syntax nodes, like a Measure node for example, cover multiple, non-continuous ranges).

It also uses the pluggable and configurable, rule-based state management system - [tab-edit/tab-state](https://github.com/tab-edit/tab-state) - which makes it possible to implement custom features like linting or MusicXML conversion as a set of configurable rules which extend the state of the system.

Work on this project is currently underway and is still in its very early stages.
