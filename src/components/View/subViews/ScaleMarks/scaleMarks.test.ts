/**
 * @jest-environment jsdom
 */

import ScaleMarks from './ScaleMarks';
import ModelFacade from '../../../Model/ModelFacade';

const initialState = {
  min: 0,
  max: 100,
  valueFrom: 0,
  valueTo: 0,
  step: 1,
  scalePercentGap: 10,
  scaleMarks: true,
  isTip: false,
  isProgress: false,
  isRange: false,
  isVertical: false,
};

describe('ScaleMarks tests', () => {
  let root: HTMLDivElement;
  let scaleMarks: ScaleMarks;
  let isVertical: boolean;
  let facade: ModelFacade;
  let marks: Map<number, number>;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    isVertical = false;
    facade = new ModelFacade(initialState);
    marks = facade.getState().scaleMap as Map<number, number>;
    scaleMarks = new ScaleMarks(root, marks, isVertical);
  });

  afterEach(() => {
    root.innerHTML = '';
  });

  test('must be instance of the ScaleMarks', () => {
    expect(scaleMarks).toBeInstanceOf(ScaleMarks);
  });

  test('must be correct counts', () => {
    const marksElements = root.querySelectorAll('.js-plugin-slider__mark');
    expect(marksElements).toHaveLength(11);
  });
});
