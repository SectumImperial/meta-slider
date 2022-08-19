import Model from "./Model";
import ModelFacade from "./ModelFacade";
import initialState from '../../state'


describe('The model tests', () => {

  let model: Model;

  beforeEach(() => {
    model = new ModelFacade(initialState).getModel();
  })

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

  test('The model state should be equal initialState', () => {
    expect(model.getState()).toEqual(initialState);
  });


  test('The model increment method should be defined', () => {
    expect(model.increment).toBeDefined();
  });

  test('The model should incremented the value after increment', () => {
    const incrementVal = initialState.valueFrom + 1;
    model.increment();
    expect(model.getValue('valueFrom')).toEqual(incrementVal);
  });


  test('The model decrement method should be defined', () => {
    expect(model.increment).toBeDefined();
  });

  test('The model should decremented the value after decrement', () => {
    const decrementVal = initialState.valueFrom - 1;
    model.decrement();
    expect(model.getValue('valueFrom')).toEqual(decrementVal);
  });

  test('The model should return correct percent of curr. val', () => {
    const { valueFrom, min, max } = initialState;
    const range = max - min;
    const percent = Number(((valueFrom / range) * 100).toFixed(3));

    expect(model.getPercentVal()).toEqual(percent);
  });
})
