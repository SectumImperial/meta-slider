import initialState from '../../state';
import Validator from './Validator'



describe('The validation of data tests', () => {

  let validator: Validator;

  //  Wrong cases
  const dataStepWrong = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 11,
    isRange: false,
  }
  const dataValWrong = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 11,
    step: 1,
    isRange: false,
  }

  const dataValSmallWrong = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: -1,
    step: 1,
    isRange: false,
  }

  const dataRangeWrong = {
    ...initialState,
    min: 0,
    max: 0,
    valueFrom: 0,
    step: 1,
    isRange: false,
  }

  const dataMinMaxWrong = {
    ...initialState,
    min: 10,
    max: 0,
    valueFrom: 0,
    step: 1,
    isRange: false,
  }

  const dataFromToWrong = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 10,
    valueTo: 8,
    step: 1,
    isRange: true,
  }


  // Correct cases
  const dataStepCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 10,
    isRange: false,
  }

  const dataValCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 10,
    step: 1,
    isRange: false,
  }

  const dataValSmallCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 1,
    isRange: false,
  }

  const dataRangeCorrect = {
    ...initialState,
    min: 0,
    max: 1,
    valueFrom: 0,
    step: 1,
    isRange: false,
  }

  const dataMinMaxCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 0,
    step: 1,
    isRange: false,
  }

  const dataFromToCorrect = {
    ...initialState,
    min: 0,
    max: 10,
    valueFrom: 10,
    valueTo: 10,
    step: 1,
    isRange: true,
  }

  test('Step can not be bigger than all range', () => {
    validator = new Validator(dataStepWrong);
    expect(validator.validateData()).toEqual(dataStepCorrect)
  })

  test('Value can not be bigger than max', () => {
    validator = new Validator(dataValWrong);
    expect(validator.validateData()).toEqual(dataValCorrect)
  })

  test('Value can not be smaller than min', () => {
    validator = new Validator(dataValWrong);
    expect(validator.validateData()).toEqual(dataValCorrect)
  })

  test('Value can not be smaller than min', () => {
    validator = new Validator(dataValSmallWrong);
    expect(validator.validateData()).toEqual(dataValSmallCorrect)
  })

  test('Min and max canot be the same', () => {
    validator = new Validator(dataRangeWrong);
    expect(validator.validateData()).toEqual(dataRangeCorrect)
  })

  test('Min can not be bigger than max', () => {
    validator = new Validator(dataMinMaxWrong);
    expect(validator.validateData()).toEqual(dataMinMaxCorrect)
  })

  test('Value from cannot be bigger than value to', () => {
    validator = new Validator(dataFromToWrong);
    expect(validator.validateData()).toEqual(dataFromToCorrect)
  })

})