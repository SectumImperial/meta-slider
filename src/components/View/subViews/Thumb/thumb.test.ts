/**
 * @jest-environment jsdom
 */

import { ThumbAttr } from '../../../Interfaces';
import Thumb from './Thumb';

describe('Thumb tests', () => {
  let root: HTMLElement;
  let thumbPercent: number;
  let id: ThumbAttr;
  let isVertical: boolean;
  let thumb: Thumb;
  let minValue: number;
  let maxValue: number;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    thumbPercent = 10;
    isVertical = false;
    id = 'valueFrom';
    minValue = 0;  
    maxValue = 100;  
    thumb = new Thumb({
      root,
      thumbPercent,
      id,
      isVertical,
      minValue, 
      maxValue 
    });
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  it('must be instance of the Thumb', () => {
    expect(thumb).toBeInstanceOf(Thumb);
  });

  it('must set position', () => {
    thumb.setPosition(20);
    expect(thumb.thumbPercent).toBe(20);
  });
});
