# Marked ABC

Render sheet music with [ABCjs](https://www.abcjs.net/) in Markdown documents
using [Marked](https://marked.js.org/).

## Usage

```js
import {Marked} from "marked";
import markedAbc from "marked-abc";

const marked = new Marked();

const options = {
    // default options
};

marked.use(markedAbc(options));

marked.parse(`
  <score lang="ABC">
    X: 1
    T: Epitome of an Enigma
    C: Zarhym Raider
    M: 2/2
    L: 1/8
    K: C#min
    G2|g2 fe d2 c2 | B2 F2 G2 EF | G2 AB A2 G2 | F2 D2 E2 |]
  </score>
`);
// Beautifully formatted sheet music as the output
```

# TODO:

- [ ] Write extension in `/src/index.ts`
- [ ] Write tests in `/spec/index.test.js`
- [ ] Write typescript tests in `/spec/index.test-types.ts`
- [ ] Uncomment release in `/.github/workflows/main.yml`
