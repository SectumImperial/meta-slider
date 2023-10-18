/**
 * @jest-environment jsdom
 */

import Scale from './Scale';

describe('Scale tests', () => {
  let root: HTMLDivElement;
  let scale: Scale;
  let isVertical: boolean;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    isVertical = false;
    scale = new Scale(root, isVertical);
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  it('The scale must be instance of the Scale', () => {
    expect(scale).toBeInstanceOf(Scale);
  });
});
