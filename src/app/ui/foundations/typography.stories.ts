import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const TypeScale: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:16px;padding:32px;background:#000;color:#fff;max-width:900px;">
        <h1 class="text-h1" style="margin:0;font-family:Georgia,serif;line-height:1.1;text-transform:uppercase;">Heading 1</h1>
        <h2 class="text-h2" style="margin:0;font-family:Georgia,serif;line-height:1.1;text-transform:uppercase;">Heading 2</h2>
        <h3 class="text-h3" style="margin:0;font-family:Georgia,serif;line-height:1.1;text-transform:uppercase;">Heading 3</h3>
        <h4 style="margin:0;color:#fbcea0;font-family:Georgia,serif;font-weight:400;">Heading 4</h4>
        <div class="deco-label">Overline label</div>
        <p>Body copy. The world is a dangerous place, but fortune favors the bold. This paragraph
           uses the muted ink tone and the sans body face, sized fluidly between breakpoints.</p>
        <a href="#" style="color:#c19976;">Inline link</a>
        <div class="text-gradient text-h2" style="font-family:Georgia,serif;text-transform:uppercase;">Gradient text</div>
      </div>`,
  }),
};
