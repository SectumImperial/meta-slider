import Model from './Model';
import ModelFacade from './ModelFacade';

const testState = {
  min: 0,
  max: 10,
  valueFrom: 1,
  valueTo: undefined,
  thumbPercentTo: undefined,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: true,
  isTip: true,
  isProgress: true,
  isRange: false,
  isVertical: false,
};

describe('The model tests', () => {
  let model: Model;

  const stateRangeAfterMove = {
    ...testState,
    isRange: false,
    min: 0,
    max: 10,
    valueFrom: 5,
    thumbPercentFrom: 50,
    step: 1,
  };

  beforeEach(() => {
    model = new ModelFacade(testState).getModel();
  });

  test('The model must be an instance of Model', () => {
    expect(model).toBeInstanceOf(Model);
  });

  test('The model must have defined min', () => {
    expect(model.getValue('min')).toBeDefined();
  });

  test('The model must have defined max', () => {
    expect(model.getValue('max')).toBeDefined();
  });

  test('The model must have defined value', () => {
    expect(model.getValue('valueFrom')).toBeDefined();
  });

  test('The model must have defined step', () => {
    expect(model.getValue('step')).toBeDefined();
  });

  test('The model should return correct percent of curr. val', () => {
    const { valueFrom, min, max } = testState;
    const range = max - min;
    const percent = Number(((valueFrom / range) * 100).toFixed(3));

    expect(model.getPercentVal()).toEqual(percent);
  });

  test('The model should return correct value after moving thumb', () => {
    model.setState(testState);
    model.updateStateMove(50, 'valueFrom');
    expect(model.getState()).toEqual(stateRangeAfterMove);
  });
});
