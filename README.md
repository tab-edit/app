You can see a live preview of the app [here](https://tab-edit.vercel.app/)
Currently, only syntax highlighting for guitar ascii tabs is fully functional. Other features of the app are being actively developed.

This is a large scale personal project re-envisioning a previous personal project ([TAB2XML](https://github.com/Stan15/TAB2XML)) with modern web tools. This project has dependencies on [3 other ongoing projects](https://github.com/Stan15?tab=projects) which I am actively developing as part of this effort. All together, the system should parse, lint, play and convert free-form ascii music tablature notation into the MusicXML format.

I made the choice to use CodeMirror6 and the Lezer parser (instead of RegEx which I used in the previous project) to allow for efficient incremental reparsing of ascii tabs. [The linter](https://github.com/Stan15/tablint) I am actively developing is heavily inspired by "ESLint". This enables a high level of user customization and allows for user-defined tablature linting rules to be supported for music tablature.

As I mentioned before, this is a large project and it is very much a work in progress.
