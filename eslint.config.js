// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import markedEslintConfig from '@markedjs/eslint-config';

export default [{
  ignores: ['**/lib', 'demo/'],
}, ...markedEslintConfig];
