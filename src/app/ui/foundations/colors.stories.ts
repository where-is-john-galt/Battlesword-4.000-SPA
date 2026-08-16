import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const swatch = (name: string, value: string, text?: string) => `
  <div style="display:flex;align-items:center;gap:12px;">
    <span style="width:64px;height:64px;border:1px solid #333;background:${value};border-radius:2px;"></span>
    <div>
      <div style="font-family:monospace;color:#fff;">${name}</div>
      <div style="font-family:monospace;color:hsl(0 0% 100% / .5);">${text ?? value}</div>
    </div>
  </div>`;

export const Palette: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:24px;padding:32px;background:#000;">
        <h2 class="text-h2" style="margin:0;color:#fff;font-family:Georgia,serif;text-transform:uppercase;">Palette</h2>
        <div>
          <div class="deco-label">Core</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
            ${swatch('bg', '#000000')}
            ${swatch('ink', '#ffffff')}
            ${swatch('ink-muted', 'rgba(255,255,255,0.65)')}
          </div>
        </div>
        <div>
          <div class="deco-label">Gold & bronze</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
            ${swatch('gold', '#fbcea0')}
            ${swatch('bronze', '#c19976')}
            ${swatch('bronze-soft', '#b99b77')}
            ${swatch('bronze-deep', '#b78f6d')}
            ${swatch('bronze-dark', '#6d523b')}
            ${swatch('parchment', '#ddc9a7')}
            ${swatch('parchment-light', '#e0ccb1')}
          </div>
        </div>
        <div>
          <div class="deco-label">Status</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;">
            ${swatch('success', '#008951', '#00c071')}
            ${swatch('info', '#c8aa34', '#ffe270')}
            ${swatch('danger', '#b51111', '#cf3939')}
          </div>
        </div>
      </div>`,
  }),
};
