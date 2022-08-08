import Model from "./Model";


describe('Model tests', () => {

  const state = {
    min: 0,
    max: 100,
    value: 50,
    step: 1,
  };

  let model: Model;

  beforeEach(() => {
    const { min, max, value, step } = state
    model = new Model(min, max, value, step);
  })

  test('Model must be an object', () => {
    expect(model).toBeInstanceOf(Model);
  });

  test('Model must be an instance of Model', () => {
    expect(model).toBeInstanceOf(Model);
  });

  test('Model must have defined min', () => {
    expect(model.min).toBeDefined();
  });

  test('Model must have defined max', () => {
    expect(model.max).toBeDefined();
  });

  test('Model must have defined value', () => {
    expect(model.value).toBeDefined();
  });

  test('Model must have defined step', () => {
    expect(model.step).toBeDefined();
  });

  test('Model should be equal state', () => {
    expect(model).toEqual(state);
  });
})
