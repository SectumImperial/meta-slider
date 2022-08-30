import ModelFacade from './ModelFacade';
import Model from './Model';
import Validator from './Validator';

describe('The modelFacede tests', () => {
  let modelFacede: ModelFacade;

  const testData = {
    min: 0,
    max: 10,
    valueFrom: 1,
    thumbPercentFrom: 10,
    valueTo: undefined,
    thumbPercentTo: undefined,
    step: 1,
    scalePercentGap: 5,
    scaleMarks: false,
    isTip: true,
    isProgress: true,
    isRange: false,
    isVertical: false,
  };

  const testDataWrongTwoThumbs = {
    min: 20,
    max: 10,
    valueFrom: 11,
    step: 123,
    valueTo: undefined,
    scalePercentGap: 5,
    scaleMarks: false,
    isTip: true,
    isProgress: true,
    isRange: true,
    isVertical: false,
  };

  const dataWrong = {
    ...testData,
    min: 10,
    max: 10,
    valueFrom: 14,
    thumbPercentFrom: 6661488,
    step: 11,
  };

  const dataCorrect = {
    ...testData,
    max: 21,
    min: 10,
    step: 11,
    thumbPercentFrom: 9.091,
    valueFrom: 11,
  };

  const dataCorrectTwoThumbs = {
    ...testDataWrongTwoThumbs,
    max: 20,
    min: 10,
    step: 10,
    thumbPercentFrom: 0,
    thumbPercentTo: 0,
    valueFrom: 10,
    valueTo: 10,
  };

  const correctChangedData = {
    ...testData,
    max: 20,
    thumbPercentFrom: 5,
  };

  const correctChangedValData = {
    ...testData,
    isRange: false,
  };

  beforeEach(() => {
    modelFacede = new ModelFacade(testData);
  });

  test('The modelFacade must be an instance of ModelFacade', () => {
    expect(modelFacede).toBeInstanceOf(ModelFacade);
  });

  test('The facade should return a Model instance', () => {
    expect(modelFacede.getModel()).toBeInstanceOf(Model);
  });

  test('The facade should return a Validator instance', () => {
    expect(modelFacede.getValidator()).toBeInstanceOf(Validator);
  });

  test('The facade should return a valid data', () => {
    modelFacede = new ModelFacade(dataWrong);
    expect(modelFacede.getState()).toStrictEqual(dataCorrect);
  });

  test('The facade should return a valid data with two thumbs', () => {
    modelFacede = new ModelFacade(testDataWrongTwoThumbs);
    expect(modelFacede.getState()).toStrictEqual(dataCorrectTwoThumbs);
  });

  test('The facade should set values', () => {
    modelFacede = new ModelFacade(testData);
    modelFacede.setValue('max', 20);
    expect(modelFacede.getState()).toStrictEqual(correctChangedData);
  });

  test('The facade should set correct values', () => {
    modelFacede = new ModelFacade(testData);
    modelFacede.setValue('isRange', 20);
    expect(modelFacede.getState()).toStrictEqual(correctChangedValData);
  });
});
