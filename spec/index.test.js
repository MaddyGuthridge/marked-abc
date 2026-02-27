import { describe, test } from 'node:test';
import { Marked } from 'marked';
import markedAbc from '../src/index.ts';

describe('marked-abc', () => {
  test('no options', (t) => {
    const marked = new Marked();
    marked.use(markedAbc());
    t.assert.snapshot(marked.parse('example markdown'));
  });

  test('markdown not using this extension', (t) => {
    const marked = new Marked();
    marked.use(markedAbc());
    t.assert.snapshot(marked.parse('not example markdown'));
  });
});
