// node:coverage ignore next
import { type MarkedExtension } from 'marked';
import * as abcjs from 'abcjs';
import dedent from 'dedent';

let scoreCounter = 0;

// Source - https://stackoverflow.com/a/31638198/6335363
// Posted by Dave Brown
// Retrieved 2026-02-27, License - CC BY-SA 3.0
/** Escape string for embedding in HTML */
function escape(r: string) {
  return r.replace(/[\x26\x0A\<>'"]/g, r => '&#' + r.charCodeAt(0) + ';');
}

// Source - https://stackoverflow.com/a/61511955/6335363
// Posted by Yong Wang, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-27, License - CC BY-SA 4.0
/**
 * Wait for the given element selector to match, then return a reference to it.
 *
 * Requires `document` to exist, so will not work outside of a browser context.
 */
function waitForElement(selector: string): Promise<Element> {
  return new Promise(resolve => {
    const match = document.querySelector(selector);
    if (match) {
      return resolve(match);
    }

    const observer = new MutationObserver(mutations => {
      const match = document.querySelector(selector);
      if (match) {
        observer.disconnect();
        resolve(match);
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see
    // https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/** Indent the given string with the given string for each line */
function indent(s: string, indent: string) {
  return s.split('\n').map(line => indent + line).join('\n');
}

/** Match `<score lang="ABC">` */
const SCORE_OPEN = /<score\s+lang="(ABC|abc)"\s*>/;

/** Match `<score lang="ABC">`, only at beginning of string */
const SCORE_OPEN_BEGIN = new RegExp('^' + SCORE_OPEN.source);

/** Match `</score>` */
const SCORE_CLOSE = /<\/score>/;

export default function(options: abcjs.AbcVisualParams = {}): MarkedExtension {
  return {
    extensions: [{
      name: 'abcScore',
      level: 'block',
      start(src) { return SCORE_OPEN.exec(src)?.index; },
      tokenizer(src) {
        const endMatch = SCORE_CLOSE.exec(src);
        if (endMatch === null) {
          throw Error('Unterminated <score lang="ABC"> block');
        }
        const end = endMatch.index + endMatch[0].length;
        const raw = src.slice(0, end);
        const abc = raw.replace(SCORE_OPEN_BEGIN, '').replace(SCORE_CLOSE, '');
        return {
          type: 'abcScore',
          raw,
          abc,
        };
      },
      renderer(token) {
        // Increment score counter for each score rendered to ensure ID uniqueness
        const eleId = `abc-score-${++scoreCounter}`;

        if ('document' in globalThis) {
          waitForElement(`#${eleId}`).then((ele: Element) => {
            abcjs.renderAbc(ele, token.abc, options);
          });
        }

        return dedent`<div class="abc-score" id="${eleId}">
        ${indent(escape(token.abc), '  ')}
        </div>
        `;
      },
    }],
  };
}
