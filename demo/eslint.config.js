// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import markedEslintConfig from '@markedjs/eslint-config';

export default [{
  ignores: ['**/lib'],
}, ...markedEslintConfig, ...storybook.configs['flat/recommended']];
