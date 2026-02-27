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

// Requires browser to test
/* node:coverage disable */
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
/* node:coverage enable */

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

export type MarkedAbcOptions = {
  /** Options to pass to ABCjs */
  abcOptions?: abcjs.AbcVisualParams,
  /** Sanitizer function */
  sanitizer?: (text: string) => string,
};

type AbcToken = {
  type: 'abcScore',
  raw: string,
  abc: string,
};

export default function(options: MarkedAbcOptions = {}): MarkedExtension {
  return {
    extensions: [{
      name: 'abcScore',
      level: 'block',
      // Marked never calls this and I do not know why
      /* node:coverage disable */
      start(src) { return SCORE_OPEN.exec(src)?.index; },
      /* node:coverage enable */
      tokenizer(src) {
        if (!SCORE_OPEN_BEGIN.exec(src)) {
          return undefined;
        }
        const endMatch = SCORE_CLOSE.exec(src);
        if (endMatch === null) {
          return undefined;
        }
        const end = endMatch.index + endMatch[0].length;
        const raw = src.slice(0, end);
        const abc = raw.replace(SCORE_OPEN_BEGIN, '').replace(SCORE_CLOSE, '');
        return {
          type: 'abcScore',
          raw,
          abc,
        } satisfies AbcToken;
      },
      renderer(token) {
        // Increment score counter for each score rendered to ensure ID uniqueness
        const eleId = `abc-score-${++scoreCounter}`;
        const sanitize = options.sanitizer ?? escape;

        // Unreachable during tests due to missing DOM
        // JS moment: the coverage ignore comment is not included in its own ignore meaning I need
        // to place it before this if statement, meaning the coverage of the if statement itself is
        // not measured.
        /* node:coverage disable */
        if ('document' in globalThis) {
          waitForElement(`#${eleId}`).then((ele: Element) => {
            abcjs.renderAbc(
              ele,
              // Trim all leading whitespace or ABCjs freaks out and fails to render it all
              (token as AbcToken).abc.split('\n').map((line: string) => line.trim()).join('\n'),
              options.abcOptions,
            );
          });
        }
        /* node:coverage enable */

        return dedent`<div class="abc-score" id="${eleId}">
        ${indent(sanitize(token.abc), '  ')}
        </div>
        `;
      },
    }],
  };
}
