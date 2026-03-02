import { describe, test } from 'node:test';
import { Marked } from 'marked';
import markedAbc from '../src/index.ts';

const EXAMPLE_SCORE = `
<score lang="ABC">
  X: 1
  T: Epitome of an Enigma
  C: Zarhym Raider
  M: 2/2
  L: 1/8
  K: C#min
  G2|g2 fe d2 c2 | B2 F2 G2 EF | G2 AB A2 G2 | F2 D2 E2 |]
</score>
`.trim();

describe('marked-abc', () => {
  test('no options', (t) => {
    const marked = new Marked();
    marked.use(markedAbc().extension);
    const result = marked.parse(EXAMPLE_SCORE);
    t.assert.match(result, /<div class="abc-score" id="abc-score-\d+">/);
    t.assert.match(result, /<\/div>/);
  });

  test('unterminated score block', (t) => {
    const marked = new Marked();
    marked.use(markedAbc().extension);
    // No action is block is unterminated
    const unterminated = EXAMPLE_SCORE.replace('</score>', '');
    t.assert.equal(marked.parse(unterminated), unterminated);
  });

  test('Other markdown renders normally', (t) => {
    const marked = new Marked();
    marked.use(markedAbc().extension);
    const result = marked.parse('# Heading');
    t.assert.equal(result, '<h1>Heading</h1>\n');
  });

  test('markdown not using this extension', (t) => {
    const marked = new Marked();
    // No changes
    t.assert.equal(marked.parse(EXAMPLE_SCORE), EXAMPLE_SCORE);
  });
});
