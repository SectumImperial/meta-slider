import { ValidSliderData } from '../Interfaces';
import ModelFacade from './ModelFacade';

describe('ModelFacade', () => {
  let modelFacade: ModelFacade;

  const defaultTestData = {
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

  beforeEach(() => {
    modelFacade = new ModelFacade(defaultTestData);
  });

  it('should be an instance of ModelFacade', () => {
    expect(modelFacade).toBeInstanceOf(ModelFacade);
  });

  describe('State Validation', () => {
    it('should return valid data for incorrect input', () => {
      const incorrectData = { ...defaultTestData, min: 10, max: 10, valueFrom: 14 };
      const expectedData = { ...defaultTestData, max: 11, min: 10, step: 1, thumbPercentFrom: 100, valueFrom: 11 };

      modelFacade = new ModelFacade(incorrectData);
      expect(modelFacade.getState()).toStrictEqual(expectedData);
    });

    it('should return valid data for two thumbs', () => {
      const incorrectData = {
        min: 20,
        max: 10,
        valueFrom: 11,
        step: 123,
        valueTo: 32,
        isRange: true,
        scaleMarks: true,
        isTip: true,
        isProgress: true,
        isVertical: false
      };
      const expectedData = {
        min: 10,
        max: 20,
        step: 10,
        thumbPercentFrom: 0,
        thumbPercentTo: 100,
        valueFrom: 10,
        valueTo: 20,
        isRange: true,
        scaleMarks: true,
        isTip: true,
        isProgress: true,
        isVertical: false,
        scaleMap: new Map([
          [10, 0],
          [20, 100]
        ]),
      };
    
      modelFacade = new ModelFacade(incorrectData);
      expect(modelFacade.getState()).toStrictEqual(expectedData);
    });
  });

  describe('State Manipulation', () => {
    it('should set specific values', () => {
      modelFacade.setValue('max', 20);
      expect(modelFacade.getState().max).toBe(20);
    });

    it('should update state correctly', () => {
      const newData = { ...defaultTestData, max: 21, thumbPercentFrom: 4.762 };
      modelFacade.setState(newData);
      expect(modelFacade.getState()).toStrictEqual(newData);
    });
  });

  describe('Value Retrieval', () => {
    it('should return the correct value for a given key', () => {
      expect(modelFacade.getValue('valueFrom')).toBe(defaultTestData.valueFrom);
    });
  });

  describe('Scale Marks', () => {
    it('should return correct type of scale marks', () => {
      const testDataWithMarks = { ...defaultTestData, scaleMarks: true };
      modelFacade = new ModelFacade(testDataWithMarks);
      expect(modelFacade.validGapMarks()).toBeInstanceOf(Map);
    });
  });

  describe('Update Method', () => {
    it('should not return anything', () => {
      const updateData: ValidSliderData = {
        coordsMove: 6,
        scaleSize: 1076.546875,
        ThumbAttr: 'valueTo',
      };
      expect(modelFacade.update(updateData)).toBeUndefined();
    });
  });
});
