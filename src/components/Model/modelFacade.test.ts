import ModelFacade from "./ModelFacade";
import Model from "./Model";
import Validator from './Validator';
import initialState from '../../state';

describe('The modelFacede tests', () => {

  let modelFacede: ModelFacade;

  const dataWrong = {
    min: 10,
    max: 10,
    value: 14,
    step: 11,
    thumbPercent: 140,
  }

  const dataCorrect = {
    min: 10,
    max: 21,
    value: 14,
    step: 11,
    thumbPercent: 55,
  }

  beforeEach(() => {
    modelFacede = new ModelFacade(initialState);
  })

  test('The modelFacade must be an instance of ModelFacade', () => {
    expect(modelFacede).toBeInstanceOf(ModelFacade);
  });

  test('The facade should return a Model instance', () => {
    expect(modelFacede.getModel()).toBeInstanceOf(Model);
  })

  test('The facade should return a Validator instance', () => {
    expect(modelFacede.getValidator()).toBeInstanceOf(Validator);
  })

  test('The facade should return a valid data', () => {
    modelFacede = new ModelFacade(dataWrong);
    expect(modelFacede.getState()).toStrictEqual(dataCorrect);
  })

})