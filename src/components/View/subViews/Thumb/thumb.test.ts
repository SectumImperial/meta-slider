/**
 * @jest-environment jsdom
 */

import { ThumbId } from '../../../Interfaces';
import Thumb from './Thumb';

describe('Thumb tests', () => {
  let root: HTMLElement;
  let thumbPercent: number;
  let id: ThumbId;
  let isVertical: boolean;
  let thumb: Thumb;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    thumbPercent = 10;
    isVertical = false;
    id = 'valueFrom';
    thumb = new Thumb({
      root,
      thumbPercent,
      id,
      isVertical,
    });
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  test('must be instance of the Thumb', () => {
    expect(thumb).toBeInstanceOf(Thumb);
  });

  test('must set position', () => {
    thumb.setPosition(20);
    expect(thumb.thumbPercent).toBe(20);
  });
});
