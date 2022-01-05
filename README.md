A large scale personal project re-envisioning a previous personal project ([TAB2XML](https://github.com/Stan15/TAB2XML)) with modern web tools.
This project has dependencies on [3 other ongoing projects](https://github.com/Stan15?tab=projects) I am developing as part of this effort.
All together, the system parses, lints, plays and converts free-form ascii music tablature notation into the MusicXML format.

I made the choice to use CodeMirror6 and the Lezer parser (instead of RegEx which I used in the previous project) to allow for parsing tablature in linear time.
[The linter](https://github.com/Stan15/tablint) I am actively developing is heavily inspired by "ESLint". This enables a high level of user customization and allows for user-defined tablature linting rules to be supported for music tablature.

As I mentioned before, this is a large project and it is very much a work in progress.
