/**
 * @jest-environment jsdom
 */

import Presenter from './Presenter';

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
};

const setWrongState = {
  min: 100,
  max: 0,
  valueFrom: 0,
  valueTo: 0,
  step: 1,
  scalePercentGap: 10,
  scaleMarks: false,
  isTip: false,
  isProgress: false,
  isRange: false,
  isVertical: false,
};

const outputState = {
  ...initialState,
  thumbPercentFrom: 0,
  thumbPercentTo: undefined,
};

const outputSetValueState = {
  ...initialState,
  valueFrom: 20,
  thumbPercentFrom: 20,
  thumbPercentTo: undefined,
};

describe('The presenter tests', () => {
  let presenter: Presenter;
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.className = 'slider__wrapper';
    presenter = new Presenter(root, initialState);
  });

  it('must be instance of the Presenter', () => {
    expect(presenter).toBeInstanceOf(Presenter);
  });

  it('should return correct state', () => {
    expect(presenter.getState()).toStrictEqual(outputState);
  });

  it('should set correct state', () => {
    presenter.setState(setWrongState);
    expect(presenter.getState()).toStrictEqual(outputState);
  });

  it('should set correct value', () => {
    presenter.setValue('valueFrom', 20);
    expect(presenter.getState()).toStrictEqual(outputSetValueState);
  });

  it('should return correct value', () => {
    const value = presenter.getValue('valueFrom');
    expect(value).toStrictEqual(presenter.getState().valueFrom);
  });
});
