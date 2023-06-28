import { ValidSliderData } from 'Src/components/Interfaces';
import ModelFacade from './ModelFacade';
import Model from './Model';
import Validator from './Validator';

describe('The modelFacade tests', () => {
  let modelFacade: ModelFacade;

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
    valueTo: 32,
    scalePercentGap: 5,
    scaleMarks: false,
    isTip: true,
    isProgress: true,
    isRange: true,
    isVertical: false,
  };

  const mapTests = {
    ...testData,
    scaleMarks: true,
  };

  const updateData: ValidSliderData = {
    coordsMove: 6,
    scaleSize: 1076.546875,
    thumbId: 'valueTo',
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
    thumbPercentFrom: 0,
    valueFrom: 10,
  };

  const dataCorrectTwoThumbs = {
    min: 10,
    max: 20,
    step: 10,
    thumbPercentFrom: 0,
    thumbPercentTo: 100,
    valueFrom: 10,
    valueTo: 20,
    scalePercentGap: 5,
    scaleMarks: false,
    isTip: true,
    isProgress: true,
    isRange: true,
    isVertical: false,
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
    modelFacade = new ModelFacade(testData);
  });

  test('must be an instance of ModelFacade', () => {
    expect(modelFacade).toBeInstanceOf(ModelFacade);
  });

  test('should return a Model instance', () => {
    expect(modelFacade.getModel()).toBeInstanceOf(Model);
  });

  test('should return a Validator instance', () => {
    expect(modelFacade.getValidator()).toBeInstanceOf(Validator);
  });

  test('should return a valid data', () => {
    modelFacade = new ModelFacade(dataWrong);
    expect(modelFacade.getState()).toStrictEqual(dataCorrect);
  });

  test('should return a valid data with two thumbs', () => {
    modelFacade = new ModelFacade(testDataWrongTwoThumbs);
    expect(modelFacade.getState()).toStrictEqual(dataCorrectTwoThumbs);
  });

  test('should set values', () => {
    modelFacade = new ModelFacade(testData);
    modelFacade.setValue('max', 20);
    expect(modelFacade.getState()).toStrictEqual(correctChangedData);
  });

  test('should set correct values', () => {
    modelFacade = new ModelFacade(testData);
    modelFacade.setValue('isRange', 20);
    expect(modelFacade.getState()).toStrictEqual(correctChangedValData);
  });

  test('should return correct value', () => {
    modelFacade = new ModelFacade(testData);
    expect(modelFacade.getValue('valueFrom')).toStrictEqual(testData.valueFrom);
  });

  test('should return correct type of scale marks', () => {
    modelFacade = new ModelFacade(mapTests);
    expect(modelFacade.validGapMarks()).toBeInstanceOf(Map);
  });

  test('should correct set data', () => {
    modelFacade = new ModelFacade(testData);
    modelFacade.setState(dataCorrect);
    expect(modelFacade.getState()).toStrictEqual(dataCorrect);
  });

  test('update should return nothing', () => {
    modelFacade = new ModelFacade(testData);
    expect(modelFacade.update(updateData)).toBeUndefined();
  });
});
