/**
 * @jest-environment jsdom
 */

import View from './View';

const initialState = {
  isProgress: true,
  isRange: false,
  isTip: true,
  isVertical: false,
  max: 10,
  min: 0,
  scaleMarks: false,
  scalePercentGap: 5,
  step: 1,
  thumbPercentFrom: 10,
  thumbPercentTo: 100,
  valueFrom: 1,
  valueTo: 10,
};

const initialStateRange = {
  ...initialState,
  isRange: true,
};

describe('The View component tests', () => {
  let root: HTMLElement;
  let view: View;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    view = new View(root, initialState);
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  test('The view must be istance of the View', () => {
    expect(view).toBeInstanceOf(View);
  });

  test('Slider should exist', () => {
    const slider = root.querySelectorAll('.slider');
    expect(slider).toHaveLength(1);
  });

  test('Scale should exist', () => {
    const scale = root.querySelectorAll('.slider__scale');
    expect(scale).toHaveLength(1);
  });

  test('Thumb should exist', () => {
    const thumb = root.querySelectorAll('.slider__thumb');
    expect(thumb).toHaveLength(1);
  });

  test('Second thumb should exist with true range', () => {
    root.innerHTML = '';
    view = new View(root, initialStateRange);
    const thumb = root.querySelectorAll('.slider__thumb');
    expect(thumb).toHaveLength(2);
  });

  test('Progress bar should exist with true progress', () => {
    const progress = root.querySelectorAll('.slider__progress');
    expect(progress).toHaveLength(1);
  });

  test('Tit should exist with true tip', () => {
    const tip = root.querySelectorAll('.slider__tip');
    expect(tip).toHaveLength(1);
  });
});
