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

const initialStateVertical = {
  ...initialState,
  isVertical: true,
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

  describe('Initialization tests', () => {
    it('The view must be an instance of View', () => {
      expect(view).toBeInstanceOf(View);
    });

    it('should return the correct root', () => {
      expect(view.getRoot()).toStrictEqual(root);
    });

    it('should set the correct root', () => {
      const newRoot = document.createElement('div');
      newRoot.className = 'new-slider__wrapper';
      view.setRoot(newRoot);
      expect(view.getRoot()).toStrictEqual(newRoot);
    });
  });

  describe('Element existence tests', () => {
    it('Slider should exist', () => {
      const slider = root.querySelectorAll('.js-plugin-slider');
      expect(slider).toHaveLength(1);
    });

    it('Scale should exist', () => {
      const scale = root.querySelectorAll('.js-plugin-slider__scale');
      expect(scale).toHaveLength(1);
    });

    it('Thumb should exist', () => {
      const thumb = root.querySelectorAll('.js-plugin-slider__thumb');
      expect(thumb).toHaveLength(1);
    });

    it('Progress bar should exist with true progress', () => {
      const progress = root.querySelectorAll('.js-plugin-slider__progress');
      expect(progress).toHaveLength(1);
    });

    it('Tip should exist with true tip', () => {
      const tip = root.querySelectorAll('.js-plugin-slider__tip');
      expect(tip).toHaveLength(1);
    });
  });

  describe('Element style tests', () => {
    it('Thumb should have correct style left if pos. horizontal.', () => {
      const thumb = root.querySelector('.js-plugin-slider__thumb') as HTMLDivElement;
      expect(thumb.style.left).toBe(`${initialState.thumbPercentFrom}%`);
    });

    it('Thumb should have correct style top if pos. vertical.', () => {
      root.innerHTML = '';
      view = new View(root, initialStateVertical);
      const thumb = root.querySelector('.js-plugin-slider__thumb') as HTMLDivElement;
      expect(thumb.style.top).toBe(`${initialStateVertical.thumbPercentFrom}%`);
    });

    it('Tip value should be correct with true tip', () => {
      const tip = root.querySelector('.js-plugin-slider__tip') as HTMLDivElement;
      expect(Number(tip.innerText)).toBe(initialState.valueFrom);
    });

    it('Tip value should have correct position', () => {
      const tip = root.querySelector('.js-plugin-slider__tip') as HTMLDivElement;
      expect(tip.style.left).toBe(`${initialStateVertical.thumbPercentFrom}%`);
    });

    it('Progress should have correct width with one thumb', () => {
      const progress = root.querySelector('.js-plugin-slider__progress') as HTMLDivElement;
      expect(progress.style.width).toBe(`${initialState.thumbPercentFrom}%`);
    });
  });

  describe('Element style tests with range', () => {
    beforeEach(() => {
      root.innerHTML = '';
      view = new View(root, initialStateRange);
    });

    it('Second thumb should exist with true range', () => {
      const thumb = root.querySelectorAll('.js-plugin-slider__thumb');
      expect(thumb).toHaveLength(2);
    });

    it('Progress should have correct left with second thumb', () => {
      const progress = root.querySelector('.js-plugin-slider__progress') as HTMLDivElement;
      expect(progress.style.left).toBe(`${initialStateRange.thumbPercentFrom}%`);
    });

    it('Progress should have correct width with second thumb', () => {
      const progress = root.querySelector('.js-plugin-slider__progress') as HTMLDivElement;
      const prWidth = initialStateRange.thumbPercentTo - initialStateRange.thumbPercentFrom;
      expect(progress.style.width).toBe(`${prWidth}%`);
    });
  });
});