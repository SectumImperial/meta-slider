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
});
