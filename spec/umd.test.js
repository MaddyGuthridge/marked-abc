import { describe, test } from 'node:test';
import '../lib/index.umd.js';

describe('marked-abc umd', () => {
  test('test umd global', (t) => {
    t.assert.equal(typeof markedAbc, 'function');
  });
});
