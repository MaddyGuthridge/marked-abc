import { Marked } from 'marked';
import markedAbc from 'marked-abc';

const marked = new Marked();

const options = {
  // default options
};

marked.use(markedAbc(options).extension);

const html: string = marked.parse('example markdown', { async: false });
console.log(html);
