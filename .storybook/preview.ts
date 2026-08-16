import { applicationConfig, type Preview } from '@storybook/angular';
import { appConfig } from '../src/app/app.config';

const preview: Preview = {
  decorators: [applicationConfig({ providers: appConfig.providers })],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
};

export default preview;
