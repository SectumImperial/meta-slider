/**
 * @jest-environment jsdom
 */

import View from './View';
import state from '../../state';

describe('The View component tests', () => {
  let root: HTMLElement;
  let view: View;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    view = new View(root, state);
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
});
