# Marked ABC

Render sheet music with [ABCjs](https://www.abcjs.net/) in Markdown documents
using [Marked](https://marked.js.org/).

## Usage

This only renders in the browser.

```js
import {Marked} from "marked";
import markedAbc from "marked-abc";

const marked = new Marked();

marked.use(markedAbc());

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

## Options

* `abcOptions`: [options for `abcjs.renderAbc`](https://docs.abcjs.net/visual/render-abc-options.html)
* `sanitizer`: function to sanitize abcJS score. To minimize dependencies, this
  library only performs basic escaping to HTML, meaning that maliciously-crafted
  scores could perform an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting)
  attack. If your scores are user-generated and can be shared, you should use a
  library such as [`DOMPurify`](https://www.npmjs.com/package/dompurify) to
  maximize the safety of the rendering.
