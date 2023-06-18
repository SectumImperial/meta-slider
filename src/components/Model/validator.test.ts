import { ValidSliderData, ModelOptions } from 'Src/components/Interfaces';
import Validator from './Validator';

const initialStateOneThumb = {
  min: 0,
  max: 10,
  valueFrom: 0,
  valueTo: undefined,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: true,
  isTip: true,
  isProgress: true,
  isVertical: false,
  isRange: false,
  thumbPercentFrom: 0,
  thumbPercentTo: undefined,
};

const initialStateTwoThumb = {
  min: 0,
  max: 10,
  valueFrom: 0,
  valueTo: 5,
  step: 1,
  scalePercentGap: 5,
  scaleMarks: true,
  isTip: true,
  isProgress: true,
  isVertical: false,
  isRange: true,
  thumbPercentFrom: 0,
  thumbPercentTo: 5,
};

describe('The validation of data tests', () => {
  let validator: Validator;

  //  Wrong cases
  const dataStepWrong = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 11,
  };

  const dataValWrong = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 11,
  };

  const dataValSmallWrong = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: -1,
  };

  const dataRangeWrong = {
    ...initialStateOneThumb,
    min: 0,
    max: 0,
  };

  const dataMinMaxWrong = {
    ...initialStateOneThumb,
    min: 10,
    max: 0,
  };

  // Correct cases
  const dataStepCorrect = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 10,
  };

  const dataValCorrect = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 10,
    thumbPercentFrom: 100,
    step: 1,
    isRange: false,
  };

  const dataValSmallCorrect = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 0,
    thumbPercentFrom: 0,
    step: 1,
    isRange: false,
  };

  const dataRangeCorrect = {
    ...initialStateOneThumb,
    min: 0,
    max: 1,
  };

  const dataMinMaxCorrect = {
    ...initialStateOneThumb,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 1,
    isRange: false,
  };

  //  Wrong 2 thumb cases
  const dataFromToWrong = {
    ...initialStateTwoThumb,
    valueFrom: 10,
    valueTo: 8,
    thumbPercentFrom: 100,
    thumbPercentTo: 80,
  };

  // Correct two thumb cases
  const dataFromToCorrect = {
    ...initialStateTwoThumb,
    valueFrom: 8,
    valueTo: 10,
    thumbPercentFrom: 80,
    thumbPercentTo: 100,
  };

  const oldStateValidatePercent = {
    ...initialStateOneThumb,
    min: 0,
    max: 100,
    valueFrom: 10,
    valueTo: 0,
    step: 1,
    thumbPercentFrom: 10,
  };

  const newStateValidatePercent = {
    ...initialStateOneThumb,
    min: 0,
    max: 100,
    valueFrom: 10,
    valueTo: 0,
    step: 1,
    thumbPercentFrom: 10,
  };

  const oldStateValidPercentTwoThumbs = {
    min: 0,
    max: 100,
    valueFrom: 0,
    valueTo: 0,
    step: 1,
    scalePercentGap: 10,
    scaleMarks: true,
    isTip: false,
    isProgress: false,
    isRange: true,
    isVertical: false,
    thumbPercentFrom: 0,
    thumbPercentTo: 0,
    scaleMap: {},
  };

  const newStateValidPercentTwoThumbs = {
    min: 0,
    max: 100,
    valueFrom: 0,
    valueTo: 10,
    step: 1,
    scalePercentGap: 10,
    scaleMarks: true,
    isTip: false,
    isProgress: false,
    isRange: true,
    isVertical: false,
    thumbPercentFrom: 0,
    thumbPercentTo: 10,
    scaleMap: {},
  };

  test('Step can not be bigger than all range', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataStepWrong)).toEqual(dataStepCorrect);
  });

  test('Value can not be bigger than max', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataValWrong)).toEqual(dataValCorrect);
  });

  test('Value can not be smaller than min', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataValSmallWrong)).toEqual(dataValSmallCorrect);
  });

  test('Min and max canot be the same', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataRangeWrong)).toEqual(dataRangeCorrect);
  });

  test('Min can not be bigger than max', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataMinMaxWrong)).toEqual(dataMinMaxCorrect);
  });

  test('Value from cannot be bigger than value to', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData(dataFromToWrong)).toEqual(dataFromToCorrect);
  });

  test('Should validate thumbId', () => {
    validator = new Validator(initialStateTwoThumb);
    const thumb = validator.validateThumbId(1);
    expect(thumb).toEqual('valueFrom');
  });

  test('Should correct perform move coords to percent', () => {
    const move = {
      coordsMove: 1,
      thumbId: 'valueFrom',
      scaleSize: 1076.546875,
    };

    validator = new Validator({
      ...initialStateOneThumb,
      min: 0,
      max: 100,
    });
    const movePercent = validator.performMoveToPercent(move as ValidSliderData);
    expect(movePercent).toEqual(0.09);
  });

  test('Should correct perform move coords to percent by keyboard', () => {
    const move = {
      keyEvent: 'increment',
      thumbId: 'valueFrom',
    };

    validator = new Validator({
      ...initialStateOneThumb,
      min: 0,
      max: 100,
    });
    const movePercent = validator.performMoveToPercent(move as ValidSliderData);
    expect(movePercent).toEqual(1);
  });

  test('Should correct validate percent by click on marks wit one thumb', () => {
    const percent = validator.validatePercent(10, 10, oldStateValidatePercent as ModelOptions);
    expect(percent).toEqual(newStateValidatePercent);
  });

  test('Should correct validate percent by click on marks with two thumb', () => {
    const percent = validator.validatePercent(
      10,
      10,
      oldStateValidPercentTwoThumbs as ModelOptions,
    );
    expect(percent).toEqual(newStateValidPercentTwoThumbs);
  });
});
