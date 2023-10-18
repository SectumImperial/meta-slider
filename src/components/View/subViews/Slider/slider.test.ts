/**
 * @jest-environment jsdom
 */

import { SliderOptions } from '../../../Interfaces';
import Slider from './Slider';

const scaleMap = new Map();

const initialState = {
  min: 0,
  max: 100,
  valueFrom: 0,
  valueTo: 0,
  step: 1,
  scalePercentGap: 10,
  scaleMarks: false,
  isTip: false,
  isProgress: false,
  isRange: false,
  isVertical: false,
  thumbPercentFrom: 0,
  thumbPercentTo: undefined,
  scaleMap,
};

describe('Slider tests:', () => {
  let root: HTMLElement;
  let slider: Slider;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    slider = new Slider(root, initialState as SliderOptions);
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  it('must be instance of the Slider', () => {
    expect(slider).toBeInstanceOf(Slider);
  });

  it('must return slider', () => {
    const sliderElem = Slider.createSlider();
    expect(sliderElem.className).toBe('plugin-slider js-plugin-slider');
    expect(typeof sliderElem).toBe('object');
  });

});
