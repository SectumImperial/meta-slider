/**
 * @jest-environment jsdom
 */

import SliderComponents from './SliderComponents';

describe('SliderComponents tests', () => {
  let root: HTMLDivElement;
  let sliderComponents: SliderComponents;
  let isVertical: boolean;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    isVertical = false;
    sliderComponents = new SliderComponents(root, isVertical);
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  test('must be instance of the SliderComponents', () => {
    expect(sliderComponents).toBeInstanceOf(SliderComponents);
  });

  test('must create correct element', () => {
    const testDiv = SliderComponents.createElement('test');
    expect(testDiv.className).toBe('test');
    expect(typeof testDiv).toBe('object');
  });

  test('performPointerMove must return nothing', () => {
    expect(sliderComponents.performPointerMove(1000, 'valueFrom')).toBeUndefined();
  });

  test('performKeyDown must return nothing', () => {
    expect(sliderComponents.performKeyDown('decrement', 'valueFrom')).toBeUndefined();
  });
});
